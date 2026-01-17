import express from "express";
import orderController from "../controllers/orderController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { createOrderValidation, updateOrderStatusValidation } from "../middlewares/joiValidation.js";

const router = express.Router();

// Create order (direct buy or from cart)
router.post(
    "/",
    verifyAuth,
    createOrderValidation,
    asyncWrapper(orderController.createOrder)
);

// Get current user's orders
router.get(
    "/my",
    verifyAuth,
    asyncWrapper(orderController.getMyOrders)
);

// ADMIN: list all orders
router.get(
    "/",
    verifyAuth,
    verifyAdmin,
    asyncWrapper(orderController.getAllOrders)
);

// ADMIN: filter orders by status or postalCode
router.get(
    "/filter",
    verifyAuth,
    verifyAdmin,
    asyncWrapper(orderController.filterOrders)
);


// ADMIN: update order status/payment status
router.put(
    "/:id/status",
    verifyAuth,
    verifyAdmin,
    updateOrderStatusValidation,
    asyncWrapper(orderController.updateOrderStatus)
);



export default router;
