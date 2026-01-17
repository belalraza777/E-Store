import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create order
// POST /api/v1/orders
// Body: { items: [{ productID, quantity }], shippingAddress{ street, city, postalCode, country }, paymentMethod }
const createOrder = async (req, res, next) => {
    // Extract order details from request body
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    //ProductIDs extraction from items
    const productIds = items.map((item) => item.product);
    // Validate products exist
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    if (products.length !== productIds.length) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Build order items with pricing details
    const orderItems = items.map((item) => {
        // Find corresponding product details
        const prod = products.find((p) => p._id.toString() === item.product);
        // Construct order item
        return {
            product: item.product,
            quantity: item.quantity,
            price: prod.discountPrice ??  prod.price,
        };
    });

    // Calculate total
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create and return order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        totalAmount,
    });

    await order.populate("items.product", "title price");

    return res.status(201).json({ success: true, message: "Order placed", data: order });
};


// Get orders for current user
const getMyOrders = async (req, res, next) => {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
        .populate("items.product", "title slug price discountPrice")
        .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: orders });
};



// ADMIN: get all orders 
const getAllOrders = async (req, res, next) => {
    const orders = await Order.find()
        .populate("items.product", "title slug price discountPrice")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: orders });
};


// ADMIN: update order status/payment status
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
    if (orderStatus.trim() === "delivered") {
        order.isDelivered = true;
    }

    // Auto-update isCancelled when order is cancelled
    if (orderStatus.trim() === "cancelled") {
        order.isCancelled = true;
    }

    await order.save();
    await order.populate("items.product", "title slug price discountPrice");

    return res.status(200).json({ success: true, message: "Order updated", data: order });
};


// ADMIN: filter orders by status and/or postalCode
// GET /api/v1/orders/filter?status=pending&postalCode=74000
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
        .populate("items.product", "title slug price discountPrice")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: orders, count: orders.length });
};

export default {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    filterOrders,
};
