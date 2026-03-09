import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { RegisterSchema, LoginSchema } from "../validators/auth.validator.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user registration, login, and logout. JWT is stored in an httpOnly cookie on successful auth.
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account. On success, a JWT is set in an httpOnly cookie (`token`).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully. JWT is set via Set-Cookie header.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.post("/register", validate(RegisterSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Logs in a user and sets a JWT in an httpOnly cookie (`token`).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful. JWT is set via Set-Cookie header.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", validate(LoginSchema), login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: Clears the httpOnly session cookie and ends the user's session.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Not authenticated — no valid session cookie
 */
router.post("/logout", logout);

export default router;
