const express = require("express");
const router = express.Router();
const { signup, verifyCode, login, getUserProfile } = require("../../controllers/user.controller");
const { body } = require("express-validator");
const { authenticateToken } = require("../../middlewares/auth.middleware");
const { getGroups } = require("../../controllers/admin.controller");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User APIs
 */

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
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
 *               - country
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/signup",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  signup
);

/**
 * @swagger
 * /api/user/verify-code:
 *   post:
 *     summary: Verify a 6-digit email code
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Code verified successfully
 *       400:
 *         description: Invalid code or email
 */
router.post("/verify-code", verifyCode);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Log in a user and return access token
 *     tags: [User]
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword123
 *     responses:
 *       200:
 *         description: Successful login, returns access token
 *       400:
 *         description: Invalid email or password
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized or token missing
 *       403:
 *         description: Invalid or expired token
 */
router.get("/me", authenticateToken, getUserProfile);

  /**
   * @swagger
   * /api/user/group:
   *   get:
   *     summary: Get all groups
   *     tags: [User]
   *     responses:
   *       200:
   *         description: A list of groups
   */
  router.get("/group",authenticateToken, getGroups);

module.exports = router;
