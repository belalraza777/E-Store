import Product from "../../models/productModel.js";
import Wishlist from "../../models/wishlistModel.js";


// GET /api/v1/wishlist/
// Get user's wishlist
const getWishlist = async (req, res, next) => {
    const userId = req?.user?.id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json({ success: true, data: wishlist, message: "Wishlist retrieved successfully" });};

// POST /api/v1/wishlist/
// Add product to wishlist
const addToWishlist = async (req, res, next) => {

    const { productId } = req.body;
    const userId = req?.user?.id;
    const product = await Product.findById(productId);
    // Check if product exists
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    // Check if wishlist exists for user
    let wishlist = await Wishlist.findOne({ user: userId });
    // If wishlist doesn't exist, create a new one
    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [productId] });
    }
    // If wishlist exists, add product to it
    else {
        // Check if product is already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        // Add product to wishlist
        wishlist.products.push(productId);
    }

    const savedWishlist = await wishlist.save();

    res.status(200).json({ sucess: true, data: savedWishlist, message: "Product added to wishlist" });
};

//DELETE /api/v1/wishlist/
// Remove product from wishlist
const removeFromWishlist = async (req, res, next) => {
    const { productId } = req.body;
    const userId = req?.user?.id;
    const product = await Product.findById(productId);
    // Check if product exists
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    // Check if wishlist exists for user
    let wishlist = await Wishlist.findOne({ user: userId });
    // If wishlist doesn't exist, return error
    if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
    }
    // If wishlist exists, remove product from it
    // Check if product is in wishlist
    if (!wishlist.products.some(p => p.toString() === productId.toString())) {
        return res.status(400).json({ message: "Product not in wishlist" });
    }
    // Remove product from wishlist
    const savedWishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { $pull: { products: productId } },
        { new: true }
    );

    res.status(200).json({ sucess: true, data: savedWishlist, message: "Product removed from wishlist" });
}

export default {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
