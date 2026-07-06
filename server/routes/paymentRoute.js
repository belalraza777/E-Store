import express from "express";
import {
  createOrder,
  verifyPayment,
  markPaymentFailed,
  webhookHandler,
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

// Razorpay webhook — called by Razorpay's servers, not the logged-in user.
// No verifyAuth here; trust comes from signature verification inside the handler.
router.post("/webhook", asyncWrapper(webhookHandler));

export default router;