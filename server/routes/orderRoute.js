import express from "express";
import userOrderController from "../controllers/user/orderController.js";
import adminOrderController from "../controllers/admin/orderController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createOrderValidation, updateOrderStatusValidation } from "../middlewares/joiValidation.js";

const router = express.Router();

// USER ROUTES

// Create order (direct buy or from cart)
router.post(
    "/",
    verifyAuth,
    createOrderValidation,
    asyncWrapper(userOrderController.createOrder)
);

// Get current user's orders
router.get(
    "/my",
    verifyAuth,
    asyncWrapper(userOrderController.getMyOrders)
);

// Get single order by ID (user)
router.get(
    "/:id",
    verifyAuth,
    asyncWrapper(userOrderController.getOrderById)
);

// Cancel order by user
router.put(
    "/:id/cancel",
    verifyAuth,
    asyncWrapper(userOrderController.cancelOrder)
);

// ADMIN ROUTES

// ADMIN: list all orders
router.get(
    "/",
    verifyAuth,
    verifyAdmin,
    asyncWrapper(adminOrderController.getAllOrders)
);

// ADMIN: filter orders by status or postalCode
router.get(
    "/filter",
    verifyAuth,
    verifyAdmin,
    asyncWrapper(adminOrderController.filterOrders)
);

// ADMIN: update order status/payment status
router.put(
    "/:id/status",
    verifyAuth,
    verifyAdmin,
    updateOrderStatusValidation,
    asyncWrapper(adminOrderController.updateOrderStatus)
);



export default router;
