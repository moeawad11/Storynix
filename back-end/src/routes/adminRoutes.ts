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

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Administrative endpoints for managing books, orders, and dashboard statistics.
 */

/**
 * @openapi
 * /admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Returns total sales, orders, users, and books, along with the 5 most recent orders.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: string
 *                   example: "1542.75"
 *                 totalOrders:
 *                   type: integer
 *                   example: 38
 *                 totalUsers:
 *                   type: integer
 *                   example: 57
 *                 totalBooks:
 *                   type: integer
 *                   example: 25
 *                 recentOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       totalPrice:
 *                         type: number
 *                         example: 49.99
 *                       orderStatus:
 *                         type: string
 *                         example: "Delivered"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-19T19:00:00.000Z"
 *                       customerName:
 *                         type: string
 *                         example: "John Doe"
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — user is not an admin
 *       500:
 *         description: Server error
 */
router.get("/stats", getDashboardStats);

/**
 * @openapi
 * /admin/books:
 *   post:
 *     summary: Create a new book
 *     description: Allows an admin to create a new book in the catalog.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *               - price
 *               - stockQuantity
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Art of Clean Code"
 *               author:
 *                 type: string
 *                 example: "Robert Martin"
 *               description:
 *                 type: string
 *                 example: "A practical guide to writing clean, maintainable code."
 *               isbn:
 *                 type: string
 *                 example: "978-0-12345-678-9"
 *               price:
 *                 type: number
 *                 example: 29.99
 *               stockQuantity:
 *                 type: integer
 *                 example: 50
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "https://placehold.co/300x450/6366f1/ffffff?text=Clean+Code"
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — user is not an admin
 *       409:
 *         description: Book with same ISBN already exists
 *       500:
 *         description: Server error
 */
router.post("/books", createBook);

/**
 * @openapi
 * /admin/books/{id}:
 *   put:
 *     summary: Update an existing book
 *     description: Allows an admin to modify details of an existing book.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Invalid book ID or missing fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put("/books/:id", updateBook);

/**
 * @openapi
 * /admin/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Allows an admin to delete a book by ID.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 6
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Invalid book ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not an admin
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete("/books/:id", deleteBook);

/**
 * @openapi
 * /admin/orders:
 *   get:
 *     summary: Get all orders
 *     description: Allows an admin to view all orders in the system.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get("/orders", getAllOrders);

/**
 * @openapi
 * /admin/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     description: Allows an admin to update the status of a specific order.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 example: "Delivered"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not an admin
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/orders/:id/status", updateOrderStatus);

export default router;
