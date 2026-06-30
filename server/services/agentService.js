import { handleUserMessage, clearUserSession } from "../ai_agent/agent.js";

/**
 * Process a chat message for the given user.
 * Throws error with statusCode for validation/agent failures.
 */
export const chatLogic = async (userId, message) => {
    if (!message || typeof message !== "string" || !message.trim()) {
        const error = new Error("Message is required.");
        error.statusCode = 400;
        throw error;
    }

    if (message.length > 1000) {
        const error = new Error("Message too long (max 1000 chars).");
        error.statusCode = 400;
        throw error;
    }

    try {
        const reply = await handleUserMessage(userId, message.trim());
        return reply;
    } catch (err) {
        console.error(`Agent error [${userId}]:`, err.message);
        const error = new Error("AI assistant error. Please try again.");
        error.statusCode = 500;
        throw error;
    }
};

/**
 * Clear the chat session/memory for a user.
 */
export const endSessionLogic = async (userId) => {
    await clearUserSession(userId);
};