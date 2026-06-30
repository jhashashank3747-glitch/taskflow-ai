const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');

router.post('/', protect, createBoard);
router.get('/workspace/:workspaceId', protect, getBoardsByWorkspace);
router.get('/:id', protect, getBoardById);
router.put('/:id', protect, updateBoard);
router.delete('/:id', protect, deleteBoard);

module.exports = router;