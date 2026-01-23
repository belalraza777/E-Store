import express from "express";
const router = express.Router();
import profileController from "../controllers/user/profileController.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import { updateProfileValidation } from "../middlewares/joiValidation.js";
import upload from "../middlewares/upload.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { profileUpdateLimiter } from "../middlewares/rateLimit.js";

router.get("/", verifyAuth, asyncWrapper(profileController.getProfile));
router.patch("/avatar", verifyAuth, profileUpdateLimiter, upload.single("avatar"), asyncWrapper(profileController.updateAvatar));
router.patch("/", verifyAuth, profileUpdateLimiter, updateProfileValidation, asyncWrapper(profileController.updateProfile));
router.patch("/:userId/block", verifyAuth, verifyAdmin, profileUpdateLimiter, asyncWrapper(profileController.setBlockStatus));

export default router;
