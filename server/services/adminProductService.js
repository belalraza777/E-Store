import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import { processProductSlug } from "../helper/slugHelper.js";
import { isValidCategory, normalizeCategory } from "../constants/categories.js";
import { cloudinary } from "../config/cloudnary.js";
import { deleteCachePattern } from "../utils/cache.js";

// Create new product (Admin only)
export const createProductLogic = async (reqBody, files) => {
    const { title, description, price, discountPrice, stock, category } = reqBody;

    const uploadedImages = (files || []).map((file) => ({
        url: file.path,
        publicId: file.filename,
    }));

    // Validate category
    if (!isValidCategory(category)) {
        return { success: false, statusCode: 400, message: "Invalid category" };
    }

    // Process and validate slug
    const slugResult = await processProductSlug(title);
    if (!slugResult.valid) {
        return { success: false, statusCode: 400, message: slugResult.error };
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

    return { success: true, message: "Product created", data: product };
};

// Update product (Admin only)
export const updateProductLogic = async (productId, reqBody, files) => {
    const product = await Product.findById(productId);
    if (!product) {
        return { success: false, statusCode: 404, message: "Product not found" };
    }

    // Validate category if provided
    if (reqBody.category && !isValidCategory(reqBody.category)) {
        return { success: false, statusCode: 400, message: "Invalid category" };
    }

    // Generate slug if title changed
    if (reqBody.title && reqBody.title !== product.title) {
        const slugResult = await processProductSlug(reqBody.title, productId);
        if (!slugResult.valid) {
            return { success: false, statusCode: 400, message: slugResult.error };
        }
        reqBody.slug = slugResult.slug;
    }

    // Update fields
    if (reqBody.title) product.title = reqBody.title;
    if (reqBody.slug) product.slug = reqBody.slug;
    if (reqBody.description) product.description = reqBody.description;
    if (reqBody.price !== undefined) product.price = reqBody.price;
    if (reqBody.discountPrice !== undefined) product.discountPrice = reqBody.discountPrice;
    if (reqBody.stock !== undefined) product.stock = reqBody.stock;
    if (files && files.length > 0) {
        product.images = files.map((file) => ({ url: file.path, publicId: file.filename }));
    }
    if (reqBody.category) product.category = normalizeCategory(reqBody.category);
    if (reqBody.isActive !== undefined) product.isActive = reqBody.isActive;

    await product.save();
    await product.populate('category', 'name slug');

    // Invalidate product-related cache
    await deleteCachePattern("getAllProducts:*");
    await deleteCachePattern("searchProducts:*");
    await deleteCachePattern(`getProductBySlug:${product.slug}`);
    // Optionally, invalidate other product cache keys if needed

    return { success: true, message: "Product updated", data: product };
};

// Delete product (Admin only)
export const deleteProductLogic = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        return { success: false, statusCode: 404, message: "Product not found" };
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
        const deletePromises = product.images.map((image) =>
            cloudinary.uploader.destroy(image.publicId)
        );
        await Promise.all(deletePromises); // Wait for all deletions to complete (promise.all used for better performance when multiple resolutions are needed)
    }
    // Delete associated reviews
    await Review.deleteMany({ product: product._id });

    // Delete product from database
    await Product.findByIdAndDelete(productId);

    // Invalidate product-related cache
    await deleteCachePattern("getAllProducts:*");
    await deleteCachePattern("searchProducts:*");
    await deleteCachePattern(`getProductBySlug:${product.slug}`);
    // Optionally, invalidate other product cache keys if needed

    return { success: true, message: "Product deleted", data: { id: product._id } };
};

// Update product stock (ADMIN only)
export const updateStockLogic = async (productId, stock) => {
    if (stock === undefined || stock < 0) {
        return { success: false, statusCode: 400, message: "Invalid stock value" };
    }

    // Use findByIdAndUpdate to avoid full validation on nested fields
    const product = await Product.findByIdAndUpdate(
        productId,
        { stock },
        { new: true, runValidators: true }
    );

    if (!product) {
        return { success: false, statusCode: 404, message: "Product not found" };
    }

    // Invalidate product-related cache
    await deleteCachePattern("getAllProducts:*");
    await deleteCachePattern("searchProducts:*");
    await deleteCachePattern(`getProductBySlug:${product.slug}`);

    return { success: true, message: "Stock updated", data: product };
};