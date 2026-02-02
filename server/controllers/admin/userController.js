import User from "../../models/userModel.js";

// Get all customers (non-admin users)
const getAllUsers = async (req, res, next) => {
    const users = await User.find({ role: "user" }).select("-passwordHash").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
};

// Block a user
const blockUser = async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ success: false, message: "Cannot block an admin user" });
    user.isBlocked = true;
    await user.save();
    return res.status(200).json({ success: true, message: "User blocked successfully", data: { id: user._id, isBlocked: user.isBlocked } });
};

// Unblock a user
const unblockUser = async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isBlocked = false;
    await user.save();
    return res.status(200).json({ success: true, message: "User unblocked successfully", data: { id: user._id, isBlocked: user.isBlocked } });
};

export default {
    getAllUsers,
    blockUser,
    unblockUser,
};
