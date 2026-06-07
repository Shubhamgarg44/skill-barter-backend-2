import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

import {
  createReview,
  getProviderReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  createReview
);

router.get(
  "/provider/:providerId",
  getProviderReviews
);

export default router;