const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add a question
router.post('/', auth, async (req, res) => {
  try {
    const { question, options, answer, category } = req.body;
    if (!question || !options || !answer || !category) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newQuestion = await Question.create({ question, options, answer, category });
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Edit a question
router.put('/:id', auth, async (req, res) => {
  try {
    const { question, options, answer, category } = req.body;
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, answer, category },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Question not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a question
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found.' });
    res.json({ message: 'Question deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 