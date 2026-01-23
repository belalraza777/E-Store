import express from "express";
const router = express.Router();
import productController from "../controllers/common/productController.js";
import adminProductController from "../controllers/admin/productController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import { createProductValidation, updateProductValidation } from "../middlewares/joiValidation.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { CATEGORIES } from "../constants/categories.js";
import upload from "../middlewares/upload.js";
import { searchLimiter, adminProductLimiter } from "../middlewares/rateLimit.js";

// Public routes
router.get("/", asyncWrapper(productController.getAllProducts));

router.post("/search", searchLimiter, asyncWrapper(productController.searchProducts));

router.get("/categories", (req, res) => {
    return res.status(200).json({ success: true, data: CATEGORIES });
});

router.get("/:slug", asyncWrapper(productController.getProductBySlug));

// Admin routes
router.post(
    "/",
    verifyAuth,
    verifyAdmin,
    adminProductLimiter,
    upload.array("images", 5),
    createProductValidation,
    asyncWrapper(adminProductController.createProduct)
);

router.put(
    "/:id",
    verifyAuth,
    verifyAdmin,
    adminProductLimiter,
    upload.array("images", 5),
    updateProductValidation,
    asyncWrapper(adminProductController.updateProduct)
);

router.delete(
    "/:id",
    verifyAuth,
    verifyAdmin,
    adminProductLimiter,
    asyncWrapper(adminProductController.deleteProduct)
);

router.patch(
    "/:id/stock",
    verifyAuth,
    verifyAdmin,
    adminProductLimiter,
    asyncWrapper(adminProductController.updateStock)
);

export default router;
