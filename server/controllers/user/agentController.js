import { handleUserMessage, clearUserSession } from "../../ai_agent/agent.js";

/**
 * POST /api/v1/agent/chat
 * Send a message to the AI shopping assistant
 * Body: { message: string }
 */
const chat = async (req, res, next) => {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message is required and must be a non-empty string.",
        });
    }

    // Cap message length to prevent abuse
    if (message.length > 1000) {
        return res.status(400).json({
            success: false,
            message: "Message too long. Please keep it under 1000 characters.",
        });
    }

    const reply = await handleUserMessage(userId, message.trim());

    return res.status(200).json({
        success: true,
        data: { reply },
    });
};

/**
 * DELETE /api/v1/agent/session
 * Clear the current user's chat session / memory
 */
const endSession = async (req, res, next) => {
    const userId = req.user?.id;
    await clearUserSession(userId);

    return res.status(200).json({
        success: true,
        message: "Chat session cleared successfully.",
    });
};

export default { chat, endSession };
