import { create } from 'zustand';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlistApi';

// Helpers to normalize wishlist data
const normalizeIds = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.map(String);
    if (data.products) return data.products.map(p => p._id ? p._id.toString() : p.toString());
    return [];
};

const normalizeProducts = (data) => {
    if (!data) return [];
    // If API returned an array of products
    if (Array.isArray(data) && data.length && typeof data[0] === 'object') return data;
    // If API returned wishlist object with populated `products`
    if (data.products) return data.products;
    return [];
};

const useWishlistStore = create((set) => ({
    // `wishlist` holds array of product id strings for quick membership checks
    wishlist: [],
    // `wishlistProducts` holds populated product objects for pages that need full data
    wishlistProducts: [],
    loading: false,
    error: null,

    // Fetch wishlist 
    fetchWishlist: async () => {
        set({ loading: true, error: null });
        const result = await getWishlist();
        if (result.success) {
            set({
                wishlist: normalizeIds(result.data),
                wishlistProducts: normalizeProducts(result.data),
                loading: false,
            });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Add product to wishlist
    addProduct: async (productId) => {
        set({ loading: true, error: null });
        const result = await addToWishlist(productId);
        if (result.success) {
            set({
                wishlist: normalizeIds(result.data),
                wishlistProducts: normalizeProducts(result.data),
                loading: false,
            });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Remove product from wishlist
    removeProduct: async (productId) => {
        set({ loading: true, error: null });
        const result = await removeFromWishlist(productId);
        if (result.success) {
            set({
                wishlist: normalizeIds(result.data),
                wishlistProducts: normalizeProducts(result.data),
                loading: false,
            });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear wishlist
    clearWishlist: () => set({ wishlist: [] }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useWishlistStore;
