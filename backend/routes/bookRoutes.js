const express = require("express");
const upload = require("../config/uploadConfig");
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

router.post(
  "/",
  // roleMiddleware(["librarian"]),
  upload.single("image"),
  createBook
);

router.get(
  "/:id",
  // roleMiddleware(["librarian", "member"]),
  getBookById
);

router.put(
  "/:id",
  // roleMiddleware(["librarian"]),
  upload.single("image"),
  updateBookById
);

router.delete(
  "/:id",
  // roleMiddleware(["librarian"]),
  deleteBookById
);

module.exports = router;
