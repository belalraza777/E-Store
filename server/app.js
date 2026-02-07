import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import { setupMiddlewares } from "./middlewares/setupMiddlewares.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoute.js";
import oauthRoutes from "./routes/oauthRoute.js";
import productRoutes from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import reviewRoutes from "./routes/reviewRoute.js";
import profileRoutes from "./routes/profileRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import recommendationRoutes from "./routes/recommendationRoute.js";
import wishlistRoutes from "./routes/wishlistRoute.js";

// Setup middlewares for the app [ALl incoming requests pass through here]
setupMiddlewares(app);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ROUTES
app.use("/api/v1/auth", authRoutes); // Local auth routes
app.use("/api/v1/auth", oauthRoutes); // OAuth routes
app.use("/api/v1/products", productRoutes); // Product routes
app.use("/api/v1/cart", cartRoutes); // Cart routes
app.use("/api/v1/orders", orderRoutes); // Order routes
app.use("/api/v1/reviews", reviewRoutes); // Review routes
app.use("/api/v1/profile", profileRoutes); // Profile routes
app.use("/api/v1/payments", paymentRoutes); // Payment routes
app.use("/api/v1/recommendations", recommendationRoutes); // Recommendation routes
app.use("/api/v1/wishlists", wishlistRoutes); // Wishlist routes


// Error handling middleware
app.use(errorHandler);

export default app;