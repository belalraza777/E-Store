import express from "express";
const router = express.Router();
import cartController from "../controllers/user/cartController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import { cartWriteLimiter } from "../middlewares/rateLimit.js";

// Get user's cart (no write limiter)
router.get("/", verifyAuth, asyncWrapper(cartController.getCart));

// Add item to cart
router.post("/:productId/:quantity", verifyAuth, cartWriteLimiter, asyncWrapper(cartController.addToCart));

// Update item quantity in cart
router.put("/:itemId/:quantity", verifyAuth, cartWriteLimiter, asyncWrapper(cartController.updateCartItem));

// Remove item from cart
router.delete("/:itemId", verifyAuth, cartWriteLimiter, asyncWrapper(cartController.removeFromCart));

export default router;
