const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const logger = require("../config/logger");

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        logger.info(`Login admin: ${email}`);
        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (err) {
        logger.error(`Admin Login error: ${err.message}`);
        res.status(500).json({ message: "Login error", error: err.message });
    }
};

exports.createAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();
        logger.info(`New admin created: ${email}`);
        res.status(201).json({ message: "Admin created successfully" });
    } catch (err) {
        logger.error(`Error creating admin, error: ${err.message}`);
        res.status(500).json({ message: "Error creating admin", error: err.message });
    }
};



// Create a new group
exports.createGroup = async (req, res) => {
    const { name } = req.body;

    try {


        const group = new Group({ name, members: [] });
        await group.save();
        res.status(201).json({ message: "Group created", group });
        logger.info(`Group created ${group}`);
    } catch (err) {
        logger.error(`Error creating group, error: ${err.message}`);
        res.status(500).json({ message: "Error creating group", error: err.message });
    }
};

// Get a group by ID
exports.getGroups = async (req, res) => {
    try {
        const group = await Group.find().populate("members", "firstName lastName email");

        res.json(group);
    } catch (err) {
        logger.error(`Error getting groups, error: ${err.message}`);
        res.status(500).json({ message: "Error fetching group", error: err.message });
    }
};
