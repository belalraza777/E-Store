import express from "express";
import {
  createOrder,
  verifyPayment,
  markPaymentFailed,
} from "../controllers/user/paymentController.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import asyncWrapper from "../utils/asyncWrapper.js";


const router = express.Router();

// Create Razorpay order
router.post("/create-order", verifyAuth, asyncWrapper(createOrder));

// Verify payment signature
router.post("/verify", verifyAuth, asyncWrapper(verifyPayment));
// Mark payment as failed and cancel order
router.post("/failed", verifyAuth, asyncWrapper(markPaymentFailed));

export default router;