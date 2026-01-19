import axiosInstance from './axios';

export const getAllProducts = async (params) => {
    try {
        const response = await axiosInstance.get('/products', { params });
        return { success: true, data: response.data.data, pagination: response.data.pagination };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to fetch products' 
        };
    }
};

export const getProductBySlug = async (slug) => {
    try {
        const response = await axiosInstance.get(`/products/${slug}`);
        return { success: true, data: response.data.data };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Product not found' 
        };
    }
};

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/products/categories');
        return { success: true, data: response.data.data };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to fetch categories' 
        };
    }
};

// Admin APIs
export const createProduct = async (formData) => {
    try {
        const response = await axiosInstance.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to create product' 
        };
    }
};

export const updateProduct = async (id, formData) => {
    try {
        const response = await axiosInstance.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to update product' 
        };
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/products/${id}`);
        return { success: true, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to delete product' 
        };
    }
};

export const updateProductStock = async (id, stock) => {
    try {
        const response = await axiosInstance.patch(`/products/${id}/stock`, { stock });
        return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to update stock' 
        };
    }
};
