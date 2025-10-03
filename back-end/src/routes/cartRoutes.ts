import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cartController.js";

const router = Router();

router.use(authenticate);

router.post("/cart/add", addToCart);
router.get("/cart", getCart);
router.delete("/cart/:bookId", removeFromCart);
router.put("/cart/update", updateCartItem);

export default router;
