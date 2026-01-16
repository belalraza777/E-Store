import express from "express";
const router = express.Router();
import cartController from "../controllers/cartController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";


// Get user's cart
router.get("/", verifyAuth, asyncWrapper(cartController.getCart));

// Add item to cart
router.post("/:productId/:quantity",verifyAuth, asyncWrapper(cartController.addToCart));

// Update item quantity in cart
router.put("/:itemId/:quantity", verifyAuth, asyncWrapper(cartController.updateCartItem));

// Remove item from cart
router.delete("/:itemId", verifyAuth, asyncWrapper(cartController.removeFromCart));

export default router;
