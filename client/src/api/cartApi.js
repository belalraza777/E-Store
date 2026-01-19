import axiosInstance from './axios';

export const getCart = async () => {
    try {
        const response = await axiosInstance.get('/cart');
        return { success: true, data: response.data.data };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to fetch cart' 
        };
    }
};

export const addToCart = async (productId, quantity) => {
    try {
        const response = await axiosInstance.post(`/cart/${productId}/${quantity}`);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to add item to cart' 
        };
    }
};

export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await axiosInstance.put(`/cart/${itemId}/${quantity}`);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to update cart item' 
        };
    }
};

export const removeFromCart = async (itemId) => {
    try {
        const response = await axiosInstance.delete(`/cart/${itemId}`);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to remove item from cart' 
        };
    }
};
