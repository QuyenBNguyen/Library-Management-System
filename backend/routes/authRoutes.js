const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const forgotPasswordController = require("../controllers/forgotPasswordController");

// Resend OTP
router.post("/resend-otp", authController.resendOtp);

// Auth routes
router.post("/login", authController.login);
router.post("/register", authController.register);
// 👉 Thêm route xác minh
router.post("/verify-otp", authController.verifyOtp);

module.exports = router;

// Forgot password
router.post(
  "/forgot-password/send-otp",
  forgotPasswordController.sendForgotOtp
);
router.post("/forgot-password/reset", forgotPasswordController.resetPassword);
