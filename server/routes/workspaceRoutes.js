const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  addMember,
  deleteWorkspace,
} = require('../controllers/workspaceController');

router.post('/', protect, createWorkspace);
router.get('/', protect, getWorkspaces);
router.get('/:id', protect, getWorkspaceById);
router.post('/:id/members', protect, addMember);
router.delete('/:id', protect, deleteWorkspace);

module.exports = router;