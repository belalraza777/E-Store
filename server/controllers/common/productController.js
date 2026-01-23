import Product from "../../models/productModel.js";

//Search products by title or category
const searchProducts = async (req, res, next) => {
    const { query } = req.body;
    const limit = Number(req.body.limit) || 30;
    const page = Number(req.body.page) || 1;
    const skip = (page - 1) * limit;

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
    return res.status(200).json({
        success: true,
        data: products,
        pagination: { total, page, limit }
    });
}


// Get all products with optional filtering and pagination
const getAllProducts = async (req, res, next) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

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

    return res.status(200).json({
        success: true,
        data: products,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
};


// Get single product by slug
const getProductBySlug = async (req, res, next) => {
    const product = await Product.findOne({ slug: req?.params?.slug, isActive: true })
        .populate('category', 'name slug').lean();

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
};

export default {
    getAllProducts,
    getProductBySlug,
    searchProducts
};
