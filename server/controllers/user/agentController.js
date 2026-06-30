import * as agentService from "../../services/agentService.js";

const chat = async (req, res) => {
    const { message } = req.body;
    const userId = req.user?.id;

    const reply = await agentService.chatLogic(userId, message);

    return res.status(200).json({ success: true, data: { reply } });
};

/**
 * DELETE /api/v1/agent/session
 * Clear the current user's chat session / memory
 */
const endSession = async (req, res) => {
    const userId = req.user?.id;
    await agentService.endSessionLogic(userId);

    return res.status(200).json({
        success: true,
        message: "Chat session cleared successfully.",
    });
};

export default { chat, endSession };