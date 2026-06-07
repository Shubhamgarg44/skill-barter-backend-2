import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/payment.controller.js";
import { createOrder } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);

export default router;