import { Router } from "express";
import { getBooks, getBookById } from "../controllers/bookController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Books
 *     description: Public endpoints for browsing and retrieving book details.
 */

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books (with pagination and filtering)
 *     description: Retrieves a paginated list of all books. Supports search and author filtering.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: page
 *         in: query
 *         description: "Page number for pagination (default: 1)"
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: "Number of books per page (default: 10, max: 25)"
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: author
 *         in: query
 *         description: Filter books by author name
 *         required: false
 *         schema:
 *           type: string
 *           example: "George Orwell"
 *       - name: search
 *         in: query
 *         description: Search by book title (case-insensitive)
 *         required: false
 *         schema:
 *           type: string
 *           example: "Dune"
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 120
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     itemsPerPage:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 12
 *       500:
 *         description: Server error while fetching books
 */
router.get("/", getBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieves a single book’s details by its ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid book ID format
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getBookById);

export default router;
