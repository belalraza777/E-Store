import * as orderService from "../../services/orderService.js";

// Create order
// POST /api/v1/orders
// Body: { items: [{ productID, quantity }], shippingAddress{ address, city, postalCode, country }, paymentMethod }
const createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    const order = await orderService.createOrderLogic(userId, items, shippingAddress, paymentMethod);

    return res.status(201).json({ success: true, message: "Order placed", data: order });
};

// Get orders for current user
const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    const orders = await orderService.getMyOrdersLogic(userId);

    return res.status(200).json({ success: true, data: orders });
};

// Get single order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await orderService.getOrderByIdLogic(id, userId);

    return res.status(200).json({ success: true, data: order });
};

// Cancel order by user
const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const reason = req?.body?.reason;
    const userId = req.user?.id;
    const order = await orderService.cancelOrderLogic(id, userId, reason);

    return res.status(200).json({ success: true, message: "Order cancelled successfully", data: order });
};

export default {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
};