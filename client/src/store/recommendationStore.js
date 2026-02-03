import { create } from 'zustand';
import { getRecommendations } from '../api/recommendationApi';

const useRecommendationStore = create((set) => ({
    recommendations: [], // List of recommended products
    loading: false, 
    error: null,

    // Fetch recommendations based on category
    fetchRecommendations: async (category) => {
        set({ loading: true, error: null });
        const result = await getRecommendations(category);
        if (result.success) {
            set({ recommendations: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    clearRecommendations: () => set({ recommendations: [] }),
    clearError: () => set({ error: null }),
}));

export default useRecommendationStore;
