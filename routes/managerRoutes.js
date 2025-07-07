const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Manager Member routes - require authentication and manager/admin role
router.use(authMiddleware);
router.use(authorize('admin', 'manager'));

router.get('/members', memberController.managerGetAllMembers);
router.get('/members/:id', memberController.managerGetMemberById);
router.post('/members', memberController.managerCreateMember);
router.put('/members/:id', memberController.managerUpdateMember);
router.delete('/members/:id', memberController.managerDeleteMember);

module.exports = router;
