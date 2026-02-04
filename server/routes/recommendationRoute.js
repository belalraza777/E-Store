import express from "express";
const router = express.Router();
import recommendationController from "../controllers/user/recommendationController.js";
import asyncWrapper from "../utils/asyncWrapper.js";

//Route to get recommendations for the authenticated user
router.get("/:category",  asyncWrapper(recommendationController.getRecommendations));

export default router;