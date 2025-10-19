import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cartController.js";

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * tags:
 *   - name: Cart
 *     description: Endpoints for managing the user's shopping cart.
 */

/**
 * @openapi
 * /cart/add:
 *   post:
 *     summary: Add a book to cart
 *     description: Adds a book to the authenticated user's cart. If it already exists, the quantity is increased.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 3
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item added to cart
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Missing fields or exceeds stock quantity
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post("/add", addToCart);

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Get user cart
 *     description: Retrieves all items in the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Error fetching cart
 */
router.get("/", getCart);

/**
 * @openapi
 * /cart/clear:
 *   delete:
 *     summary: Clear all items in cart
 *     description: Deletes all items from the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       500:
 *         description: Error clearing cart
 */
router.delete("/clear", clearCart);

/**
 * @openapi
 * /cart/{bookId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     description: Deletes a specific book from the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: The ID of the book to remove from the cart.
 *         schema:
 *           type: integer
 *           example: 4
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       500:
 *         description: Error removing item
 */
router.delete("/:bookId", removeFromCart);

/**
 * @openapi
 * /cart/update:
 *   put:
 *     summary: Update quantity of an item
 *     description: Updates the quantity of a specific book in the user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart updated
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Missing fields
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Error updating cart
 */
router.put("/update", updateCartItem);

export default router;
