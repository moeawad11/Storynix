import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Endpoints related to user profiles and account management.
 */

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     description: Returns the currently authenticated user's profile information.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Protected route
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Server error
 */
router.get("/profile", getProfile);

/**
 * @openapi
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates user's personal information and password (if provided). Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
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
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newStrongPassword456
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields or current password not provided when changing password
 *       401:
 *         description: Unauthorized or incorrect current password
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
router.put("/profile", updateProfile);

export default router;
