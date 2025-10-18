import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = Router();

router.use(authenticate);

router.get("/users/profile", getProfile);
router.put("/users/profile", updateProfile);

export default router;
