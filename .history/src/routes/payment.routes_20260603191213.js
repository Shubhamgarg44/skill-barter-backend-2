import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    verifyPayment,
  } from "../controllers/payment.controller.js";
  

const router = express.Router();

router.post("/create-order", verifyToken, createOrder);
router.post(
    "/verify",
    verifyToken,
    verifyPayment
  );

export default router;