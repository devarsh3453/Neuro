const express = require('express');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Helper to calculate profile stats from a list of attempts
 */
const calculateProfileStats = (userId, attempts) => {
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const accuracyRate =
    totalAttempts === 0 ? 0 : parseFloat(((correctAttempts / totalAttempts) * 100).toFixed(2));

  // Averages
  const sumTimeToFirst = attempts.reduce((acc, a) => acc + (a.timeToFirstInput || 0), 0);
  const sumEditCount = attempts.reduce((acc, a) => acc + (a.editCount || 0), 0);
  const sumTotalTime = attempts.reduce((acc, a) => acc + (a.totalTime || 0), 0);

  const avgTimeToFirstInput =
    totalAttempts === 0 ? 0 : parseFloat((sumTimeToFirst / totalAttempts).toFixed(2));
  const avgEditCount =
    totalAttempts === 0 ? 0 : parseFloat((sumEditCount / totalAttempts).toFixed(2));
  const avgTotalTime =
    totalAttempts === 0 ? 0 : parseFloat((sumTotalTime / totalAttempts).toFixed(2));

  // Cognitive Levels
  let hesitationLevel = 'Low';
  if (avgTimeToFirstInput > 5000) hesitationLevel = 'High';
  else if (avgTimeToFirstInput > 2000) hesitationLevel = 'Medium';

  let impulsivityLevel = 'Low';
  if (avgTotalTime < 15 && accuracyRate < 60) impulsivityLevel = 'High';
  else if (avgTotalTime < 15) impulsivityLevel = 'Medium';

  let confidenceLevel = 'High';
  if (avgEditCount > 3) confidenceLevel = 'Low';
  else if (avgEditCount > 1) confidenceLevel = 'Medium';

  // Recent 5 attempts
  const recentAttempts = attempts.slice(0, 5);

  return {
    userId,
    totalAttempts,
    correctAttempts,
    accuracyRate,
    avgTimeToFirstInput,
    avgEditCount,
    avgTotalTime,
    hesitationLevel,
    impulsivityLevel,
    confidenceLevel,
    recentAttempts,
  };
};

// GET /api/profile/my — Student profile summary
router.get('/my', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const attempts = await Attempt.find({ userId })
      .populate('questionId', 'questionText difficulty subject')
      .sort({ attemptedAt: -1 });

    const stats = calculateProfileStats(userId, attempts);
    const user = await User.findById(userId);
    res.status(200).json({ ...stats, name: user?.name || 'Student' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile/:userId — Admin view student profile
router.get('/:userId', protect, authorizeAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const attempts = await Attempt.find({ userId })
      .populate('questionId', 'questionText difficulty subject')
      .sort({ attemptedAt: -1 });

    const stats = calculateProfileStats(userId, attempts);
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
