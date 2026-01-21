import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";

// Create order
// POST /api/v1/orders
// Body: { items: [{ productID, quantity }], shippingAddress{ address, city, postalCode, country }, paymentMethod }
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
            price: prod.price,
            discount: prod.discountPrice || 0,
        };
    });

    // Calculate total
    const discountTotal = orderItems.reduce((sum, item) => sum + item.discount * item.quantity, 0);
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create and return order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod.trim(),
        subtotal: subtotal,
        totalAmount: discountTotal,
    });

    await order.populate("items.product", "title price discount slug");

    //Reduce stock quantity for each product
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } });
    }

    return res.status(201).json({ success: true, message: "Order placed", data: order });
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
        .populate("items.product", "title slug price discount images");

    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Verify order belongs to user
    if (order.user.toString() !== userId) {
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
        await Product.findByIdAndUpdate(item.product._id, { $inc: { stockQuantity: item.quantity } });
    }

    return res.status(200).json({ success: true, message: "Order cancelled successfully", data: order });
};

export default {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
};
