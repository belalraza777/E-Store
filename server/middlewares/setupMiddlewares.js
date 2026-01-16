import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { globalLimiter } from "./rateLimit.js";
import passport from "../config/passport.js";

// Setup all middlewares
export const setupMiddlewares = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(morgan("dev"));
    app.use(globalLimiter);
    app.use(passport.initialize());
};
