const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    position: { type: Number, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    parentCard: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', default: null },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);