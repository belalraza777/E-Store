import { create } from 'zustand';
import { searchProducts } from '../api/searchApi';

const useSearchStore = create((set) => ({
    results: [],
    loading: false,
    error: null,
    pagination: null,

    // Search products
    search: async (query, page = 1, limit = 20) => {
        set({ loading: true, error: null });
        const result = await searchProducts({ query, page, limit });
        if (result.success) {
            set({ results: result.data, pagination: result.pagination, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear results
    clearResults: () => set({ results: [], pagination: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useSearchStore;
