import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// ADMIN: Get all orders
export const getAllOrdersLogic = async () => {
    const orders = await Order.find()
        .populate("items.product", "title slug price discount")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return orders;
};

// ADMIN: Update order status/payment status
export const updateOrderStatusLogic = async (orderId, orderStatus, paymentStatus) => {
    const order = await Order.findById(orderId);
    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    order.orderStatus = orderStatus;
    if (paymentStatus) {
        order.paymentStatus = paymentStatus.trim();
    }

    // Auto-update isDelivered when order is delivered
    if (orderStatus.trim() === "delivered" && !order.isCancelled) {
        order.isDelivered = true;
    }

    // Auto-update isCancelled when order is cancelled
    if (orderStatus.trim() === "cancelled") {
        order.isCancelled = true;
    }

    await order.save();
    await order.populate("items.product", "title slug price discount");
    await order.populate("user", "name email");

    return order;
};

// ADMIN: Filter orders by status and/or postalCode
export const filterOrdersLogic = async (status, postalCode) => {
    const filter = {};
    if (status && status.trim()) {
        filter.orderStatus = status.trim();
    }
    if (postalCode && postalCode.trim()) {
        filter["shippingAddress.postalCode"] = { $regex: postalCode.trim(), $options: "i" };
    }

    const orders = await Order.find(filter)
        .populate("items.product", "title slug price discount")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return { data: orders, count: orders.length };
};