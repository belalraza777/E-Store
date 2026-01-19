import Cart from "../../models/cartModel.js";
import Product from "../../models/productModel.js";

/**
 * Add item to cart or update quantity if item already exists
 * POST /api/v1/cart
 * Body: { productId, quantity }
 */
const addToCart = async (req, res, next) => {
    const { productId, quantity = 1 } = req.params;
    const userId = req.user.id;

    // Validate quantity is positive and is a valid number
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ success: false, message: "Quantity must be a positive number" });
    }

    // Validate product exists in database
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if cart exists for user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        // Create new cart for user if doesn't exist
        cart = new Cart({
            user: userId,
            items: [
                {
                    product: productId,
                    quantity,
                    price: product.price,
                    discountPrice: product.discountPrice || 0,
                }
            ]
        });
    } else {
        // Cart exists - check if item already exists in it
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            // Item exists - increment quantity and update price if it changed
            existingItem.quantity += quantity;
            existingItem.price = product.price;
            existingItem.discountPrice = product.discountPrice || 0;
        } else {
            // Item doesn't exist - add new item to cart
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
                discountPrice: product.discountPrice || 0,
            });
        }
    }

    // Calculate total price by summing all items (price * quantity)
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Calculate total discount price (sum of per-item discounts)
    cart.totalDiscountPrice = cart.items.reduce((total, item) => total + ((item.discountPrice || 0) * item.quantity), 0);
    // Save cart to database and populate product details for response
    await cart.save();
    await cart.populate('items.product', 'name price image');

    return res.status(201).json({ success: true, data: cart, message: "Item added to cart" });
};

/**
 * Retrieve the current user's cart with all items and product details
 * GET /api/v1/cart
 */
const getCart = async (req, res, next) => {
    const userId = req.user.id;

    // Fetch user's cart and populate product details (name, price, image, slug)
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price image slug');

    if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({ success: true, data: cart });
};

/**
 * Update quantity of an item in the cart
 * PUT /api/v1/cart/:itemId/:quantity
 * Params: { itemId, quantity }
 */
const updateCartItem = async (req, res, next) => {
    const { itemId, quantity } = req.params;  // Get itemId and quantity from URL params
    const userId = req.user.id;

    // Validate quantity is positive and is a valid number
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ success: false, message: "Quantity must be a positive number" });
    }

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find specific cart item by ID using Mongoose's .id() method
    // itemId should be the _id of the item in the cart.items array, not the product ID
    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
        return res.status(404).json({ 
            success: false, 
            message: "Item not found in cart",
        });
    }

    // Update the item quantity
    cartItem.quantity = qty;

    // Recalculate total price after quantity change
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Recalculate total discount price
    cart.totalDiscountPrice = cart.items.reduce((total, item) => total + ((item.discountPrice || 0) * item.quantity), 0);

    // Save updated cart and populate product details
    await cart.save();
    await cart.populate('items.product', 'name price image slug');

    return res.status(200).json({ success: true, data: cart, message: "Cart item updated" });
};

/**
 * Remove an item from the cart
 * DELETE /api/v1/cart/:itemId
 */
const removeFromCart = async (req, res, next) => {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find item by ID
    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
        return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    // Delete the item from cart array using Mongoose's deleteOne() method
    cart.items.id(itemId).deleteOne();

    // Recalculate total price after item removal
    cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Recalculate total discount price
    cart.totalDiscountPrice = cart.items.reduce((total, item) => total + ((item.discountPrice || 0) * item.quantity), 0);

    // Save updated cart and populate product details for response
    await cart.save();
    await cart.populate('items.product', 'name price image slug');

    return res.status(200).json({ success: true, message: `Item removed from cart ${itemId}` });
};

// Export all cart controller functions
export default {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};
