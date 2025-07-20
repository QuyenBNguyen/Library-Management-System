const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Import all book controllers here
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/", roleMiddleware(["librarian", "member"]), getAllBooks);

router.post("/", roleMiddleware(["librarian", "manager"]), createBook);

router.get(
  "/:id",
  roleMiddleware(["librarian", "member", "manager"]),
  getBookById
);

router.put("/:id", roleMiddleware(["librarian", "manager"]), updateBookById);

router.delete("/:id", roleMiddleware(["librarian", "manager"]), deleteBookById);

module.exports = router;
