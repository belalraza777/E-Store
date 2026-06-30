import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { sendEmail } from "../config/email.js";

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * CREATE RAZORPAY ORDER
 * Returns { success: boolean, statusCode, message?, razorpayOrder? }
 */
export const createRazorpayOrderLogic = async (orderId) => {
    if (!orderId) {
        return {
            success: false,
            statusCode: 400,
            message: "Order ID is required",
        };
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return {
            success: false,
            statusCode: 404,
            message: "Order not found",
        };
    }

    // Prevent double payment
    if (order.paymentStatus === "paid") {
        return {
            success: false,
            statusCode: 400,
            message: "Order already paid",
        };
    }

    if (order.paymentMethod !== "Online") {
        return {
            success: false,
            statusCode: 400,
            message: "Payment method is not Online",
        };
    }

    const amount = order.totalAmount;

    if (!amount || isNaN(amount) || amount <= 0) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid order amount",
        };
    }

    // Razorpay order options
    const options = {
        amount: Math.round(amount * 100), // paise
        currency: "INR",
        receipt: `order_${order._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save Razorpay orderId in DB
    order.razorpay = {
        orderId: razorpayOrder.id,
    };
    order.paymentStatus = "pending";

    await order.save();

    return {
        success: true,
        razorpayOrder,
    };
};

/**
 * VERIFY RAZORPAY PAYMENT
 * Returns { success: boolean, statusCode, message?, ... }
 */
export const verifyPaymentLogic = async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
}) => {
    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !orderId
    ) {
        return {
            success: false,
            statusCode: 400,
            message: "Missing payment details",
        };
    }

    const order = await Order.findById(orderId).populate("user", "email");

    if (!order) {
        return {
            success: false,
            statusCode: 404,
            message: "Order not found",
        };
    }

    if (order.paymentStatus === "paid") {
        return {
            success: true,
            statusCode: 200,
            message: "Payment already verified",
        };
    }

    // Prevent duplicate failure handling from restoring stock multiple times.
    if (order.paymentStatus === "failed" && order.isCancelled) {
        return {
            success: false,
            statusCode: 400,
            message: "Order already cancelled due to payment failure",
        };
    }

    // Validate Razorpay orderId mapping
    if (order.razorpay?.orderId !== razorpay_order_id) {
        return {
            success: false,
            statusCode: 400,
            message: "Order mismatch",
        };
    }

    // Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        // Payment failed → mark order as failed/cancelled and restore stock
        order.paymentStatus = "failed";
        order.orderStatus = "cancelled";
        order.isCancelled = true;
        order.cancelReason = "Payment verification failed";
        await order.save();

        // Restore stock for all items
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        // Email is non-critical and should not block cancellation flow.
        if (order?.user?.email) {
            sendEmail(
                order.user.email,
                "Order Cancelled - E-Store",
                `Your order (ID: ${order._id}) has been cancelled due to payment verification failure. If you have questions, contact support.\n\n- E-Store Team`
            ).catch((err) => console.error("Order cancellation email failed:", err));
        }

        return {
            success: false,
            statusCode: 400,
            message: "Invalid payment signature",
        };
    }

    // Payment verified → update order
    order.paymentStatus = "paid";
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;

    await order.save();

    // Send order confirmation email
    if (order?.user?.email) {
        sendEmail(
            order.user.email,
            "Payment Confirmation - E-Store",
            `Your payment for order ${order._id} has been successfully processed. Thank you for shopping with us!`
        ).catch((err) => console.error("Payment confirmation email failed:", err));
    }

    return {
        success: true,
        statusCode: 200,
        message: "Payment verified successfully",
    };
};

/**
 * MARK PAYMENT FAILED (user cancellation / timeout)
 * Returns { success: boolean, statusCode, message }
 */
export const markPaymentFailedLogic = async (orderId, reason) => {
    if (!orderId) {
        return {
            success: false,
            statusCode: 400,
            message: "Order ID is required",
        };
    }

    const order = await Order.findById(orderId).populate("user", "email");

    if (!order) {
        return {
            success: false,
            statusCode: 404,
            message: "Order not found",
        };
    }

    if (order.paymentMethod !== "Online") {
        return {
            success: false,
            statusCode: 400,
            message: "Payment method is not Online",
        };
    }

    if (order.paymentStatus === "paid") {
        return {
            success: false,
            statusCode: 400,
            message: "Order already paid",
        };
    }

    // Prevent duplicate failure callbacks from restoring stock multiple times.
    if (order.paymentStatus === "failed" && order.isCancelled) {
        return {
            success: true,
            statusCode: 200,
            message: "Order already cancelled",
        };
    }

    order.paymentStatus = "failed";
    order.orderStatus = "cancelled";
    order.isCancelled = true;
    order.cancelReason = reason || "Payment cancelled by user";
    await order.save();

    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
        });
    }

    if (order?.user?.email) {
        sendEmail(
            order.user.email,
            "Order Cancelled - E-Store",
            `Your order (ID: ${order._id}) has been cancelled. Reason: ${order.cancelReason}. If you have questions, contact support.\n\n- E-Store Team`
        ).catch((err) => console.error("Order cancellation email failed:", err));
    }

    return {
        success: true,
        statusCode: 200,
        message: "Order cancelled successfully",
    };
};