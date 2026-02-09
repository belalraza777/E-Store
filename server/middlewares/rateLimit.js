import rateLimit from "express-rate-limit";

// Global limiter: applies to all routes
export const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 400, // limit each IP to 400 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Auth limiter: stricter limits for login/signup/reset
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per IP in 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many Authentication attempts. Please wait 15 minutes.",
  },
});

// Search limiter: prevent search API abuse
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many search requests. Please try again in a minute.",
  },
});

// Review create limiter: prevent review spam
export const reviewCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 new reviews per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reviews submitted. Please try again later.",
  },
});

// Review delete limiter
export const reviewDeleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many review delete attempts. Please try again later.",
  },
});

// Order create limiter: prevent order spam / abuse
export const orderCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // 15 orders per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role === "admin",
  message: {
    success: false,
    message: "Too many orders. Please try again in a few minutes.",
  },
});

// Order cancel limiter
export const orderCancelLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 cancel attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many cancel attempts. Please try again later.",
  },
});

// Cart write limiter: add/update/remove cart items (shared counter)
export const cartWriteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 80, // 80 cart mutations per 10 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many cart updates. Please slow down and try again later.",
  },
});

// Profile update limiter: avatar, profile patch (admins skip)
export const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role === "admin",
  message: {
    success: false,
    message: "Too many profile updates. Please try again later.",
  },
});

// Admin product limiter: create/update/delete products (admins skip, no limit)
export const adminProductLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 admin product ops per 15 min per IP (non-admin only; admin skipped)
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.role === "admin",
  message: {
    success: false,
    message: "Too many product changes. Please try again later.",
  },
});

// OAuth limiter: Google sign-in start + callback
export const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 OAuth attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OAuth attempts. Please try again later.",
  },
});

// AI Agent limiter: for logged-in users
export const agentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // 15 messages per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages. Please slow down and try again shortly.",
  },
});


