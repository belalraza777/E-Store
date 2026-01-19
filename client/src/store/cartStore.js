import { create } from 'zustand';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../api/cartApi';

const useCartStore = create((set) => ({
    cart: null,
    loading: false,
    error: null,

    // Fetch cart
    fetchCart: async () => {
        set({ loading: true, error: null });
        const result = await getCart();
        if (result.success) {
            set({ cart: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Add item to cart
    addItem: async (productId, quantity) => {
        set({ loading: true, error: null });
        const result = await addToCart(productId, quantity);
        if (result.success) {
            set({ cart: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Update cart item quantity
    updateItem: async (itemId, quantity) => {
        set({ loading: true, error: null });
        const result = await updateCartItem(itemId, quantity);
        if (result.success) {
            set({ cart: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Remove item from cart
    removeItem: async (itemId) => {
        set({ loading: true, error: null });
        const result = await removeFromCart(itemId);
        if (result.success) {
            set({ cart: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear cart
    clearCart: () => set({ cart: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useCartStore;
