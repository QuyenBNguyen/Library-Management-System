const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// List users (manager: all, librarian: only members)
router.get('/', authMiddleware, roleMiddleware(['manager', 'librarian']), userController.getAllUsers);

// Get single user
router.get('/:id', authMiddleware, roleMiddleware(['manager', 'librarian']), userController.getUserById);

// Create user
router.post('/', authMiddleware, roleMiddleware(['manager', 'librarian']), userController.createUser);

// Update user
router.put('/:id', authMiddleware, roleMiddleware(['manager', 'librarian']), userController.updateUser);

// Delete user
router.delete('/:id', authMiddleware, roleMiddleware(['manager', 'librarian']), userController.deleteUser);

module.exports = router; 