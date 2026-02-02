import { create } from "zustand";
import { fetchProfile, updateProfile, updateAvatar, fetchUsers, blockUserAdmin, unblockUserAdmin } from "../api/profileApi";

const useProfileStore = create((set) => ({
    profile: null,
    loading: false,
    error: null,
    users: [],
    usersLoading: false,

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

    // ADMIN: fetch all customers
    fetchUsers: async () => {
        set({ usersLoading: true, error: null });
        const result = await fetchUsers();
        if (result.success) {
            set({ users: result.data, usersLoading: false });
        } else {
            set({ error: result.message, usersLoading: false });
        }
        return result;
    },

    // ADMIN: block a user
    blockUserAdmin: async (userId) => {
        set({ usersLoading: true, error: null });
        const result = await blockUserAdmin(userId);
        if (result.success) {
            set((state) => ({
                users: state.users.map((u) => (u._id === userId ? { ...u, isBlocked: true } : u)),
                usersLoading: false,
            }));
        } else {
            set({ error: result.message, usersLoading: false });
        }
        return result;
    },

    // ADMIN: unblock a user
    unblockUserAdmin: async (userId) => {
        set({ usersLoading: true, error: null });
        const result = await unblockUserAdmin(userId);
        if (result.success) {
            set((state) => ({
                users: state.users.map((u) => (u._id === userId ? { ...u, isBlocked: false } : u)),
                usersLoading: false,
            }));
        } else {
            set({ error: result.message, usersLoading: false });
        }
        return result;
    },



    // Clear profile
    clearProfile: () => set({ profile: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useProfileStore;
