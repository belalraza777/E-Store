import axiosInstance from './axios';

export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post('/orders', orderData);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to create order' 
        };
    }
};

export const getMyOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders/my');
        return { success: true, data: response.data.data };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to fetch orders' 
        };
    }
};

export const cancelOrder = async (orderId, reason) => {
    try {
        const response = await axiosInstance.delete(`/orders/${orderId}`, { 
            data: { reason } 
        });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to cancel order' 
        };
    }
};

// Admin APIs
export const getAllOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders');
        return { success: true, data: response.data.data };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to fetch orders' 
        };
    }
};

export const filterOrders = async (params) => {
    try {
        const response = await axiosInstance.get('/orders/filter', { params });
        return { success: true, data: response.data.data, count: response.data.count };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to filter orders' 
        };
    }
};

export const updateOrderStatus = async (orderId, statusData) => {
    try {
        const response = await axiosInstance.put(`/orders/${orderId}/status`, statusData);
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to update order status' 
        };
    }
};
