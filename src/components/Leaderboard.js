import React, { useState, useEffect } from 'react';
import { leaderboardManager } from '../utils/leaderboard';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCategory, timeFilter]);

  const loadLeaderboard = () => {
    let scores;
    if (selectedCategory === 'All Categories') {
      scores = leaderboardManager.getTopScores(10);
    } else {
      scores = leaderboardManager.getCategoryScores(selectedCategory);
    }

    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      if (timeFilter === 'week') {
        filterDate.setDate(now.getDate() - 7);
      } else if (timeFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1);
      }

      scores = scores.filter(score => new Date(score.timestamp) >= filterDate);
    }

    setLeaderboard(scores);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'General Knowledge': '🌍',
      'Science': '🔬',
      'History': '📚',
      'Geography': '🗺️',
      'Sports': '⚽',
      'Entertainment': '🎬',
      'Technology': '💻',
      'Literature': '📖'
    };
    return icons[category] || '📝';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'gold';
    if (score >= 80) return 'silver';
    if (score >= 70) return 'bronze';
    return 'normal';
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <h2 className="leaderboard-title">🏆 Leaderboard</h2>
          <p className="leaderboard-subtitle">Top performers in the quiz arena</p>
        </div>

        <div className="leaderboard-filters">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All Categories">All Categories</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Technology">Technology</option>
              <option value="Literature">Literature</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Time Period:</label>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="leaderboard-list">
          {leaderboard.length === 0 ? (
            <div className="no-scores">
              <p>No scores yet for this category and time period.</p>
              <p>Be the first to set a record! 🚀</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={entry.id} className={`leaderboard-item ${getScoreColor(entry.score)}`}>
                <div className="rank-badge">
                  {index + 1}
                </div>
                <div className="entry-info">
                  <div className="entry-header">
                    <span className="category-icon">
                      {getCategoryIcon(entry.category)}
                    </span>
                    <span className="category-name">{entry.category}</span>
                    <span className="entry-date">{formatDate(entry.timestamp)}</span>
                  </div>
                  <div className="entry-details">
                    <span className="score">{entry.score}%</span>
                    <span className="questions">{entry.totalQuestions} questions</span>
                    <span className="time">{entry.totalTime}s</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="leaderboard-stats">
          <div className="stat-item">
            <span className="stat-label">Personal Best:</span>
            <span className="stat-value">
              {leaderboardManager.getPersonalBest()?.score || 0}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Score:</span>
            <span className="stat-value">
              {leaderboardManager.getAverageScore()}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Quizzes:</span>
            <span className="stat-value">
              {leaderboardManager.getLeaderboard().length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 