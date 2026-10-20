import { create } from 'zustand';
import { addReview, getProductReviews, deleteReview } from '../api/reviewApi';

const useReviewStore = create((set) => ({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    verifiedReviews: 0,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,

    // Fetch reviews for a product page
    fetchProductReviews: async (productId, page = 1) => {
        set({ loading: true, error: null });
        const result = await getProductReviews(productId, page);
        if (result.success) {
            const normalizedAverageRating = Number(result.averageRating);
            const normalizedTotalReviews = Number(result.totalReviews);
            const normalizedVerifiedReviews = Number(result.verifiedReviews);

            set({
                reviews: result.data,
                averageRating: Number.isFinite(normalizedAverageRating) ? normalizedAverageRating : 0,
                totalReviews: Number.isFinite(normalizedTotalReviews) ? normalizedTotalReviews : 0,
                verifiedReviews: Number.isFinite(normalizedVerifiedReviews) ? normalizedVerifiedReviews : 0,
                currentPage: result.page || 1,
                totalPages: result.totalPages || 0,
                loading: false,
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
            set({ loading: false });
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
            set({ loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear reviews
    clearReviews: () => set({ reviews: [], averageRating: 0, totalReviews: 0, verifiedReviews: 0, currentPage: 1, totalPages: 0 }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useReviewStore;
