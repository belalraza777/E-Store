import User from "../../models/userModel.js";

// Fetch the authenticated user's profile
const getProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
};

// Update the authenticated user's profile (non-avatar fields)
const updateProfile = async (req, res, next) => {
    const userId = req.user.id;
    const { name, email, phone, address } = req.body;
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
        return res.status(400).json({ success: false, message: "No profile fields provided" });
    }

    // Block duplicate email/phone while ignoring the current user
    if (email || phone) {
        const conflict = await User.findOne({
            _id: { $ne: userId },
            $or: [email && { email }, phone && { phone }].filter(Boolean),
        });
        if (conflict) {
            const field = conflict.email === email ? "Email" : "Phone number";
            return res.status(409).json({ success: false, message: `${field} is already in use` });
        }
    }
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true, context: "query" }
    ).select("-passwordHash");

    if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
};

// Update avatar via Cloudinary upload
const updateAvatar = async (req, res, next) => {
    const userId = req.user.id;

    if (!req.file || !req.file.path) {
        return res.status(400).json({ success: false, message: "No avatar file uploaded" });
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { avatar: req.file.path } },
        { new: true, runValidators: true, context: "query" }
    ).select("-passwordHash");

    if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, message: "Avatar updated successfully", data: updatedUser });
};


export default {
    getProfile,
    updateProfile,
    updateAvatar,
};
