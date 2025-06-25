const express = require('express');
const QuizResult = require('../models/QuizResult');
const auth = require('../middleware/auth');

const router = express.Router();

// Save a quiz result
router.post('/', auth, async (req, res) => {
  try {
    const {
      score, category, difficulty, questionCount, correctAnswers, totalTime, averageTime, answers, timeSpent, questions, attemptId
    } = req.body;
    // Prevent duplicate saves for the same attempt
    console.log(req.user);
    const existing = await QuizResult.findOne({ user: req.user, attemptId });
    console.log(existing);
    if (existing) {
      console.log("existing");
      return res.status(200).json(existing);
    }
    const result = await QuizResult.create({
      user: req.user,
      score,
      category,
      difficulty,
      questionCount,
      correctAnswers,
      totalTime,
      averageTime,
      answers,
      timeSpent,
      questions
    });
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all quiz results for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user }).sort({ date: -1 });
    console.log(results);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 