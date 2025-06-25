import React, { useState, useEffect } from 'react';
import { questions as allQuestions } from '../data/questions';
import { saveQuizResult } from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

const TestPage = ({ user, questionCount = 10 }) => {
  // Select a random set of questions
  const [questions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  });
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const attemptId = React.useRef(uuidv4());
  const [quizStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  // Live timer effect
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - quizStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [quizStartTime, submitted]);

  const handleSelect = (idx) => {
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const handlePrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const correctAnswers = answers.filter((a, i) => a === questions[i].correctAnswer).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const totalTime = Math.round((Date.now() - quizStartTime) / 1000); // in seconds
    const payload = {
      score,
      category: 'Mixed',
      difficulty: 'All',
      questionCount: questions.length,
      correctAnswers,
      totalTime,
      averageTime: totalTime ? Math.round(totalTime / questions.length) : 0,
      answers,
      timeSpent: [],
      questions,
      attemptId: attemptId.current
    };
    try {
      const res = await saveQuizResult(payload);
      setResult({ score, correctAnswers, total: questions.length, totalTime });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit result.');
    }
    setSubmitting(false);
  };

  if (submitted && result) {
    const hours = Math.floor(result.totalTime / 3600);
    const minutes = Math.floor((result.totalTime % 3600) / 60);
    const seconds = result.totalTime % 60;
    return (
      <div className="container">
        <div className="card">
          <h2>Quiz Complete!</h2>
          <p>Your Score: <b>{result.score}%</b> ({result.correctAnswers} / {result.total})</p>
          <p>Total Time: <b>{hours}h {minutes}m {seconds}s</b></p>
          <button className="btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  return (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'right', color: '#667eea', fontWeight: 600, fontSize: 18 }}>
          ⏱️ {hours}h {minutes}m {seconds}s
        </div>
        <h3>Question {current + 1} of {questions.length}</h3>
        <div style={{ margin: '1rem 0', fontWeight: 500 }}>{q.question}</div>
        <div className="options-grid">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`option-btn${answers[current] === idx ? ' selected' : ''}`}
              onClick={() => handleSelect(idx)}
              disabled={submitting}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button className="btn" onClick={handlePrev} disabled={current === 0 || submitting}>Prev</button>
          {current < questions.length - 1 ? (
            <button className="btn" onClick={handleNext} disabled={submitting}>Next</button>
          ) : (
            <button className="btn" onClick={handleSubmit} disabled={submitting || answers.includes(null)}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
        {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      </div>
    </div>
  );
};

export default TestPage; 