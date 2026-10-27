import express from "express";
const router = express.Router();
import usersController from "../controllers/common/authController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import { registerValidation, loginValidation, resetPasswordValidation } from "../middlewares/joiValidation.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import { authLimiter } from "../middlewares/rateLimit.js";


// Login routes
router.post("/login", loginValidation, authLimiter, asyncWrapper(usersController.loginUser));

// Signup routes
router.post("/register", registerValidation, authLimiter, asyncWrapper(usersController.registerUser));

/// Logout route (no verifyAuth: access token expire ho tab bhi session revoke hona chahiye)
router.get("/logout", asyncWrapper(usersController.logoutUser));

// Refresh token route
router.post("/refresh", asyncWrapper(usersController.refreshToken));

//to Check Login and role in frontend 
router.get("/check", asyncWrapper(usersController.checkUser));

//reset password
router.patch("/reset", verifyAuth, authLimiter, resetPasswordValidation, asyncWrapper(usersController.resetPassword));


// //otp base login 
// router.post('/request-otp', otpLimiter, asyncWrapper(usersController.requestOtp));   // Step 1: Generate & send OTP
// router.post('/verify-otp',otpLimiter, asyncWrapper(usersController.verifyOtp));     // Step 2: Verify OTP & login

export default router;
