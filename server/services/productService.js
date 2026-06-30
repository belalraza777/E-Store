import Product from "../models/productModel.js";
import { getCache, setCache } from "../utils/cache.js";

/**
 * Search products by title, category, or slug (with caching & pagination)
 * Returns result object { success, statusCode?, message?, data?, pagination? }
 */
export const searchProductsLogic = async (query, page = 1, limit = 30) => {
    const cacheKey = `searchProducts:${query}:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return cached; // cached already contains { success: true, data, pagination }
    }

    if (!query || query.trim() === "") {
        return { success: false, statusCode: 400, message: "Search query cannot be empty" };
    }

    const regex = new RegExp(query.trim(), 'i'); // Case-insensitive regex
    const skip = (page - 1) * limit;

    // Build filter for active products only [users]
    const filter = {
        isActive: true,
        $or: [
            { title: { $regex: regex } },
            { category: { $regex: regex } },
            { slug: { $regex: regex } }
        ]
    };

    const products = await Product.find(filter)
        .populate('category', 'name slug')
        .lean()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    const response = {
        success: true,
        data: products,
        pagination: { total, page, limit }
    };

    // Set cache for search results
    await setCache(cacheKey, response, 300); // 5 min TTL
    return response;
};

/**
 * Get all products with optional filtering and pagination (admin sees inactive too)
 */
export const getAllProductsLogic = async (page = 1, limit = 20, userRole = 'user') => {
    const skip = (page - 1) * limit;
    const cacheKey = `getAllProducts:${userRole}:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return cached; // { success: true, data, pagination }
    }

    // Build filter for active products only [users]
    const filter = { isActive: true };

    // If Admin, No filter
    if (userRole === 'admin') {
        delete filter.isActive;
    }

    // Fetch products
    const products = await Product.find(filter)
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    // Get total count
    const total = await Product.countDocuments(filter);

    const response = {
        success: true,
        data: products,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit)
        }
    };

    // Set cache for product list
    await setCache(cacheKey, response, 300); // 5 min TTL
    return response;
};

/**
 * Get single product by slug (active only)
 */
export const getProductBySlugLogic = async (slug) => {
    const cacheKey = `getProductBySlug:${slug}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return cached; // { success: true, data }
    }

    const product = await Product.findOne({ slug, isActive: true })
        .populate('category', 'name slug')
        .lean();

    if (!product) {
        return { success: false, statusCode: 404, message: "Product not found" };
    }

    const response = { success: true, data: product };

    // Set cache for product detail
    await setCache(cacheKey, response, 300); // 5 min TTL
    return response;
};