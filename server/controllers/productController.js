import Product from "../models/productModel.js";

// Get all products with optional filtering and pagination
const getAllProducts = async (req, res, next) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter for active products only
    const filter = { isActive: true };

    // Fetch products
    const products = await Product.find(filter)
        .populate('category', 'name slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    // Get total count
    const total = await Product.countDocuments(filter);

    return res.status(200).json({
        success: true,
        data: products,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
};

// Get single product by slug
const getProductBySlug = async (req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
        .populate('category', 'name slug');

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
};

export default {
    getAllProducts,
    getProductBySlug
};
