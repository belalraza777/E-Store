import * as productService from "../../services/productService.js";

//Search products by title or category
const searchProducts = async (req, res) => {
    const { query } = req.body;
    const limit = Number(req.body.limit) || 30;
    const page = Number(req.body.page) || 1;

    const result = await productService.searchProductsLogic(query, page, limit);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message
        });
    }

    return res.status(200).json(result);
};

// Get all products with optional filtering and pagination
const getAllProducts = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const userRole = req?.user?.role || 'user';

    const result = await productService.getAllProductsLogic(
        Number(page),
        Number(limit),
        userRole
    );

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message
        });
    }

    return res.status(200).json(result);
};

// Get single product by slug
const getProductBySlug = async (req, res) => {
    const slug = req?.params?.slug;
    const result = await productService.getProductBySlugLogic(slug);

    if (!result.success) {
        return res.status(result.statusCode).json({
            success: false,
            message: result.message
        });
    }

    return res.status(200).json(result);
};

export default {
    getAllProducts,
    getProductBySlug,
    searchProducts
};