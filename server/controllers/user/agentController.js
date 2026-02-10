import { handleUserMessage, clearUserSession } from "../../ai_agent/agent.js";

const chat = async (req, res, next) => {
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ success: false, message: "Message is required." });
    }

    if (message.length > 1000) {
        return res.status(400).json({ success: false, message: "Message too long (max 1000 chars)." });
    }

    try {
        const reply = await handleUserMessage(userId, message.trim());
        return res.status(200).json({ success: true, data: { reply } });
    } catch (err) {
        console.error(`Agent error [${userId}]:`, err.message);
        return res.status(500).json({ success: false, message: "AI assistant error. Please try again." });
    }
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
