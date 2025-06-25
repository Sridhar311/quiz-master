import React, { useState } from 'react';
import { categories, difficultyLevels } from '../data/questions';

const QuizStart = ({ onStartQuiz, selectedCategory }) => {
  const [category, setCategory] = useState(selectedCategory ? selectedCategory.name : 'All Categories');
  const [difficulty, setDifficulty] = useState('All Difficulties');
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(30);

  const handleStart = () => {
    onStartQuiz({
      category,
      difficulty,
      questionCount,
      timeLimit
    });
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#667eea' }}>
          🧠 Quiz App
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Choose Category</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn ${category === cat ? '' : 'btn-secondary'}`}
                onClick={() => setCategory(cat)}
                style={{ width: '100%' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Difficulty Level</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
            {difficultyLevels.map((diff) => (
              <button
                key={diff}
                className={`btn ${difficulty === diff ? '' : 'btn-secondary'}`}
                onClick={() => setDifficulty(diff)}
                style={{ width: '100%' }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Number of Questions</h3>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                fontSize: '16px'
              }}
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem' }}>Time Limit (seconds)</h3>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                fontSize: '16px'
              }}
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={45}>45 seconds</option>
              <option value={60}>60 seconds</option>
            </select>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn" onClick={handleStart} style={{ fontSize: '18px', padding: '15px 40px' }}>
            🚀 Start Quiz
          </button>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
          <p>Test your knowledge across various categories!</p>
          <p>Select your preferences and challenge yourself with our interactive quiz.</p>
        </div>
      </div>
    </div>
  );
};

export default QuizStart; 