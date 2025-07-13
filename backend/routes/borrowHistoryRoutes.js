const express = require('express');
const router = express.Router();
const borrowHistoryController = require('../controllers/borrowHistoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get user's own borrow history
router.get('/my-history', 
  authMiddleware, 
  borrowHistoryController.getUserBorrowHistory
);

// Get borrow history for a specific user (for librarians/managers)
router.get('/user/:userId', 
  authMiddleware, 
  roleMiddleware(['librarian', 'manager']),
  borrowHistoryController.getUserBorrowHistory
);

// Get all borrow history (for librarians/managers)
router.get('/all', 
  authMiddleware, 
  roleMiddleware(['librarian', 'manager']),
  borrowHistoryController.getAllBorrowHistory
);

// Get borrow history for a specific book
router.get('/book/:bookId', 
  authMiddleware, 
  roleMiddleware(['librarian', 'manager']),
  borrowHistoryController.getBookBorrowHistory
);

// Get current borrows (not returned)
router.get('/current', 
  authMiddleware, 
  borrowHistoryController.getCurrentBorrows
);

// Get current borrows for a specific user
router.get('/current/:userId', 
  authMiddleware, 
  roleMiddleware(['librarian', 'manager']),
  borrowHistoryController.getCurrentBorrows
);

module.exports = router; 