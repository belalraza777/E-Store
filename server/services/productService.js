import Product from "../models/productModel.js";
import { getCache, setCache } from "../utils/cache.js";

const MAX_LIMIT = 50;

const normalizePagination = (page, limit) => {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const safePage = Number.isFinite(pageNumber)
        ? Math.max(1, Math.floor(pageNumber))
        : 1;
    const safeLimit = Number.isFinite(limitNumber)
        ? Math.min(MAX_LIMIT, Math.max(1, Math.floor(limitNumber)))
        : 20;

    return {
        page: safePage,
        limit: safeLimit,
        skip: (safePage - 1) * safeLimit,
    };
};

const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const productCardFields =
    "title slug price discountPrice stock category averageRating reviewCount isActive images";

const getProductCardQuery = (filter, skip, limit) =>
    Product.find(filter)
        .select(productCardFields)
        .slice("images", 1)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

export const searchProductsLogic = async (query, page = 1, limit = 30) => {
    if (typeof query !== "string" || !query.trim()) {
        return {
            success: false,
            statusCode: 400,
            message: "Search query cannot be empty",
        };
    }

    const normalizedQuery = query.trim().slice(0, 100);
    const pagination = normalizePagination(page, limit);
    const cacheKey =
        `searchProducts:${normalizedQuery.toLowerCase()}:` +
        `${pagination.page}:${pagination.limit}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const regex = new RegExp(escapeRegex(normalizedQuery), "i");
    const filter = {
        isActive: true,
        $or: [
            { title: regex },
            { category: regex },
            { slug: regex },
        ],
    };

    const [products, total] = await Promise.all([
        getProductCardQuery(filter, pagination.skip, pagination.limit),
        Product.countDocuments(filter),
    ]);

    const response = {
        success: true,
        data: products,
        pagination: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            pages: Math.ceil(total / pagination.limit),
        },
    };

    await setCache(cacheKey, response, 300);
    return response;
};

export const getAllProductsLogic = async (
    page = 1,
    limit = 20,
    userRole = "user",
    category
) => {
    const pagination = normalizePagination(page, limit);
    const filter = {};

    if (userRole !== "admin") {
        filter.isActive = true;
    }

    const normalizedCategory =
        typeof category === "string" ? category.trim() : "";
    if (normalizedCategory && normalizedCategory.toLowerCase() !== "all") {
        filter.category = normalizedCategory;
    }

    const cacheKey =
        `getAllProducts:${userRole}:${pagination.page}:` +
        `${pagination.limit}:${filter.category || "all"}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const [products, total] = await Promise.all([
        getProductCardQuery(filter, pagination.skip, pagination.limit),
        Product.countDocuments(filter),
    ]);

    const response = {
        success: true,
        data: products,
        pagination: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            pages: Math.ceil(total / pagination.limit),
        },
    };

    await setCache(cacheKey, response, 300);
    return response;
};

export const getProductBySlugLogic = async (slug) => {
    if (typeof slug !== "string" || !slug.trim()) {
        return {
            success: false,
            statusCode: 400,
            message: "Product slug is required",
        };
    }

    const normalizedSlug = slug.trim();
    const cacheKey = `getProductBySlug:${normalizedSlug}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const product = await Product.findOne({
        slug: normalizedSlug,
        isActive: true,
    }).lean();

    if (!product) {
        return { success: false, statusCode: 404, message: "Product not found" };
    }

    const response = { success: true, data: product };
    await setCache(cacheKey, response, 300);
    return response;
};
