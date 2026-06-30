import User from "../models/userModel.js";

// Get all customers (non-admin users)
export const getAllUsersLogic = async () => {
    const users = await User.find({ role: "user" }).select("-passwordHash").sort({ createdAt: -1 });
    return users;
};

// Block a user
export const blockUserLogic = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    if (user.role === "admin") {
        const error = new Error("Cannot block an admin user");
        error.statusCode = 403;
        throw error;
    }
    user.isBlocked = true;
    await user.save();
    return { id: user._id, isBlocked: user.isBlocked };
};

// Unblock a user
export const unblockUserLogic = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    user.isBlocked = false;
    await user.save();
    return { id: user._id, isBlocked: user.isBlocked };
};