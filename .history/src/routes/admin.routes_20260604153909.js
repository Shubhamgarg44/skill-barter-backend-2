import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAdminStats } from "../controllers/admin.controller.js";
import User from "../models/User.js";

const router = express.Router();

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Authorization failed",
    });
  }
};

router.get(
  "/stats",
  verifyToken,
  adminOnly,
  getAdminStats
);

export default router;