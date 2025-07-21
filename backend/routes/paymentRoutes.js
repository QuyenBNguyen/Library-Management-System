const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/",
  authMiddleware,
  // roleMiddleware(["librarian", "manager"]),
  paymentController.getAllPayments
);
router.get(
  "/my",
  authMiddleware,
  roleMiddleware(["member"]),
  paymentController.getMyPayments
);
router.get(
  "/user/:id",
  authMiddleware,
  roleMiddleware(["librarian"]),
  paymentController.getAllPaymentsByUser
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["member", "librarian"]),
  paymentController.createPaymentUrl
);
router.get("/ipn", paymentController.getVNPayIpn);
router.get("/vnpay_return", paymentController.vnpayReturn); // thay thế ipn vì chạy local
router.post("/querydr", authMiddleware, paymentController.queryDr);
router.post("/refund", authMiddleware, paymentController.refund);

module.exports = router;
