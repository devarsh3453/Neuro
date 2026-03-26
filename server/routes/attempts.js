const express = require('express');
const { body } = require('express-validator');
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const { 
  calculateHesitationScore,
  calculateConfidenceScore,
  calculateImpulsivityScore,
  calculateReasoningScore,
  classifyCognitivePattern,
  generateFeedback
} = require('../ai/index');

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

      // --- AI Engine Processing ---
      try {
        // Step 1: Calculate all four scores
        const hesitationScore = calculateHesitationScore(
          attempt.timeToFirstInput
        );
        const confidenceScore = calculateConfidenceScore(
          attempt.editCount
        );
        const impulsivityScore = calculateImpulsivityScore(
          attempt.totalTime, 
          attempt.isCorrect
        );

        // Step 2: Get the question's idealExplanation
        // for reasoning comparison
        const fullQuestion = await Question.findById(
          attempt.questionId
        ).select('idealExplanation subject');

        const reasoningScore = calculateReasoningScore(
          attempt.reasoningText,
          fullQuestion ? fullQuestion.idealExplanation : null
        );

        // Step 3: Classify cognitive pattern
        const cognitivePattern = classifyCognitivePattern(
          hesitationScore,
          confidenceScore,
          impulsivityScore,
          reasoningScore
        );

        // Step 4: Generate personalised feedback
        const feedback = generateFeedback({
          isCorrect: attempt.isCorrect,
          cognitivePattern,
          hesitationScore,
          confidenceScore,
          impulsivityScore,
          reasoningScore,
          questionSubject: fullQuestion ? 
            fullQuestion.subject : 'General'
        });

        // Step 5: Update the attempt with AI results
        attempt.hesitationScore = hesitationScore;
        attempt.confidenceScore = confidenceScore;
        attempt.impulsivityScore = impulsivityScore;
        attempt.reasoningScore = reasoningScore;
        attempt.cognitivePattern = cognitivePattern;
        attempt.feedback = feedback;
        await attempt.save();

      } catch (aiError) {
        // AI processing failure should NOT break 
        // the attempt save — just log it
        console.error('AI Engine error:', aiError.message);
      }
      // --- End AI Engine Processing ---

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
          hesitationScore: attempt.hesitationScore,
          confidenceScore: attempt.confidenceScore,
          impulsivityScore: attempt.impulsivityScore,
          reasoningScore: attempt.reasoningScore,
          cognitivePattern: attempt.cognitivePattern,
          feedback: attempt.feedback
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
