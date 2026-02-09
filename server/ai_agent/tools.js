import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import { CATEGORIES } from "../constants/categories.js";
import { getCache, setCache } from "../utils/cache.js";

// Helper: extract userId from tool config
const getUserId = (config) => config?.configurable?.userId || null;

// Helper: format product for display
const fmtProduct = (p, i) => {
  const hasDiscount = p.discountPrice && p.discountPrice < p.price;
  const price = hasDiscount
    ? `₹${p.discountPrice} (MRP ₹${p.price}, ${Math.round((1 - p.discountPrice / p.price) * 100)}% off)`
    : `₹${p.price}`;
  const stock = p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock";
  const idx = i != null ? `${i}. ` : "";
  return `${idx}${p.title}\n   Price: ${price} | Rating: ${p.averageRating}/5 (${p.reviewCount} reviews) | ${stock} | Category: ${p.category}`;
};

// 1. Get Product Details
const getProductDetails = tool(
  async ({ productName }) => {
    try {
      const cacheKey = `agent:product:${productName.trim().toLowerCase()}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const regex = new RegExp(productName.trim().split(/\s+/).join(".*"), "i");
      const product = await Product.findOne({ title: { $regex: regex }, isActive: true }).lean();

      if (!product)
        return `Could not find a product matching "${productName}". Try different keywords.`;

      const hasDiscount = product.discountPrice && product.discountPrice < product.price;
      const result = [
        `  ${product.title}`,
        `   Category   : ${product.category}`,
        `   Price      : ${hasDiscount ? `₹${product.discountPrice} (MRP ₹${product.price} — ${Math.round((1 - product.discountPrice / product.price) * 100)}% off)` : `₹${product.price}`}`,
        `   Rating     : ${product.averageRating}/5 (${product.reviewCount} reviews)`,
        `   Stock      : ${product.stock > 0 ? `${product.stock} units available` : "Out of Stock"}`,
        `   Description: ${product.description}`,
      ].join("\n");

      await setCache(cacheKey, result, 300);
      return result;
    } catch (err) {
      return `Error: ${err.message}`;
    }
  },
  {
    name: "getProductDetails",
    description: "Get full details of a specific product — price, description, rating, stock, category.",
    schema: z.object({
      productName: z.string().describe("The name or title of the product to look up."),
    }),
  }
);

// 2. Products by Category
const getProductsByCategory = tool(
  async ({ category, limit, sortBy }) => {
    try {
      const cat = category.toLowerCase().trim();
      if (!CATEGORIES.includes(cat))
        return `"${category}" is not a valid category. Available: ${CATEGORIES.join(", ")}`;

      const cacheKey = `agent:category:${cat}:${limit}:${sortBy}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const sortMap = {
        price_low: { price: 1 },
        price_high: { price: -1 },
        newest: { createdAt: -1 },
        rating: { averageRating: -1 },
      };

      const products = await Product.find({ category: cat, isActive: true })
        .limit(limit)
        .sort(sortMap[sortBy] || sortMap.rating)
        .lean();

      if (!products.length) return `No products found in "${category}".`;

      const result = `${category.charAt(0).toUpperCase() + category.slice(1)} — ${products.length} product(s):\n\n${products.map((p, i) => fmtProduct(p, i + 1)).join("\n\n")}`;

      await setCache(cacheKey, result, 300);
      return result;
    } catch (err) {
      return `Error: ${err.message}`;
    }
  },
  {
    name: "getProductsByCategory",
    description: "Browse products in a specific category with optional sorting.",
    schema: z.object({
      category: z.string().describe("Product category (e.g., electronics, clothing, books, beauty, toys)."),
      limit: z.number().min(1).max(20).default(8).describe("Max results (default 8)."),
      sortBy: z.enum(["rating", "price_low", "price_high", "newest"]).default("rating").describe("Sort order."),
    }),
  }
);

// 4. List All Categories
const getCategories = tool(
  async () => {
    return `Available categories (${CATEGORIES.length}):\n${CATEGORIES.map((c, i) => `  ${i + 1}. ${c.charAt(0).toUpperCase() + c.slice(1)}`).join("\n")}\n\nYou can browse any category or search for products within them.`;
  },
  {
    name: "getCategories",
    description: "List all available product categories in the store.",
    schema: z.object({}),
  }
);

