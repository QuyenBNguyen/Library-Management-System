const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Admin Member routes - view and role update only
router.get('/members', memberController.adminGetAllMembers);
router.get('/members/:id', memberController.adminGetMemberById);
router.put('/members/:id/role', memberController.adminUpdateMemberRole);

module.exports = router;
