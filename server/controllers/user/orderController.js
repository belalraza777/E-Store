import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";
import { sendEmail } from "../../config/email.js";
import mongoose from "mongoose";

// Create order
// POST /api/v1/orders
// Body: { items: [{ productID, quantity }], shippingAddress{ address, city, postalCode, country }, paymentMethod }
// Transactional approach used to ensure atomicity [means all-or-nothing execution] of stock deduction and order creation, with proper error handling and email notifications.
const createOrder = async (req, res, ) => {
    //Start transaction session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extract order details from request body
        const { items, shippingAddress, paymentMethod } = req.body;
        const userId = req.user.id;

        //ProductIDs extraction from items
        const productIds = items.map((item) => item.product);

        // Validate products exist
        const products = await Product.find({ _id: { $in: productIds } }).session(session).lean();

        if (products.length !== productIds.length) {
            await session.abortTransaction(); // Abort if product missing
            session.endSession();
            return res.status(404).json({ success: false, message: "Product not found" });
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
                { new: true, session }
            ); // Atomically check and deduct stock

            if (!product) {
                await session.abortTransaction(); // Abort if insufficient stock
                session.endSession();
                return res.status(400).json({ success: false, message: `Insufficient stock for product ID: ${item.product}` });
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
        }], { session });

        await session.commitTransaction(); // Commit if everything successful
        session.endSession(); // End session after commit

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

        return res.status(201).json({ success: true, message: "Order placed", data: order[0] });

    } catch (error) {
        // Abort transaction and clean up session on any unexpected error
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        throw error; // Let asyncWrapper handle passing to next()
    }
};


// Get orders for current user
const getMyOrders = async (req, res, next) => {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
        .populate("items.product", "title slug price discount images")
        .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: orders });
};


// Get single order by ID
const getOrderById = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id)
        .populate("items.product", "title slug price discount images")
        .populate("user", "name email");

    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }


    // Verify order belongs to user (handle populated or unpopulated user)
    const orderUserId = order.user && order.user._id ? order.user._id.toString() : order.user.toString();
    if (orderUserId !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    return res.status(200).json({ success: true, data: order });
};


//Cancel order by user
const cancelOrder = async (req, res, next) => {
    const { id } = req.params;
    const reason = req?.body?.reason;
    const userId = req.user?.id;

    if (!reason || typeof reason !== "string") {
        return res.status(400).json({ success: false, message: "Cancel Reason is Required" });
    }

    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Verify order belongs to user
    if (order.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    // Check if order can be cancelled
    if (order.isCancelled) {
        return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }

    if (order.isDelivered) {
        return res.status(400).json({ success: false, message: "Cannot cancel delivered order" });
    }

    // Cancel order
    order.orderStatus = "cancelled";
    order.isCancelled = true;
    if (reason && reason.trim()) {
        order.cancelReason = reason.trim();
    }
    await order.save();
    await order.populate("items.product", "title slug price discount");

    //Restock the products
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

    return res.status(200).json({ success: true, message: "Order cancelled successfully", data: order });
};

export default {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
};
