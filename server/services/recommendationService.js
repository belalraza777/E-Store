import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { getCache, setCache } from "../utils/cache.js";


// Get recommended products for a user (or guest) based on category and order history
export const getRecommendedProducts = async ({ userId, category }) => {
    const cacheKey = userId
        ? `recommendedProducts:user:${userId}:${category}`
        : `recommendedProducts:guest:${category}`;

    // Check cache
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    /**
     * ============================
     * GUEST USER RECOMMENDATIONS
     * ============================
     */
    if (!userId) {
        const products = await Product.find({
            category,
            isActive: true,
        })
            .limit(20)
            .lean();

        await setCache(cacheKey, products, 480);
        return products;
    }

    /**
     * ============================
     * LOGGED-IN USER RECOMMENDATIONS
     * ============================
     */

    // Fetch recent orders
    const orders = await Order.find(
        { user: userId },
        { "items.product": 1 }
    )
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    // If no orders → fallback to category-based
    if (!orders.length) {
        const fallbackProducts = await Product.find({
            category,
            isActive: true,
        })
            .limit(20)
            .lean();

        await setCache(cacheKey, fallbackProducts, 480);
        return fallbackProducts;
    }

    // Extract unique ordered product IDs
    const orderedProductIds = [
        ...new Set(
            orders.flatMap(order =>
                order.items.map(item => item.product.toString())
            )
        )
    ];

    // Get categories from ordered products
    const orderedCategories = await Product.distinct("category", {
        _id: { $in: orderedProductIds },
    });

    // Fetch recommendations
    const recommendedProducts = await Product.find({
        _id: { $nin: orderedProductIds },
        isActive: true,
        category: { $in: [category, ...orderedCategories] },
    })
        .limit(20)
        .lean();

    await setCache(cacheKey, recommendedProducts, 480);
    return recommendedProducts;
};



// Get recommendations for a category (with optional user personalization)
export const getRecommendationsLogic = async (category, userId) => {
    if (!category) {
        const error = new Error("Category is required");
        error.statusCode = 400;
        throw error;
    }

    // If user is not logged in, provide generic recommendations
    // (userId is passed in as null/undefined if not logged in)

    // Helper function to get recommendations based on category and user preferences
    const recommendations = await getRecommendedProducts(userId ? { category, userId } : { category });
    if (!recommendations) {
        const error = new Error("Could not fetch recommendations");
        error.statusCode = 500;
        throw error;
    }

    return recommendations;
};