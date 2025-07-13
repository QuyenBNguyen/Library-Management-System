const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/form", paymentController.renderForm); // Hiển thị form đơn hàng
router.post("/create", paymentController.createPayment); // Tạo URL và redirect
router.get("/return", paymentController.handleReturn); // Xử lý kết quả VNPay
router.get("/ipn", paymentController.handleIPN); // Xử lý IPN từ VNPay

module.exports = router;
