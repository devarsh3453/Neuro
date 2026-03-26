const express = require('express');
const Question = require('../models/Question');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/questions — return all questions (exclude idealExplanation)
router.get('/', protect, async (req, res) => {
  try {
    const questions = await Question.find().select('-idealExplanation');
    res.status(200).json({ count: questions.length, questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/questions/:id — return single question (exclude idealExplanation)
router.get('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).select('-idealExplanation');
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json({ question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
