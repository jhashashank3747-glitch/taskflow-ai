const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { breakdownTask } = require('../controllers/aiController');

router.post('/breakdown/:cardId', protect, breakdownTask);

module.exports = router;