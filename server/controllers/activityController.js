const Activity = require('../models/Activity');

const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ board: req.params.boardId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createActivity = async (boardId, userId, action) => {
  try {
    await Activity.create({ board: boardId, user: userId, action });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

module.exports = { getActivities, createActivity };