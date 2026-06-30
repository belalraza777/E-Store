import * as wishlistService from "../../services/wishlistService.js";

// GET /api/v1/wishlist/
// Get user's wishlist
const getWishlist = async (req, res) => {
    const userId = req?.user?.id;
    const wishlist = await wishlistService.getWishlistLogic(userId);

    // If wishlist doesn't exist or is empty, return the same 200/false response as before
    if (!wishlist || wishlist.products.length === 0) {
        return res.status(200).json({ success: false, message: "Wishlist not found", data: null });
    }

    res.status(200).json({ success: true, data: wishlist, message: "Wishlist retrieved successfully" });
};

// POST /api/v1/wishlist/
// Add product to wishlist
const addToWishlist = async (req, res) => {
    const { productId } = req.body || {};
    const userId = req?.user?.id;

    const savedWishlist = await wishlistService.addToWishlistLogic(userId, productId);

    res.status(200).json({ success: true, data: savedWishlist, message: "Product added to wishlist" });
};

// DELETE /api/v1/wishlist/:productId
// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const userId = req?.user?.id;

    const savedWishlist = await wishlistService.removeFromWishlistLogic(userId, productId);

    res.status(200).json({ success: true, data: savedWishlist, message: "Product removed from wishlist" });
};

export default {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};