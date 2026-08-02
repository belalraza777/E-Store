import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { globalLimiter } from "./rateLimit.js";
import passport from "../config/passport.js";

const getAllowedOrigins = () => {
    const configuredOrigins = process.env.FRONTEND_URL;

    if (!configuredOrigins) {
        return ["http://localhost:5173"];
    }

    return configuredOrigins
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean);
};

// Setup all middlewares
export const setupMiddlewares = (app) => {
    // Trust the first proxy in front of the app
    if (process.env.NODE_ENV === 'production') {
        app.set('trust proxy', 1);
    }

    app.use(express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors({
        origin: (origin, callback) => {
            const allowedOrigins = getAllowedOrigins();

            if (!origin) {
                return callback(null, true);
            }

            const normalizedOrigin = origin.replace(/\/$/, "");
            if (allowedOrigins.includes(normalizedOrigin)) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(morgan("combined"));
    app.use(globalLimiter);
    app.use(passport.initialize());
};

