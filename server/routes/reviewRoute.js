import express from "express";
import reviewController from "../controllers/user/reviewController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import { reviewCreateLimiter, reviewDeleteLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

// GET /api/v1/reviews/product/:productId - Get product reviews (no limiter)
router.get("/product/:productId", asyncWrapper(reviewController.getProductReviews));

// POST /api/v1/reviews/:productId - Add review [body: { rating, comment }]
router.post("/:productId", verifyAuth, reviewCreateLimiter, asyncWrapper(reviewController.addReview));

// DELETE /api/v1/reviews/:reviewId - Delete review
router.delete("/:reviewId", verifyAuth, reviewDeleteLimiter, asyncWrapper(reviewController.deleteReview));

export default router;
