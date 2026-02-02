import { create } from 'zustand';
import { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, filterOrders, updateOrderStatus } from '../api/orderApi';

const useOrderStore = create((set, get) => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,

    // Create new order
    createOrder: async (orderData) => {
        set({ loading: true, error: null });
        const result = await createOrder(orderData);
        if (result.success) {
            set({ currentOrder: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Fetch user's orders
    fetchMyOrders: async () => {
        set({ loading: true, error: null });
        const result = await getMyOrders();
        if (result.success) {
            set({ orders: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Fetch single order by ID
    fetchOrderById: async (orderId) => {
        set({ loading: true, error: null });
        const result = await getOrderById(orderId);
        if (result.success) {
            set({ currentOrder: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Cancel order
    cancelOrder: async (orderId, reason) => {
        set({ loading: true, error: null });
        const result = await cancelOrder(orderId, reason);
        if (result.success) {
            // Update order in the list
            const orders = get().orders.map(order => 
                order._id === orderId ? result.data : order
            );
            set({ orders, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },


    // ADMIN: Fetch all orders
    fetchAllOrders: async () => {
        set({ loading: true, error: null });
        const result = await getAllOrders();
        if (result.success) {
            set({ orders: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // ADMIN: Filter orders
    filterOrders: async (params) => {
        set({ loading: true, error: null });
        const result = await filterOrders(params);
        if (result.success) {
            set({ orders: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // ADMIN: Update order status
    updateOrderStatus: async (orderId, statusData) => {
        set({ loading: true, error: null });
        const result = await updateOrderStatus(orderId, statusData);
        if (result.success) {
            // Update order in the list
            const orders = get().orders.map(order => 
                order._id === orderId ? result.data : order
            );
            set({ orders, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear orders
    clearOrders: () => set({ orders: [] }),

    // Clear current order
    clearCurrentOrder: () => set({ currentOrder: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useOrderStore;
