import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import { sendEmail } from "../../config/email.js";


// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * CREATE RAZORPAY ORDER
 */
export const createOrder = async (req, res, next) => {

    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Order ID is required",
        });
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }

    // Prevent double payment
    if (order.paymentStatus === "paid") {
        return res.status(400).json({
            success: false,
            message: "Order already paid",
        });
    }

    if (order.paymentMethod !== "Online") {
        return res.status(400).json({
            success: false,
            message: "Payment method is not Online",
        });
    }

    const amount = order.totalAmount;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid order amount",
        });
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

    res.status(201).json({
        success: true,
        razorpayOrder,
    });

};

/**
 * VERIFY RAZORPAY PAYMENT
 */

export const verifyPayment = async (req, res, next) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
    } = req.body;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !orderId
    ) {
        return res.status(400).json({
            success: false,
            message: "Missing payment details",
        });
    }

    const order = await Order.findById(orderId).populate("user", "email");

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }

    // Validate Razorpay orderId mapping
    if (order.razorpay?.orderId !== razorpay_order_id) {
        return res.status(400).json({
            success: false,
            message: "Order mismatch",
        });
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

        // Send order cancellation email
        if (order?.user?.email) {
            await sendEmail({
                to: order.user.email,
                subject: "Order Cancelled - E-Store",
                text: `Your order (ID: ${order._id}) has been cancelled due to payment verification failure. If you have questions, contact support.\n\n- E-Store Team`,
            });
        }

        // Restore stock for all items
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid payment signature",
        });
    }

    // Payment verified → update order
    order.paymentStatus = "paid";
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;

    await order.save();

    // Send order confirmation email
    if (order?.user?.email) {
        await sendEmail({
            to: order.user.email,
            subject: "Payment Confirmation - E-Store",
            text: `Your payment for order ${order._id} has been successfully processed. Thank you for shopping with us!`,
        });
    }

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
    });
};