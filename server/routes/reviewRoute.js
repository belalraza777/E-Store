import express from "express";
import reviewController from "../controllers/reviewController.js";
import verifyAuth  from "../middlewares/verifyAuth.js";

const router = express.Router();

// POST /api/v1/reviews/:productId - Add review [body: { rating, comment }]
router.post("/:productId", verifyAuth, reviewController.addReview);

// GET /api/v1/reviews/product/:productId - Get product reviews
router.get("/product/:productId", reviewController.getProductReviews);

// DELETE /api/v1/reviews/:reviewId - Delete review
router.delete("/:reviewId", verifyAuth, reviewController.deleteReview);

export default router;
