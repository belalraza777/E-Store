import Review from "../../models/reviewModel.js";
import Product from "../../models/productModel.js";
import Order from "../../models/orderModel.js";
import { getCache, setCache, deleteCachePattern } from "../../utils/cache.js";

// POST /api/v1/reviews/:productId
// Add review for a product
const addReview = async (req, res, next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if user purchased this product (verified purchase)
    const order = await Order.findOne({
        user: userId,
        "items.product": productId,
        isDelivered: true,
    });
    
    // Mark review as verified if user has purchased the product
    const isVerified = !!order;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
        return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment: comment?.trim() || "",
        isVerified,
    });

    await review.populate("user", "name");

    // Invalidate product reviews cache
    await deleteCachePattern(`productReviews:${productId}`);

    return res.status(201).json({ success: true, message: "Review added successfully", data: review });
};

// GET /api/v1/reviews/product/:productId
// Get all reviews for a product
const getProductReviews = async (req, res, next) => {
    const { productId } = req.params;

    // Try cache first
    const cacheKey = `productReviews:${productId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviews = await Review.find({ product: productId })
        .populate("user", "name")
        .sort({ createdAt: -1 }).lean();

    // Calculate average rating (only verified reviews)
    const verifiedReviews = reviews.filter((r) => r.isVerified);
    const avgRating =
        verifiedReviews.length > 0
            ? (verifiedReviews.reduce((sum, review) => sum + review.rating, 0) / verifiedReviews.length).toFixed(1)
            : 0;

    const response = {
        success: true,
        data: reviews,
        averageRating: avgRating,
        totalReviews: reviews.length,
        verifiedReviews: verifiedReviews.length,
    };
    await setCache(cacheKey, response, 300); // 5 min TTL
    return res.status(200).json(response);
};

// DELETE /api/v1/reviews/:reviewId
// Delete a review (user or admin)
const deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Check authorization (owner or admin)
    if (review.user.toString() !== userId && userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Invalidate product reviews cache
    await deleteCachePattern(`productReviews:${productId}`);
    return res.status(200).json({ success: true, message: "Review deleted successfully" });
};

export default {
    addReview,
    getProductReviews,
    deleteReview,
};
