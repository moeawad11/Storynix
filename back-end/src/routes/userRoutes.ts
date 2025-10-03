import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = Router();

router.get("/users/profile", authenticate, getProfile);
router.put("/users/profile", authenticate, updateProfile);

export default router;
