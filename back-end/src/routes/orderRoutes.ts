import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, processPaymentIntent } from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/orders", authenticate, createOrder);
router.get("/orders/myorders", authenticate, getMyOrders);
router.get("/orders/:id", authenticate, getOrderById);
router.post("/orders/:id/pay", authenticate, processPaymentIntent);

export default router;