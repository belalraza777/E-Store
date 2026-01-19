import axiosInstance from "./axios";

export const fetchProfile = async () => {
    try {
        const response = await axiosInstance.get("/profile");
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to load profile",
        };
    }
};

export const updateProfile = async (payload) => {
    try {
        const response = await axiosInstance.patch("/profile", payload);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update profile",
        };
    }
};

export const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
        const response = await axiosInstance.patch("/profile/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update avatar",
        };
    }
};

export const toggleUserBlock = async (userId, isBlocked) => {
    try {
        const response = await axiosInstance.patch(`/profile/${userId}/block`, { isBlocked });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update user status",
        };
    }
};
