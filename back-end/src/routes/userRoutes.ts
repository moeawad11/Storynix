import { Router } from "express";
import { getProfile } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/profile", authenticate, getProfile);

export default router;