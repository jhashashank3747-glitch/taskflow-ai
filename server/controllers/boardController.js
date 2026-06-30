const Board = require('../models/Board');

// CREATE a board
const createBoard = async (req, res) => {
  try {
    const { title, workspaceId } = req.body;

    if (!title || !workspaceId) {
      return res.status(400).json({ message: 'Title and workspaceId are required' });
    }

    const board = await Board.create({
      title,
      workspace: workspaceId,
      createdBy: req.userId,
    });

    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all boards for a workspace
const getBoardsByWorkspace = async (req, res) => {
  try {
    const boards = await Board.find({ workspace: req.params.workspaceId });
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET a single board
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE a board
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE a board
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createBoard, getBoardsByWorkspace, getBoardById, updateBoard, deleteBoard };