import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import { setupMiddlewares } from "./middlewares/setupMiddlewares.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoute.js";
import oauthRoutes from "./routes/oauthRoute.js";
import productRoutes from "./routes/productRoute.js";

// Setup middlewares for the app [ALl incoming requests pass through here]
setupMiddlewares(app);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", oauthRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/demo", (req, res) => {
  res.send(`
    <h1>
    OAuth Demo Successful! 
    You have successfully authenticated using OAuth.
    Role: ${req.user ? req.user.role : 'Guest'}
    </h1>
`);
});

// Error handling middleware
app.use(errorHandler);

export default app;