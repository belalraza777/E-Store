import * as profileService from "../../services/profileService.js";

// Fetch the authenticated user's profile
const getProfile = async (req, res) => {
    const user = await profileService.getProfileLogic(req.user.id);

    return res.status(200).json({ success: true, data: user });
};

// Update the authenticated user's profile (non-avatar fields)
const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email, phone, address } = req.body;

    const updatedUser = await profileService.updateProfileLogic(userId, { name, email, phone, address });

    return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
};

// Update avatar via Cloudinary upload
const updateAvatar = async (req, res) => {
    const userId = req.user.id;
    const filePath = req.file?.path;   // multer/cloudinary provides path

    const updatedUser = await profileService.updateAvatarLogic(userId, filePath);

    return res.status(200).json({ success: true, message: "Avatar updated successfully", data: updatedUser });
};

export default {
    getProfile,
    updateProfile,
    updateAvatar,
};