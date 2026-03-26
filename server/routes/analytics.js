const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/analytics/overview (admin only)
router.get('/overview', protect, authorizeAdmin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalQuestions = await Question.countDocuments();
    const attempts = await Attempt.find();
    const totalAttempts = attempts.length;

    if (totalAttempts === 0) {
      return res.status(200).json({
        totalStudents,
        totalQuestions,
        totalAttempts: 0,
        overallAccuracy: 0,
        avgHesitation: 0,
        avgEditCount: 0,
        mostAttemptedQuestion: null,
        hardestQuestion: null,
      });
    }

    const correctAttempts = attempts.filter((a) => a.isCorrect).length;
    const overallAccuracy = parseFloat(((correctAttempts / totalAttempts) * 100).toFixed(2));
    const avgHesitation = parseFloat(
      (attempts.reduce((acc, a) => acc + (a.timeToFirstInput || 0), 0) / totalAttempts).toFixed(2)
    );
    const avgEditCount = parseFloat(
      (attempts.reduce((acc, a) => acc + (a.editCount || 0), 0) / totalAttempts).toFixed(2)
    );

    // Most Attempted Question
    const questionCounts = attempts.reduce((acc, a) => {
      const qId = a.questionId.toString();
      acc[qId] = (acc[qId] || 0) + 1;
      return acc;
    }, {});

    let mostAttemptedId = null;
    let maxAttempts = 0;
    for (const id in questionCounts) {
      if (questionCounts[id] > maxAttempts) {
        maxAttempts = questionCounts[id];
        mostAttemptedId = id;
      }
    }

    let mostAttemptedQuestion = null;
    if (mostAttemptedId) {
      const q = await Question.findById(mostAttemptedId);
      if (q) {
        mostAttemptedQuestion = {
          questionText: q.questionText,
          subject: q.subject,
          attemptCount: maxAttempts,
        };
      }
    }

    // Hardest Question (Lowest accuracy, min 2 attempts)
    const questionStats = attempts.reduce((acc, a) => {
      const qId = a.questionId.toString();
      if (!acc[qId]) acc[qId] = { total: 0, correct: 0 };
      acc[qId].total++;
      if (a.isCorrect) acc[qId].correct++;
      return acc;
    }, {});

    let hardestId = null;
    let minAccuracy = 101;
    for (const id in questionStats) {
      const { total, correct } = questionStats[id];
      if (total >= 2) {
        const accuracy = (correct / total) * 100;
        if (accuracy < minAccuracy) {
          minAccuracy = accuracy;
          hardestId = id;
        }
      }
    }

    let hardestQuestion = null;
    if (hardestId) {
      const q = await Question.findById(hardestId);
      if (q) {
        hardestQuestion = {
          questionText: q.questionText,
          subject: q.subject,
          accuracyRate: parseFloat(minAccuracy.toFixed(2)),
        };
      }
    }

    res.status(200).json({
      totalStudents,
      totalQuestions,
      totalAttempts,
      overallAccuracy,
      avgHesitation,
      avgEditCount,
      mostAttemptedQuestion,
      hardestQuestion,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/students (admin only)
router.get('/students', protect, authorizeAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email');
    const result = [];

    for (const student of students) {
      const attempts = await Attempt.find({ userId: student._id });
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((a) => a.isCorrect).length;
      const accuracyRate =
        totalAttempts === 0 ? 0 : parseFloat(((correctAttempts / totalAttempts) * 100).toFixed(2));
      const avgEditCount =
        totalAttempts === 0
          ? 0
          : parseFloat(
              (attempts.reduce((acc, a) => acc + (a.editCount || 0), 0) / totalAttempts).toFixed(2)
            );

      let confidenceLevel = 'High';
      if (avgEditCount > 3) confidenceLevel = 'Low';
      else if (avgEditCount > 1) confidenceLevel = 'Medium';

      result.push({
        id: student._id,
        name: student.name,
        email: student.email,
        totalAttempts,
        correctAttempts,
        accuracyRate,
        avgEditCount,
        confidenceLevel,
      });
    }

    res.status(200).json({ count: result.length, students: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/questions (admin only)
router.get('/questions', protect, authorizeAdmin, async (req, res) => {
  try {
    const questions = await Question.find();
    const result = [];

    for (const q of questions) {
      const attempts = await Attempt.find({ questionId: q._id });
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter((a) => a.isCorrect).length;
      const accuracyRate =
        totalAttempts === 0 ? 0 : parseFloat(((correctAttempts / totalAttempts) * 100).toFixed(2));
      const avgTimeToFirstInput =
        totalAttempts === 0
          ? 0
          : parseFloat(
              (
                attempts.reduce((acc, a) => acc + (a.timeToFirstInput || 0), 0) / totalAttempts
              ).toFixed(2)
            );
      const avgEditCount =
        totalAttempts === 0
          ? 0
          : parseFloat(
              (attempts.reduce((acc, a) => acc + (a.editCount || 0), 0) / totalAttempts).toFixed(2)
            );

      result.push({
        id: q._id,
        questionText: q.questionText,
        subject: q.subject,
        difficulty: q.difficulty,
        totalAttempts,
        correctAttempts,
        accuracyRate,
        avgTimeToFirstInput,
        avgEditCount,
      });
    }

    result.sort((a, b) => b.totalAttempts - a.totalAttempts);
    res.status(200).json({ count: result.length, questions: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
