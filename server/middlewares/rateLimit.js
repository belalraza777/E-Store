import rateLimit from "express-rate-limit";

// Global limiter: applies to all routes
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});


// Auth limiter: stricter limits for login/signup
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per IP in 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login/signup attempts. Please wait 15 minutes.",
  },
});
