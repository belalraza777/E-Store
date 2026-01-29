import Product from "../../models/productModel.js";
import Review from "../../models/reviewModel.js";
import { processProductSlug } from "../../helper/slugHelper.js";
import { isValidCategory, normalizeCategory } from "../../constants/categories.js";
import { cloudinary } from "../../config/cloudnary.js";
import { deleteCachePattern } from "../../utils/cache.js";

// Create new product (Admin only)
const createProduct = async (req, res, next) => {
    const { title, description, price, discountPrice, stock, category } = req.body;

    const uploadedImages = (req.files || []).map((file) => ({
        url: file.path,
        publicId: file.filename,
    }));

    // Validate category
    if (!isValidCategory(category)) {
        return res.status(400).json({ success: false, message: "Invalid category" });
    }

    // Process and validate slug
    const slugResult = await processProductSlug(title);
    if (!slugResult.valid) {
        return res.status(400).json({ success: false, message: slugResult.error });
    }

    // Create product
    const product = await Product.create({
        title,
        slug: slugResult.slug,
        description,
        price,
        discountPrice,
        stock: stock || 0,
        images: uploadedImages,
        category: normalizeCategory(category),
        isActive: true
    });

    // Invalidate product-related cache
    await deleteCachePattern("getAllProducts:*");
    await deleteCachePattern("searchProducts:*");
    // Optionally, invalidate other product cache keys if needed
    return res.status(201).json({ success: true, message: "Product created", data: product });
};

// Update product (Admin only)
const updateProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Validate category if provided
    if (req.body.category && !isValidCategory(req.body.category)) {
        return res.status(400).json({ success: false, message: "Invalid category" });
    }

    // Generate slug if title changed
    if (req.body.title && req.body.title !== product.title) {
        const slugResult = await processProductSlug(req.body.title, req.params.id);
        if (!slugResult.valid) {
            return res.status(400).json({ success: false, message: slugResult.error });
        }
        req.body.slug = slugResult.slug;
    }

    // Update fields
    if (req.body.title) product.title = req.body.title;
    if (req.body.slug) product.slug = req.body.slug;
    if (req.body.description) product.description = req.body.description;
    if (req.body.price !== undefined) product.price = req.body.price;
    if (req.body.discountPrice !== undefined) product.discountPrice = req.body.discountPrice;
    if (req.body.stock !== undefined) product.stock = req.body.stock;
    if (req.files && req.files.length > 0) {
        product.images = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
    }
    if (req.body.category) product.category = normalizeCategory(req.body.category);
    if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

    await product.save();
    await product.populate('category', 'name slug');

    // Invalidate product-related cache
    await deleteCachePattern("getAllProducts:*");
    await deleteCachePattern("searchProducts:*");
    await deleteCachePattern(`getProductBySlug:${product.slug}`);
    // Optionally, invalidate other product cache keys if needed
    return res.status(200).json({ success: true, message: "Product updated", data: product });
};


// Delete product (Admin only)
const deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map((image) =>
            cloudinary.uploader.destroy(image.publicId)
        );
        await Promise.all(deletePromises); // Wait for all deletions to complete (promise.all used for better performance when multiple resolutions are needed)
    }
    //Delete associated reviews
    await Review.deleteMany({ product: product._id });

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    // Invalidate product-related cache
    await deleteCachePattern("getAllProducts:*");
    await deleteCachePattern("searchProducts:*");
    await deleteCachePattern(`getProductBySlug:${product.slug}`);
    // Optionally, invalidate other product cache keys if needed
    return res.status(200).json({ success: true, message: "Product deleted", data: { id: product._id } });
};


// Update product stock (ADMIN only)
const updateStock = async (req, res, next) => {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
        return res.status(400).json({ success: false, message: "Invalid stock value" });
    }

    // Use findByIdAndUpdate to avoid full validation on nested fields
    const product = await Product.findByIdAndUpdate(
        id,
        { stock },
        { new: true, runValidators: true }
    );

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Stock updated", data: product });
};


export default {
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
};