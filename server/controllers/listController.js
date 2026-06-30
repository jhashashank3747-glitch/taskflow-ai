const List = require('../models/List');

// CREATE a list
const createList = async (req, res) => {
  try {
    const { title, boardId, position } = req.body;

    if (!title || !boardId) {
      return res.status(400).json({ message: 'Title and boardId are required' });
    }

    const list = await List.create({
      title,
      board: boardId,
      position: position ?? 0,
    });

    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all lists for a board (sorted by position)
const getListsByBoard = async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort('position');
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE a list (title or position)
const updateList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE a list
const deleteList = async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createList, getListsByBoard, updateList, deleteList };