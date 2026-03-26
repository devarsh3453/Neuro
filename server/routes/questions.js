const express = require('express');
const { body } = require('express-validator');
const Question = require('../models/Question');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

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

// POST /api/questions (admin only)
router.post(
  '/',
  protect,
  authorizeAdmin,
  [
    body('questionText').notEmpty().withMessage('Question text is required').isLength({ min: 10 }).withMessage('Question text must be at least 10 characters'),
    body('type').isIn(['mcq', 'short']).withMessage("Type must be 'mcq' or 'short'"),
    body('correctAnswer').notEmpty().withMessage('Correct answer is required'),
    body('idealExplanation').isLength({ min: 20 }).withMessage('Ideal explanation must be at least 20 characters'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage("Difficulty must be 'easy', 'medium', or 'hard'"),
    body('options').if(body('type').equals('mcq')).isArray({ min: 2 }).withMessage('MCQ must have at least 2 options'),
    validate,
  ],
  async (req, res) => {
    try {
      const { questionText, type, options, correctAnswer, idealExplanation, difficulty, subject } = req.body;

      const question = new Question({
        questionText,
        type,
        options: type === 'mcq' ? options : [],
        correctAnswer,
        idealExplanation,
        difficulty,
        subject,
      });

      await question.save();
      res.status(201).json({ message: 'Question created successfully', question });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/questions/:id (admin only)
router.put(
  '/:id',
  protect,
  authorizeAdmin,
  [
    body('questionText').optional().isLength({ min: 10 }).withMessage('Question text must be at least 10 characters'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage("Difficulty must be 'easy', 'medium', or 'hard'"),
    validate,
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Prevent changing type or options via simple PUT for now if needed,
      // but here we just allow general updates.
      const question = await Question.findByIdAndUpdate(id, updates, { new: true });

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      res.status(200).json({ message: 'Question updated successfully', question });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/questions/:id (admin only)
router.delete('/:id', protect, authorizeAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
