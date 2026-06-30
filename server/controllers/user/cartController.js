import * as cartService from "../../services/cartService.js";

/**
 * Add item to cart or update quantity if item already exists
 * POST /api/v1/cart
 * Body: { productId, quantity }
 */
const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.params; // Note: original used req.params
    const userId = req.user.id;

    const cart = await cartService.addToCartLogic(userId, productId, quantity);

    return res.status(201).json({ success: true, data: cart, message: "Item added to cart" });
};

/**
 * Retrieve the current user's cart with all items and product details
 * GET /api/v1/cart
 */
const getCart = async (req, res) => {
    const userId = req.user.id;

    const cart = await cartService.getCartLogic(userId);

    return res.status(200).json({ success: true, data: cart });
};

/**
 * Update quantity of an item in the cart
 * PUT /api/v1/cart/:itemId/:quantity
 * Params: { itemId, quantity }
 */
const updateCartItem = async (req, res) => {
    const { itemId, quantity } = req.params;  // Get itemId and quantity from URL params
    const userId = req.user.id;

    const cart = await cartService.updateCartItemLogic(userId, itemId, quantity);

    return res.status(200).json({ success: true, data: cart, message: "Cart item updated" });
};

/**
 * Remove an item from the cart
 * DELETE /api/v1/cart/:itemId
 */
const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;

    const { cart, itemId: removedId } = await cartService.removeFromCartLogic(userId, itemId);

    return res.status(200).json({ success: true, message: `Item removed from cart ${removedId}` });
};

// Export all cart controller functions
export default {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};