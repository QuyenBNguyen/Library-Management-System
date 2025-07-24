const express = require("express");
const upload = require("../config/uploadConfig");
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Import all book controllers here
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
} = require("../controllers/bookController");

const router = express.Router();

// View all books (manager and librarian)
router.get(
  "/",
  getAllBooks
);
// Create book (librarian only)
router.post(
  "/",
  // roleMiddleware(["librarian"]),
  upload.single("image"),
  createBook
);
// View single book (manager, librarian, member)
router.get(
  "/:id",
  getBookById
);
// Update book (librarian only)
router.put(
  "/:id",
  authMiddleware,
  // roleMiddleware(["librarian"]),
  upload.single("image"),
  updateBookById
);
// Delete book (librarian only)
router.delete(
  "/:id",
  // roleMiddleware(["librarian"]),
  deleteBookById
);

module.exports = router;
