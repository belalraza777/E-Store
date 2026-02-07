import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";
import wishlistController from "../controllers/user/wishlistController.js";
import asyncWrapper from "../utils/asyncWrapper.js";


const router = express.Router();

// GET /api/v1/wishlist/ - Get user's wishlist
router.get("/", verifyAuth, asyncWrapper(wishlistController.getWishlist));
// POST /api/v1/wishlist/ - Add product to wishlist [body: { productId }]
router.post("/", verifyAuth, asyncWrapper(wishlistController.addToWishlist));
// DELETE /api/v1/wishlist/:productId - Remove product from wishlist
router.delete("/:productId", verifyAuth, asyncWrapper(wishlistController.removeFromWishlist));

export default router;