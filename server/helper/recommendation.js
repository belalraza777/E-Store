import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { getCache, setCache } from "../../utils/cache.js";

export const getRecommendedProducts = async ({ userId, category }) => {

    const cacheKey = `recommendedProducts:${userId}:${category}`;
    const cached = await getCache(cacheKey);

    if (cached) {
        return cached;
    }

    // 1️⃣Fetch recent orders (only product IDs)
    const orders = await Order.find(
        { user: userId },
        { "items.product": 1 }
    )
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
    // if orders are not found, fallback
    if (!orders.length) {
        const fallbackProducts = await Product.find({
            category,
            isActive: true,
        })
            .limit(10)
            .lean();
        // Cache fallback results
        await setCache(cacheKey, fallbackProducts, 480);
        return fallbackProducts;
    }

    //  Extract unique product IDs  [flatMap is used for nested arrays , it flattens them]
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

    // Cache results
    await setCache(cacheKey, recommendedProducts, 480);

    return recommendedProducts;
};
