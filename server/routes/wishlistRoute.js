import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";
import wishlistController from "../controllers/user/wishlistController.js";

const router = express.Router();

// GET /api/v1/wishlist/ - Get user's wishlist
router.get("/", verifyAuth, wishlistController.getWishlist);
// POST /api/v1/wishlist/ - Add product to wishlist [body: { productId }]
router.post("/", verifyAuth, wishlistController.addToWishlist);
// DELETE /api/v1/wishlist/ - Remove product from wishlist
router.delete("/", verifyAuth, wishlistController.removeFromWishlist);

export default router;