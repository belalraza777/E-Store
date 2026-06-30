import User from "../models/userModel.js";

// Fetch the authenticated user's profile
export const getProfileLogic = async (userId) => {
    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

// Update the authenticated user's profile (non-avatar fields)
export const updateProfileLogic = async (userId, { name, email, phone, address }) => {
    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    // Nested address fields {object.entries makes obj to array of key value pairs like [[key1, val1], [key2, val2]]}
    if (address) {
        Object.entries(address).forEach(([key, value]) => {
            if (value !== undefined) updateData[`address.${key}`] = value;
        });
    }
    // If no fields to update
    if (!Object.keys(updateData).length) {
        const error = new Error("No profile fields provided");
        error.statusCode = 400;
        throw error;
    }

    // Block duplicate email/phone while ignoring the current user
    if (email || phone) {
        const conflict = await User.findOne({
            _id: { $ne: userId },
            $or: [email && { email }, phone && { phone }].filter(Boolean),
        });
        if (conflict) {
            const field = conflict.email === email ? "Email" : "Phone number";
            const error = new Error(`${field} is already in use`);
            error.statusCode = 409;
            throw error;
        }
    }
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true, context: "query" }
    ).select("-passwordHash");

    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return updatedUser;
};

// Update avatar via Cloudinary upload
export const updateAvatarLogic = async (userId, filePath) => {
    if (!filePath) {
        const error = new Error("No avatar file uploaded");
        error.statusCode = 400;
        throw error;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { avatar: filePath } },
        { new: true, runValidators: true, context: "query" }
    ).select("-passwordHash");

    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return updatedUser;
};