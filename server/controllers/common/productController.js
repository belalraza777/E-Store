
import Product from "../../models/productModel.js";
import { getCache, setCache } from "../../utils/cache.js";

//Search products by title or category
const searchProducts = async (req, res, next) => {

    const { query } = req.body;
    const limit = Number(req.body.limit) || 30;
    const page = Number(req.body.page) || 1;
    const skip = (page - 1) * limit;

    // Cache key based on search query, page, and limit
    const cacheKey = `searchProducts:${query}:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    if (!query || query.trim() === "") {
        return res.status(400).json({ success: false, message: "Search query cannot be empty" });
    }
    const regex = new RegExp(query.trim(), 'i'); // Case-insensitive regex

    // Build filter for active products only [users]
    const filter = {
        isActive: true,
        $or: [
            { title: { $regex: regex } },
            { category: { $regex: regex } },
            { slug: { $regex: regex } }
        ]
    };
    const products = await Product.find(filter).populate('category', 'name slug').lean().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Product.countDocuments(filter);
    const response = {
        success: true,
        data: products,
        pagination: { total, page, limit }
    };
    // Set cache for search results
    await setCache(cacheKey, response, 300); // 5 min TTL
    return res.status(200).json(response);
}


// Get all products with optional filtering and pagination
const getAllProducts = async (req, res, next) => {

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Cache key based on page, limit, and user role
    const userRole = req?.user?.role || 'user';
    const cacheKey = `getAllProducts:${userRole}:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    // Build filter for active products only [users]
    const filter = { isActive: true };

    //If Admin , No filter
    if (req?.user && req?.user?.role === 'admin') {
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
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    };
    // Set cache for product list
    await setCache(cacheKey, response, 300); // 5 min TTL
    return res.status(200).json(response);
};


// Get single product by slug
const getProductBySlug = async (req, res, next) => {
    const cacheKey = `getProductBySlug:${req?.params?.slug}`;
    const cached = await getCache(cacheKey);
    if (cached) {
        return res.status(200).json(cached);
    }

    const product = await Product.findOne({ slug: req?.params?.slug, isActive: true })
        .populate('category', 'name slug').lean();

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    const response = { success: true, data: product };
    // Set cache for product detail
    await setCache(cacheKey, response, 300); // 5 min TTL
    return res.status(200).json(response);
};

export default {
    getAllProducts,
    getProductBySlug,
    searchProducts
};
