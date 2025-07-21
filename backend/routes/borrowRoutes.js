const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Checkout books (member)
router.post('/checkout', authMiddleware, roleMiddleware(['member', 'librarian']), borrowController.checkoutBooks);

// Return books (member)
router.post('/return', authMiddleware, roleMiddleware(['member', 'librarian']), borrowController.returnBooks);

// Get borrow history (member, librarian, manager)
router.get('/history', authMiddleware, roleMiddleware(['member', 'librarian', 'manager']), borrowController.getBorrowHistory);

module.exports = router; 