import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAdminStats } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/stats", verifyToken, getAdminStats);

export default router;