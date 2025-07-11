const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Member routes - view only, requires authentication and any role
router.use(authMiddleware);

// Route profile cho user hiện tại
router.get('/profile', memberController.memberGetProfile);
// Members can only view member data
router.get('/', memberController.memberGetAllMembers);
router.get('/:id', memberController.memberGetMemberById);

module.exports = router;
