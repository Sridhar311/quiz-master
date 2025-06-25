import React from 'react';

const HomePage = ({ onStartQuiz }) => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1 className="home-title">🧠 Welcome to QuizMaster</h1>
          <p className="home-subtitle">Test your knowledge across multiple categories</p>
        </div>

        <div className="home-features">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Multiple Categories</h3>
            <p>Science, History, Geography, Technology, Sports & more</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Timed Challenges</h3>
            <p>Test your speed and accuracy with timed questions</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your performance and see detailed results</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Earn Points</h3>
            <p>Score points and compete with yourself to improve</p>
          </div>
        </div>

        <div className="home-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">8</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Quizzes Taken</div>
          </div>
        </div>

        <div className="home-actions">
          <button className="start-quiz-btn" onClick={onStartQuiz}>
            🚀 Start Quiz Now
          </button>
          <p className="home-note">Choose your category and difficulty level</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 