// 7. Order History (reads userId from config)
const getOrderHistory = tool(
  async ({ limit }, config) => {
    try {
      const userId = getUserId(config);
      if (!userId) return "Please log in to view your order history.";

      const cacheKey = `agent:orders:${userId}:${limit}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const orders = await Order.find({ user: userId })
        .populate("items.product", "title price")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      if (!orders.length) return "You haven't placed any orders yet. Start shopping!";

      const result = `Your recent orders (${orders.length}):\n\n${orders
        .map((o, i) => {
          const items = o.items.map((it) => `${it.product?.title || "Unknown"} x${it.quantity}`).join(", ");
          return `${i + 1}. Order #${o._id}\n   Status: ${o.orderStatus.toUpperCase()} | Payment: ${o.paymentStatus} (${o.paymentMethod}) | Total: ₹${o.totalAmount}\n   Items: ${items}\n   Placed: ${new Date(o.createdAt).toLocaleDateString("en-IN")}`;
        })
        .join("\n\n")}`;

      await setCache(cacheKey, result, 120);
      return result;
    } catch (err) {
      return `Error fetching orders: ${err.message}`;
    }
  },
  {
    name: "getOrderHistory",
    description: "View the user's recent orders with status, amount, and items.",
    schema: z.object({
      limit: z.number().min(1).max(20).default(5).describe("Number of recent orders (default 5)."),
    }),
  }
);

// 8. Order Details (reads userId from config)
const getOrderDetails = tool(
  async ({ orderId }, config) => {
    try {
      const userId = getUserId(config);
      if (!userId) return "Please log in to view order details.";

      const cacheKey = `agent:order:${userId}:${orderId}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const order = await Order.findOne({ _id: orderId, user: userId })
        .populate("items.product", "title price discountPrice")
        .lean();

      if (!order) return `Order "${orderId}" not found or doesn't belong to you.`;

      const items = order.items
        .map((it) => `  • ${it.product?.title || "Unknown"} x${it.quantity} — ₹${(it.discount > 0 ? it.discount : it.price) * it.quantity}`)
        .join("\n");

      const result = [
        `   Order #${order._id}`,
        `   Status     : ${order.orderStatus.toUpperCase()}`,
        `   Payment    : ${order.paymentMethod} — ${order.paymentStatus}`,
        `   Subtotal   : ₹${order.subtotal}`,
        `   Total      : ₹${order.totalAmount}`,
        order.isCancelled ? `   Cancelled  : Yes (${order.cancelReason || "No reason given"})` : null,
        `   Delivered  : ${order.isDelivered ? "Yes" : "Not yet"}`,
        `   Shipping   : ${[order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.postalCode, order.shippingAddress?.country].filter(Boolean).join(", ")}`,
        `   Placed on  : ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
        `\n   Items:\n${items}`,
      ]
        .filter(Boolean)
        .join("\n");

      await setCache(cacheKey, result, 120);
      return result;
    } catch (err) {
      return `Error: ${err.message}`;
    }
  },
  {
    name: "getOrderDetails",
    description: "Get full details of a specific order by its ID.",
    schema: z.object({
      orderId: z.string().describe("The order ID to look up."),
    }),
  }
);

// 9. Cart Summary (reads userId from config)
const getCartSummary = tool(
  async (_input, config) => {
    try {
      const userId = getUserId(config);
      if (!userId) return "Please log in to view your cart.";

      const cacheKey = `agent:cart:${userId}`;
      const cached = await getCache(cacheKey);
      if (cached) return cached;

      const cart = await Cart.findOne({ user: userId })
        .populate("items.product", "title price discountPrice stock slug")
        .lean();

      if (!cart || !cart.items?.length) return "Your cart is empty. Start adding products!";

      const items = cart.items
        .map((it, i) => {
          const name = it.product?.title || "Unknown";
          const unitPrice = it.discountPrice > 0 ? it.discountPrice : it.price;
          const outOfStock = it.product && it.product.stock <= 0;
          return `  ${i + 1}. ${name} x${it.quantity} — ₹${unitPrice * it.quantity}${outOfStock ? "  Out of stock" : ""}`;
        })
        .join("\n");

      const result = ` Your Cart (${cart.items.length} item(s)):\n${items}\n\n   Subtotal (MRP) : ₹${cart.totalPrice}\n   You Pay        : ₹${cart.totalDiscountPrice || cart.totalPrice}${cart.totalDiscountPrice && cart.totalDiscountPrice < cart.totalPrice ? `\n   You Save       : ₹${cart.totalPrice - cart.totalDiscountPrice}` : ""}`;

      await setCache(cacheKey, result, 60);
      return result;
    } catch (err) {
      return `Error fetching cart: ${err.message}`;
    }
  },
  {
    name: "getCartSummary",
    description: "View the user's shopping cart — items, quantities, prices, and totals.",
    schema: z.object({}),
  }
);

// Shared tools array — same instance for all users
export const tools = [
  getProductDetails,
  getProductsByCategory,
  getCategories,
  getOrderHistory,
  getOrderDetails,
  getCartSummary,
];
