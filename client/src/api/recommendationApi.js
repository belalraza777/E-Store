import axiosInstance from './axios';

export const getRecommendations = async (category) => {
    try {
        const response = await axiosInstance.get('/recommendations', { category });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch recommendations',
        };
    }
};
