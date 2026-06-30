import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import { sendEmail } from "../config/email.js";
// import mongoose from "mongoose";

/**
 * Contains pure business logic for orders.
 * Controllers only handle HTTP request/response and call these functions.
 */

// Create order
// POST /api/v1/orders
// Body: { items: [{ productID, quantity }], shippingAddress{ address, city, postalCode, country }, paymentMethod }
// Transactional approach used to ensure atomicity [means all-or-nothing execution] of stock deduction and order creation, with proper error handling and email notifications.
export const createOrderLogic = async (userId, items, shippingAddress, paymentMethod) => {
    // Transaction is temporarily disabled; using normal order flow for now.
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        // Extract order details from request body (now parameters)
        //ProductIDs extraction from items
        const productIds = items.map((item) => item.product);

        // Validate products exist
        const products = await Product.find({ _id: { $in: productIds } }).lean();

        if (products.length !== productIds.length) {
            // await session.abortTransaction();
            // session.endSession();
            // Instead of returning response, throw an error with status and message.
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        // Create order items and calculate totals with atomic stock deduction
        let orderItems = [];
        let subtotal = 0;
        let totalAmount = 0;
        // Loop through items to build order and check stock
        for (const item of items) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: { stock: -item.quantity }
                },
                { new: true }
            ); // Atomically check and deduct stock

            if (!product) {
                // await session.abortTransaction();
                // session.endSession();
                const error = new Error(`Insufficient stock for product ID: ${item.product}`);
                error.statusCode = 400;
                throw error;
            }

            orderItems.push({  // Build order item
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                discount: product.discountPrice ?? product.price,
            });
            // Calculate totals
            subtotal += product.price * item.quantity;
            totalAmount += (product.discountPrice ?? product.price) * item.quantity;
        }

        // Create and return order
        const order = await Order.create([{
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentMethod: paymentMethod.trim(),
            subtotal: subtotal,
            totalAmount: totalAmount,
        }]);

        // await session.commitTransaction();
        // session.endSession();

        await order[0].populate("items.product", "title price discount slug");

        // Send order confirmation email (non-critical, after transaction)
        const user = await User.findById(userId);
        if (user && user.email) {
            sendEmail(
                user.email,
                "Order Confirmation - E-Store",
                `Hi ${user.name},\n\nYour order has been placed successfully!\nOrder ID: ${order[0]._id}\nTotal: ₹${order[0].totalAmount}\n\nThank you for shopping with us!\n\n- E-Store Team`
            ).catch((err) => console.error("Order confirmation email failed:", err));
        }

        // Clear user's cart after order is placed.
        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [], totalPrice: 0, totalDiscountPrice: 0 } }
        );

        // Return the created order object (the first element of the array)
        return order[0];
    } catch (error) {
        // Abort transaction and clean up session on any unexpected error
        // if (session.inTransaction()) {
        //     await session.abortTransaction();
        // }
        // session.endSession();
        throw error; // Let asyncWrapper handle passing to next()
    }
};

// Get orders for current user
export const getMyOrdersLogic = async (userId) => {
    const orders = await Order.find({ user: userId })
        .populate("items.product", "title slug price discount images")
        .sort({ createdAt: -1 });

    return orders;
};

// Get single order by ID
export const getOrderByIdLogic = async (orderId, userId) => {
    const order = await Order.findById(orderId)
        .populate("items.product", "title slug price discount images")
        .populate("user", "name email");

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    // Verify order belongs to user (handle populated or unpopulated user)
    const orderUserId = order.user && order.user._id ? order.user._id.toString() : order.user.toString();
    if (orderUserId !== userId) {
        const error = new Error("Not authorized to view this order");
        error.statusCode = 403;
        throw error;
    }

    return order;
};

// Cancel order by user
export const cancelOrderLogic = async (orderId, userId, reason) => {
    if (!reason || typeof reason !== "string") {
        const error = new Error("Cancel Reason is Required");
        error.statusCode = 400;
        throw error;
    }

    const order = await Order.findById(orderId);
    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    // Verify order belongs to user
    if (order.user.toString() !== userId) {
        const error = new Error("Not authorized to cancel this order");
        error.statusCode = 403;
        throw error;
    }

    // Check if order can be cancelled
    if (order.isCancelled) {
        const error = new Error("Order is already cancelled");
        error.statusCode = 400;
        throw error;
    }

    if (order.isDelivered) {
        const error = new Error("Cannot cancel delivered order");
        error.statusCode = 400;
        throw error;
    }

    // Cancel order
    order.orderStatus = "cancelled";
    order.isCancelled = true;
    if (reason && reason.trim()) {
        order.cancelReason = reason.trim();
    }
    await order.save();
    await order.populate("items.product", "title slug price discount");

    // Restock the products
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: item.quantity } });
    }

    // Send order cancellation email
    const userCancel = await User.findById(userId);
    if (userCancel && userCancel.email) {
        await sendEmail(
            userCancel.email,
            "Order Cancelled - E-Store",
            `Hi ${userCancel.name},\n\nYour order (ID: ${order._id}) has been cancelled.\nReason: ${order.cancelReason || reason}\n\nIf you have questions, contact support.\n\n- E-Store Team`
        );
    }

    return order;
};