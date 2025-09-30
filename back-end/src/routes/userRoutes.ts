import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getProfile } from "../controllers/userController.js";

const router = Router();

router.get("/users/profile", authenticate, getProfile);

export default router;