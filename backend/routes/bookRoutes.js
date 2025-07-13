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

router.get("/", 
  authMiddleware,roleMiddleware(['librarian','member']),
  getAllBooks);

router.post("/", 
  authMiddleware,roleMiddleware(['librarian']),
  createBook);

router.get("/:id", 
  authMiddleware,roleMiddleware(['librarian','member']), 
  getBookById);

router.put("/:id", 
  authMiddleware,roleMiddleware(['librarian']),
  updateBookById);

router.delete("/:id", 
  authMiddleware,roleMiddleware(['librarian']),
  deleteBookById);

// Export the router
module.exports = router;
