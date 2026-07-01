const Card = require('../models/Card');
const { createActivity } = require('./activityController');

// CREATE a card
const createCard = async (req, res) => {
  try {
    const { title, listId, position, description, boardId } = req.body;

    if (!title || !listId) {
      return res.status(400).json({ message: 'Title and listId are required' });
    }

    const card = await Card.create({
      title,
      description: description || '',
      list: listId,
      position: position ?? 0,
    });

    if (boardId) {
      await createActivity(boardId, req.userId, `created card "${card.title}"`);
    }

    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all cards for a list (sorted by position)
const getCardsByList = async (req, res) => {
  try {
    const cards = await Card.find({ list: req.params.listId }).sort('position');
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE a card
const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE a card
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createCard, getCardsByList, updateCard, deleteCard };