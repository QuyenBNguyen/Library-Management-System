const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Checkout books (member, librarian)
router.post('/checkout', authMiddleware, roleMiddleware(['member', 'librarian']), borrowController.checkoutBooks);

// Return books (member, librarian)
router.post('/return', authMiddleware, roleMiddleware(['member', 'librarian']), borrowController.returnBooks);

// Get borrow history (member, librarian, manager)
router.get('/history', authMiddleware, roleMiddleware(['member', 'librarian', 'manager']), borrowController.getBorrowHistory);

// Add BorrowBook CRUD and list endpoints
router.get("/books", authMiddleware, require("../controllers/borrowController").getAllBorrowBooks);
router.get("/my-books", authMiddleware, require("../controllers/borrowController").getMyBorrowBooks);
router.get("/my-borrowing", authMiddleware, borrowController.getMyBorrowingBooks);
router.get('/my-reserving', authMiddleware, borrowController.getMyReservingBooks);
router.get('/my-overdue', authMiddleware, borrowController.getMyOverdueBooks);
router.get("/book/:id", authMiddleware, require("../controllers/borrowController").getBorrowBookById);
router.post("/book", authMiddleware, require("../controllers/borrowController").createBorrowBook);
router.put("/book/:id", authMiddleware, require("../controllers/borrowController").updateBorrowBookById);
router.delete("/book/:id", authMiddleware, require("../controllers/borrowController").deleteBorrowBookById);
router.post('/cleanup-expired-reservations', authMiddleware, borrowController.cleanupExpiredReservations);

module.exports = router; 