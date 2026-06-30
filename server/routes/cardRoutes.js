const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { createCard, getCardsByList, updateCard, deleteCard } = require('../controllers/cardController');

router.post('/', protect, createCard);
router.get('/list/:listId', protect, getCardsByList);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, deleteCard);

module.exports = router;