const Groq = require('groq-sdk');
const Card = require('../models/Card');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const breakdownTask = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: `Break down this task into 3-5 specific, actionable subtasks.
          Task: "${card.title}".
          Respond ONLY with a JSON array of subtask titles, no explanation, no markdown, no backticks.
          Example format: ["subtask 1", "subtask 2", "subtask 3"]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = completion.choices[0].message.content.trim();
    const subtasks = JSON.parse(text);

    const createdSubtasks = await Promise.all(
      subtasks.map((title, index) =>
        Card.create({
          title,
          list: card.list,
          position: card.position + index + 1,
          parentCard: card._id,
        })
      )
    );

    res.status(201).json({
      message: 'Subtasks created successfully',
      subtasks: createdSubtasks,
    });
  } catch (err) {
    res.status(500).json({ message: 'AI breakdown failed', error: err.message });
  }
};

module.exports = { breakdownTask };