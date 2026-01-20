import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";

// ADMIN: Get all orders 
const getAllOrders = async (req, res, next) => {
    const orders = await Order.find()
        .populate("items.product", "title slug price discount")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: orders });
};

// ADMIN: Update order status/payment status
const updateOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
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

    return res.status(200).json({ success: true, message: "Order updated", data: order });
};

// ADMIN: Filter orders by status and/or postalCode
// GET /api/v1/admin/orders/filter?status=pending&postalCode=74000
const filterOrders = async (req, res, next) => {
    const { status, postalCode } = req.query;

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

    return res.status(200).json({ success: true, data: orders, count: orders.length });
};

export default {
    getAllOrders,
    updateOrderStatus,
    filterOrders,
};
