import express from "express";
import passport from "../config/passport.js";
import User from "../models/userModel.js";
import { createSessionLogic } from "../services/authService.js";
import { setAuthCookies } from "../helper/authUtils.js";
import { oauthLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

const getFrontendRedirectUrl = (req) => {
    if (process.env.GOOGLE_FRONTEND_REDIRECT_URL) {
        return process.env.GOOGLE_FRONTEND_REDIRECT_URL;
    }

    if (process.env.FRONTEND_URL) {
        return `${process.env.FRONTEND_URL.replace(/\/$/, "")}/oauth-success`;
    }

    const requestOrigin = req.get("origin") || req.get("referer");
    if (requestOrigin) {
        return `${requestOrigin.replace(/\/$/, "")}/oauth-success`;
    }

    return "http://localhost:5173/oauth-success";
};

// Start Google OAuth
router.get(
    "/google",
    oauthLimiter,
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
router.get(
    "/google/callback",
    oauthLimiter,
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        const user = await User.findOne({ email: req?.user?.email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not exist!", error: "Authentication Failed" });
        }
        // Create session + set access and refresh token cookies
        const { accessToken, refreshToken } = await createSessionLogic(user);
        setAuthCookies(res, accessToken, refreshToken);

        // redirect to frontend
        res.redirect(getFrontendRedirectUrl(req));
    }
);

export default router;