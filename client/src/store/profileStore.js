import { create } from "zustand";
import { fetchProfile, updateProfile, updateAvatar, toggleUserBlock } from "../api/profileApi";

const useProfileStore = create((set) => ({
    profile: null,
    loading: false,
    error: null,

    // Fetch user profile
    fetchProfile: async () => {
        set({ loading: true, error: null });
        const result = await fetchProfile();
        if (result.success) {
            set({ profile: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Update profile
    updateProfile: async (data) => {
        set({ loading: true, error: null });
        const result = await updateProfile(data);
        if (result.success) {
            set({ profile: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Update avatar
    updateAvatar: async (file) => {
        set({ loading: true, error: null });
        const result = await updateAvatar(file);
        if (result.success) {
            set({ profile: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Toggle user block status (admin)
    toggleUserBlock: async (userId, isBlocked) => {
        set({ loading: true, error: null });
        const result = await toggleUserBlock(userId, isBlocked);
        if (result.success) {
            set({ loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear profile
    clearProfile: () => set({ profile: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useProfileStore;
