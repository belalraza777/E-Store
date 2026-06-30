import * as adminOrderService from "../../services/adminOrderService.js";

// ADMIN: Get all orders
const getAllOrders = async (req, res) => {
    const orders = await adminOrderService.getAllOrdersLogic();
    return res.status(200).json({ success: true, data: orders });
};

// ADMIN: Update order status/payment status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await adminOrderService.updateOrderStatusLogic(id, orderStatus, paymentStatus);
    return res.status(200).json({ success: true, message: "Order updated", data: order });
};

// ADMIN: Filter orders by status and/or postalCode
// GET /api/v1/admin/orders/filter?status=pending&postalCode=74000
const filterOrders = async (req, res) => {
    const { status, postalCode } = req.query;

    const result = await adminOrderService.filterOrdersLogic(status, postalCode);
    return res.status(200).json({ success: true, data: result.data, count: result.count });
};

export default {
    getAllOrders,
    updateOrderStatus,
    filterOrders,
};