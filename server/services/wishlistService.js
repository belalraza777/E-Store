import Product from "../models/productModel.js";
import Wishlist from "../models/wishlistModel.js";

// Get user's wishlist
export const getWishlistLogic = async (userId) => {
    // Find wishlist for user and populate product details
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    // If wishlist doesn't exist or is empty, return null (controller will handle the response)
    if (!wishlist || wishlist.products.length === 0) {
        return null;
    }
    return wishlist;
};

// Add product to wishlist
export const addToWishlistLogic = async (userId, productId) => {
    if (!productId) {
        const error = new Error("Product ID is required");
        error.statusCode = 400;
        throw error;
    }

    const product = await Product.findById(productId);
    // Check if product exists
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    // Check if wishlist exists for user
    let wishlist = await Wishlist.findOne({ user: userId });
    // If wishlist doesn't exist, create a new one
    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [productId] });
    }
    // If wishlist exists, add product to it
    else {
        // Check if product is already in wishlist (compare as strings)
        if (wishlist.products.some(p => p.toString() === productId.toString())) {
            const error = new Error("Product already in wishlist");
            error.statusCode = 400;
            throw error;
        }
        // Add product to wishlist
        wishlist.products.push(productId);
    }

    const savedWishlist = await wishlist.save();
    return savedWishlist;
};

// Remove product from wishlist
export const removeFromWishlistLogic = async (userId, productId) => {
    if (!productId) {
        const error = new Error("Product ID is required");
        error.statusCode = 400;
        throw error;
    }

    const product = await Product.findById(productId);
    // Check if product exists
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    // Check if wishlist exists for user
    let wishlist = await Wishlist.findOne({ user: userId });
    // If wishlist doesn't exist, return error
    if (!wishlist) {
        const error = new Error("Wishlist not found");
        error.statusCode = 404;
        throw error;
    }

    // Check if product is in wishlist
    if (!wishlist.products.some(p => p.toString() === productId.toString())) {
        const error = new Error("Product not in wishlist");
        error.statusCode = 400;
        throw error;
    }

    // Remove product from wishlist
    const savedWishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { $pull: { products: productId } },
        { new: true }
    );

    return savedWishlist;
};