import axiosInstance from './axios';

export const searchProducts = async ({ query, page = 1, limit = 20 }) => {
    try {
        const response = await axiosInstance.post('/products/search', { query, page, limit });
        return {
            success: true,
            data: response.data.data,
            pagination: response.data.pagination
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to search products'
        };
    }
};
