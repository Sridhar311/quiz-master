const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  category: { type: String },
  difficulty: { type: String },
  questionCount: { type: Number },
  correctAnswers: { type: Number },
  totalTime: { type: Number },
  averageTime: { type: Number },
  answers: { type: [String] },
  timeSpent: { type: [Number] },
  date: { type: Date, default: Date.now },
  questions: { type: [Object] }
});

// quizResultSchema.index({ user: 1, attemptId: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema); 