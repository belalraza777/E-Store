import * as adminUserService from "../../services/adminUserService.js";

// Get all customers (non-admin users)
const getAllUsers = async (req, res) => {
    const users = await adminUserService.getAllUsersLogic();
    return res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
};

// Block a user
const blockUser = async (req, res) => {
    const { userId } = req.params;
    const data = await adminUserService.blockUserLogic(userId);
    return res.status(200).json({ success: true, message: "User blocked successfully", data });
};

// Unblock a user
const unblockUser = async (req, res) => {
    const { userId } = req.params;
    const data = await adminUserService.unblockUserLogic(userId);
    return res.status(200).json({ success: true, message: "User unblocked successfully", data });
};

export default {
    getAllUsers,
    blockUser,
    unblockUser,
};