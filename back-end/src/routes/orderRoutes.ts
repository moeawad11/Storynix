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

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Endpoints for managing user orders and payments.
 */

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates an order for the authenticated user. Requires items, shipping info, and payment method.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     bookId:
 *                       type: integer
 *                       example: 3
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               shippingAddress:
 *                 type: string
 *                 example: "742 Evergreen Terrace, Springfield"
 *               paymentMethod:
 *                 type: string
 *                 example: "Credit Card"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order initialized successfully. Awaiting payment confirmation.
 *                 orderId:
 *                   type: integer
 *                   example: 12
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid or missing fields
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */
router.post("/", createOrder);

/**
 * @openapi
 * /orders/myorders:
 *   get:
 *     summary: Get all orders for authenticated user
 *     description: Returns all orders placed by the currently logged-in user.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized — token missing or invalid
 *       500:
 *         description: Server error while fetching orders
 */
router.get("/myorders", getMyOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get specific order by ID
 *     description: Fetch details for a specific order belonging to the authenticated user.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to retrieve
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getOrderById);

/**
 * @openapi
 * /orders/{id}/payment:
 *   post:
 *     summary: Process payment for an order
 *     description: Creates a mock payment intent and marks the order as paid upon success.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to process payment for
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: PaymentIntent created. Proceed to confirm payment.
 *                 orderId:
 *                   type: integer
 *                   example: 7
 *                 clientSecret:
 *                   type: string
 *                   example: "pi_123456_secret_abc789"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request or already paid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error during payment processing
 */
router.post("/:id/payment", processPaymentIntent);

export default router;
