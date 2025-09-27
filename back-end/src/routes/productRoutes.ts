import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { createProduct } from "../controllers/productController.js";

const router = Router();

router.post("/products", authenticate, authorize(["admin"]), createProduct );

export default router;