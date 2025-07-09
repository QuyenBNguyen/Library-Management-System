const express = require("express");
const { authorize } = require("../middleware/auth");
// Import all book controllers here
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/books", getAllBooks);

router.post("/books", authorize("admin", "manager"), createBook);

router.get("/books/:id", authorize("admin", "manager", "member"), getBookById);

router.put("/books/:id", authorize("admin", "manager"), updateBookById);

router.delete("/books/:id", authorize("admin", "manager"), deleteBookById);

// Export the router
module.exports = router;
