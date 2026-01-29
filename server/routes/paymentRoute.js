import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/user/paymentController.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import asyncWrapper from "../utils/asyncWrapper.js";


const router = express.Router();

// Create Razorpay order
router.post("/create-order", verifyAuth, asyncWrapper(createOrder));

// Verify payment signature
router.post("/verify", verifyAuth, asyncWrapper(verifyPayment));

export default router;