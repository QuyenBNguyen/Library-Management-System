const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const { loginValidationRules, userValidationRules, validate } = require("../middleware/validation");

// Auth routes
router.post("/login", authController.login);
router.post("/register", authController.register); // Temporarily disabled validation

// Email verification routes
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);

// Forgot password routes
router.post("/forgot-password", forgotPasswordController.sendForgotOtp);
router.post("/reset-password", forgotPasswordController.resetPassword);

module.exports = router;
