const express = require("express");
const router = express.Router();
const { createAdmin } = require("../../controllers/admin.controller");
const { body } = require("express-validator");
const { authenticateAdmin } = require("../../middlewares/auth.middleware");
const { loginAdmin } = require("../../controllers/admin.controller");
const { getGroups } = require("../../controllers/admin.controller");
const { createGroup } = require("../../controllers/admin.controller");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login with access token
 *       400:
 *         description: Invalid email or password
 */
router.post("/login", loginAdmin);

/**
 * @swagger
 * /api/admin/create:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation error or duplicate email
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create",
  authenticateAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Min 6 characters password"),
  ],
  createAdmin
);


/**
 * @swagger
 * /api/admin/group:
 *   post:
 *     summary: Create a group
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - memberIds
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created
 *       400:
 *         description: Validation error
 */
router.post(
    "/group",
    authenticateAdmin,
    [
      body("name").notEmpty().withMessage("Name is required"),
    ],
    createGroup
  );
  
  /**
   * @swagger
   * /api/admin/group:
   *   get:
   *     summary: Get all groups
   *     tags: [Admin]
   *     responses:
   *       200:
   *         description: A list of groups
   */
  router.get("/group",authenticateAdmin, getGroups);

module.exports = router;
