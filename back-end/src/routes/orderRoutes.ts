import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  processPaymentIntent,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.post("/orders", createOrder);
router.get("/orders/myorders", getMyOrders);
router.get("/orders/:id", getOrderById);
router.post("/orders/:id/payment", processPaymentIntent);

export default router;
