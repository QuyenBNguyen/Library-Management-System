const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Borrow books
router.post('/borrow', 
  authMiddleware, 
  roleMiddleware(['member']),
  borrowController.borrowBooks
);

// Return books
router.post('/return', 
  authMiddleware, 
  roleMiddleware(['member']),
  borrowController.returnBooks
);

// Get current borrows for the logged-in user
router.get('/current', 
  authMiddleware, 
  borrowController.getCurrentBorrows
);

// Get overdue books (for librarians/managers)
router.get('/overdue', 
  authMiddleware, 
  roleMiddleware(['librarian', 'manager']),
  borrowController.getOverdueBooks
);

// Get overdue books for a specific user
router.get('/overdue/:userId', 
  authMiddleware, 
  roleMiddleware(['librarian', 'manager']),
  borrowController.getOverdueBooks
);

module.exports = router; 