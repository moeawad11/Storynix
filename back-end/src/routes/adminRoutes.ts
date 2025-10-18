import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { getDashboardStats } from "../controllers/adminController.js";
import {
  createBook,
  deleteBook,
  updateBook,
} from "../controllers/bookController.js";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

router.use(authenticate);
router.use(authorize(["admin"]));

router.get("/admin/stats", getDashboardStats);

router.post("/admin/books", createBook);
router.put("/admin/books/:id", updateBook);
router.delete("/admin/books/:id", deleteBook);

router.get("/admin/orders", getAllOrders);
router.put("/admin/orders/:id/status", updateOrderStatus);

export default router;
