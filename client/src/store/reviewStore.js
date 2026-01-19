import { create } from 'zustand';
import { addReview, getProductReviews, deleteReview } from '../api/reviewApi';

const useReviewStore = create((set, get) => ({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    verifiedReviews: 0,
    loading: false,
    error: null,

    // Fetch reviews for a product
    fetchProductReviews: async (productId) => {
        set({ loading: true, error: null });
        const result = await getProductReviews(productId);
        if (result.success) {
            set({ 
                reviews: result.data, 
                averageRating: result.averageRating,
                totalReviews: result.totalReviews,
                verifiedReviews: result.verifiedReviews,
                loading: false 
            });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Add new review
    addReview: async (productId, reviewData) => {
        set({ loading: true, error: null });
        const result = await addReview(productId, reviewData);
        if (result.success) {
            // Add review to the list
            const reviews = [result.data, ...get().reviews];
            set({ reviews, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Delete review
    deleteReview: async (reviewId) => {
        set({ loading: true, error: null });
        const result = await deleteReview(reviewId);
        if (result.success) {
            // Remove review from the list
            const reviews = get().reviews.filter(r => r._id !== reviewId);
            set({ reviews, totalReviews: reviews.length, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear reviews
    clearReviews: () => set({ reviews: [], averageRating: 0, totalReviews: 0, verifiedReviews: 0 }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useReviewStore;
