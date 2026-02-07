import axiosInstance from './axios';

export const getWishlist = async () => {
    try {
        const response = await axiosInstance.get('/wishlists/');
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch wishlist',
        };
    }
};

export const addToWishlist = async (productId) => {
    try {
        const response = await axiosInstance.post('/wishlists/',{ productId });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add to wishlist',
        };
    }
};

export const removeFromWishlist = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/wishlists/${productId}`);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove from wishlist',
        };
    }
};

