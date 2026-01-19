import { create } from 'zustand';
import { getAllProducts, getProductBySlug, getCategories, createProduct, updateProduct, deleteProduct, updateProductStock } from '../api/productApi';

const useProductStore = create((set, get) => ({
    products: [],
    currentProduct: null,
    categories: [],
    loading: false,
    error: null,
    pagination: null,

    // Fetch all products
    fetchProducts: async (params) => {
        set({ loading: true, error: null });
        const result = await getAllProducts(params);
        if (result.success) {
            set({ products: result.data, pagination: result.pagination, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Fetch single product by slug
    fetchProductBySlug: async (slug) => {
        set({ loading: true, error: null });
        const result = await getProductBySlug(slug);
        if (result.success) {
            set({ currentProduct: result.data, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Fetch categories
    fetchCategories: async () => {
        const result = await getCategories();
        if (result.success) {
            set({ categories: result.data });
        }
        return result;
    },

    // Create product (admin)
    createProduct: async (formData) => {
        set({ loading: true, error: null });
        const result = await createProduct(formData);
        if (result.success) {
            set({ loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Update product (admin)
    updateProduct: async (id, formData) => {
        set({ loading: true, error: null });
        const result = await updateProduct(id, formData);
        if (result.success) {
            set({ loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Delete product (admin)
    deleteProduct: async (id) => {
        set({ loading: true, error: null });
        const result = await deleteProduct(id);
        if (result.success) {
            const products = get().products.filter(p => p._id !== id);
            set({ products, loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Update product stock (admin)
    updateStock: async (id, stock) => {
        set({ loading: true, error: null });
        const result = await updateProductStock(id, stock);
        if (result.success) {
            set({ loading: false });
        } else {
            set({ error: result.message, loading: false });
        }
        return result;
    },

    // Clear current product
    clearCurrentProduct: () => set({ currentProduct: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useProductStore;
