import express from "express";
const router = express.Router();
import recommendationController from "../controllers/user/recommendationController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";

//Route to get recommendations for the authenticated user
router.get("/", verifyAuth, asyncWrapper(recommendationController.getRecommendations));

export default router;