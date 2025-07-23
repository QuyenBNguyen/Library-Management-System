const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidationRules, userValidationRules, validate } = require("../middleware/validation");

// Auth routes
router.post("/login", authController.login);
router.post("/register", authController.register); // Temporarily disabled validation

module.exports = router;
