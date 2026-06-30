import * as reviewService from "../../services/reviewService.js";

// POST /api/v1/reviews/:productId
// Add review for a product
const addReview = async (req, res) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await reviewService.addReviewLogic(productId, userId, rating, comment);

    return res.status(201).json({ success: true, message: "Review added successfully", data: review });
};

// GET /api/v1/reviews/product/:productId
// Get all reviews for a product
const getProductReviews = async (req, res) => {
    const { productId } = req.params;

    // Service returns the full response object (already formatted with success/data/averages)
    const response = await reviewService.getProductReviewsLogic(productId);

    return res.status(200).json(response);
};

// DELETE /api/v1/reviews/:reviewId
// Delete a review (user or admin)
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    await reviewService.deleteReviewLogic(reviewId, userId, userRole);

    return res.status(200).json({ success: true, message: "Review deleted successfully" });
};

export default {
    addReview,
    getProductReviews,
    deleteReview,
};