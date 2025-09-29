import {Router} from "express";
import { register, login, getProfile} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/profile", authenticate, getProfile);

export default router;