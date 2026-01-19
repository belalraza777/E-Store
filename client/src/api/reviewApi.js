import axiosInstance from './axios';

export const addReview = async (productId, reviewData) => {
    try {
        const response = await axiosInstance.post(`/reviews/${productId}`, reviewData);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to add review' 
        };
    }
};

export const getProductReviews = async (productId) => {
    try {
        const response = await axiosInstance.get(`/reviews/product/${productId}`);
        return { 
            success: true, 
            data: response.data.data,
            averageRating: response.data.averageRating,
            totalReviews: response.data.totalReviews,
            verifiedReviews: response.data.verifiedReviews
        };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to fetch reviews' 
        };
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await axiosInstance.delete(`/reviews/${reviewId}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to delete review' 
        };
    }
};
