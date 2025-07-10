const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


// Routes for managing members
router.get('/', 
    authMiddleware, roleMiddleware(['librarian','manager']),
    memberController.getAllMembers);
router.get('/:id', 
    authMiddleware, roleMiddleware(['librarian', 'manager']),
    memberController.getMemberById);

router.post('/', 
    authMiddleware, roleMiddleware(['librarian', 'manager']),
    memberController.createMember);

router.put('/:id', 
    authMiddleware, roleMiddleware(['librarian', 'manager']),
    memberController.updateMember);

router.delete('/:id', 
    authMiddleware, roleMiddleware(['librarian', 'manager']),
    memberController.deleteMember);

module.exports = router;
