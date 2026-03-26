const express = require('express');
const { body } = require('express-validator');
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');

const router = express.Router();

// POST /api/attempts — submit a new attempt
router.post(
  '/',
  protect,
  [
    body('questionId').isMongoId().withMessage('Invalid questionId format'),
    body('finalAnswer').notEmpty().withMessage('Final answer is required'),
    body('timeToFirstInput').optional().isNumeric({ min: 0 }).withMessage('timeToFirstInput must be a non-negative number'),
    body('editCount').optional().isNumeric({ min: 0 }).withMessage('editCount must be a non-negative number'),
    body('totalTime').optional().isNumeric({ min: 0 }).withMessage('totalTime must be a non-negative number'),
    validate,
  ],
  async (req, res) => {
    try {
      const { questionId, timeToFirstInput, editCount, totalTime, finalAnswer, reasoningText } = req.body;

      // Find the question
      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      // Compute correctness
      const isCorrect = finalAnswer === question.correctAnswer;

      // Create and save attempt
      const attempt = new Attempt({
        userId: req.user.userId,
        questionId,
        timeToFirstInput: timeToFirstInput ?? 0,
        editCount: editCount ?? 0,
        totalTime: totalTime ?? 0,
        finalAnswer,
        isCorrect,
        reasoningText: reasoningText || '',
      });

      await attempt.save();

      res.status(201).json({
        message: 'Attempt saved successfully',
        attempt: {
          id: attempt._id,
          questionId,
          finalAnswer,
          isCorrect,
          timeToFirstInput: attempt.timeToFirstInput,
          editCount: attempt.editCount,
          totalTime: attempt.totalTime,
          reasoningText: attempt.reasoningText,
          attemptedAt: attempt.attemptedAt,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/attempts/my — all attempts by the logged-in user
router.get('/my', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.userId })
      .populate('questionId', 'questionText type difficulty subject')
      .sort({ attemptedAt: -1 });

    res.status(200).json({ count: attempts.length, attempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/attempts/my/:questionId — attempts by user for a specific question
router.get('/my/:questionId', protect, async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId:     req.user.userId,
      questionId: req.params.questionId,
    })
      .populate('questionId', 'questionText type difficulty subject')
      .sort({ attemptedAt: -1 });

    res.status(200).json({ count: attempts.length, attempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
