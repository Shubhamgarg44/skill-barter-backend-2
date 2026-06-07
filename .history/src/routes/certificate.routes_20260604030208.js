import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { generateCertificate } from "../controllers/certificate.controller.js";

const router = express.Router();

router.get(
  "/:requestId",
  verifyToken,
  generateCertificate
);

export default router;