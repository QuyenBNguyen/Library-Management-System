const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Debug middleware để log tất cả requests
router.use((req, res, next) => {
  console.log("=== MEMBER ROUTES ===");
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);
  next();
});

// Profile routes (TĨNH - đặt lên trên)
router.get("/profile/me", authMiddleware, memberController.memberGetProfile);
router.put("/profile/me", authMiddleware, memberController.updateMemberProfile);

// Change password route (TĨNH - đặt lên trên)
router.put("/change-password", authMiddleware, memberController.changePassword);

// Test endpoint (TĨNH - đặt lên trên)
router.get("/test-auth", authMiddleware, (req, res) => {
  console.log("=== TEST AUTH ENDPOINT ===");
  console.log("User:", req.user);
  res.json({
    success: true,
    message: "Authentication working",
    user: req.user,
  });
});

// Routes for managing members (ĐỘNG - đặt xuống dưới)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["librarian", "manager"]),
  memberController.getAllMembers
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["librarian", "manager"]),
  memberController.getMemberById
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["librarian", "manager"]),
  memberController.createMember
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["librarian", "manager"]),
  memberController.updateMember
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["librarian", "manager"]),
  memberController.deleteMember
);

// Mount avatar routes for member
router.use("/avatar", require("./avatarRoutes"));

module.exports = router;
