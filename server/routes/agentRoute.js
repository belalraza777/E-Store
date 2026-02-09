import express from "express";
const router = express.Router();
import agentController from "../controllers/user/agentController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import { agentLimiter } from "../middlewares/rateLimit.js";

// POST /api/v1/agent/chat - Send a message to the AI shopping assistant
router.post("/chat", verifyAuth, agentLimiter, asyncWrapper(agentController.chat));

// DELETE /api/v1/agent/session - Clear the current user's chat session / memory
router.delete("/session", verifyAuth, asyncWrapper(agentController.endSession));

export default router;
