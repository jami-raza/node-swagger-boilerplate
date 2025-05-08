const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const transporter = require('../utils/nodemailer');
const logger = require('../config/logger');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, email, password, country } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashed,
      country,
      verificationCode: code,
      codeExpiresAt: expiry,
    });

    await user.save();
    logger.info(`User signup admin: ${email}`);
    // Send code via email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Verify your email",
      html: `<p>Your verification code is: <strong>${code}</strong>. It expires in 10 minutes.</p>`,
    });

    res.status(201).json({ message: "User created. Please verify with the code sent to your email." });
  } catch (err) {
    logger.info(`Signup error: error: ${err.message}`);
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) return res.status(400).json({ message: "User already verified" });

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.codeExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    user.emailVerified = true;
    user.verificationCode = null;
    user.codeExpiresAt = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    logger.info(`Verification error: ${err.message}`);
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ access_token: token });
  } catch (err) {
    logger.info(`Login error: ${err.message}`);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    logger.info(`Error fetching user profile: ${err.message}`);
    res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
};