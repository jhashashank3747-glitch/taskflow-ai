const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getActivities } = require('../controllers/activityController');

router.get('/:boardId', protect, getActivities);

module.exports = router;