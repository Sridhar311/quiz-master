import React, { useState, useEffect } from 'react';
import { getQuizResults } from '../utils/api';

const StatisticsPage = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }
    fetchResults();
    // eslint-disable-next-line
  }, [user]);

  async function fetchResults() {
    setLoading(true);
    setError('');
    try {
      const data = await getQuizResults();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch statistics');
    }
    setLoading(false);
  }

  // Compute stats from results
  const stats = React.useMemo(() => {
    if (!results.length) return {
      totalQuizzes: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      averageScore: 0,
      bestCategory: '-',
      totalTime: 0,
      streakDays: 0,
      achievements: 0
    };
    const totalQuizzes = results.length;
    const totalQuestions = results.reduce((sum, r) => sum + (r.questionCount || 0), 0);
    const correctAnswers = results.reduce((sum, r) => sum + (r.correctAnswers || 0), 0);
    const averageScore = Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / totalQuizzes);
    const totalTime = results.reduce((sum, r) => sum + (r.totalTime || 0), 0);
    // Best category by average score
    const catMap = {};
    results.forEach(r => {
      if (!catMap[r.category]) catMap[r.category] = { total: 0, count: 0 };
      catMap[r.category].total += r.score || 0;
      catMap[r.category].count += 1;
    });
    let bestCategory = '-';
    let bestAvg = 0;
    Object.entries(catMap).forEach(([cat, { total, count }]) => {
      const avg = total / count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestCategory = cat;
      }
    });
    // Streak days (simplified: unique days with a quiz)
    const days = new Set(results.map(r => new Date(r.createdAt || r.date).toDateString()));
    // Achievements: simple count for now
    const achievements = 0;
    return {
      totalQuizzes,
      totalQuestions,
      correctAnswers,
      averageScore,
      bestCategory,
      totalTime,
      streakDays: days.size,
      achievements
    };
  }, [results]);

  // Category stats
  const categoryStats = React.useMemo(() => {
    const map = {};
    results.forEach(r => {
      if (!map[r.category]) map[r.category] = { name: r.category, quizzes: 0, totalScore: 0, questions: 0, correct: 0 };
      map[r.category].quizzes += 1;
      map[r.category].totalScore += r.score || 0;
      map[r.category].questions += r.questionCount || 0;
      map[r.category].correct += r.correctAnswers || 0;
    });
    return Object.values(map).map(cat => ({
      ...cat,
      average: cat.quizzes ? Math.round(cat.totalScore / cat.quizzes) : 0
    }));
  }, [results]);

  // Recent quizzes
  const recentQuizzes = results.slice(0, 5).map(r => ({
    date: r.createdAt || r.date,
    category: r.category,
    score: r.score,
    questions: r.questionCount,
    time: r.totalTime
  }));

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#8bc34a';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  const getAchievementStatus = (earned) => {
    return earned ? 'achievement-earned' : 'achievement-locked';
  };

  if (!user) return <div className="statistics-container"><h2>Please log in to view your statistics.</h2></div>;
  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="statistics-container">
      <div className="statistics-content">
        <div className="statistics-header">
          <h1 className="statistics-title">📊 Your Statistics</h1>
          <p className="statistics-subtitle">Track your progress and achievements</p>
        </div>

        {/* Period Filter */}
        <div className="period-filter">
          <button 
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            This Week
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            This Month
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('all')}
          >
            All Time
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="stats-overview">
          <div className="stat-card primary">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">{stats.averageScore}%</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalQuizzes}</div>
              <div className="stat-label">Quizzes Taken</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.correctAnswers}/{stats.totalQuestions}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-value">{formatTime(stats.totalTime)}</div>
              <div className="stat-label">Total Time</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.streakDays}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{stats.achievements}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="section">
          <h2 className="section-title">📚 Category Performance</h2>
          <div className="category-stats-grid">
            {categoryStats.map((category, index) => (
              <div key={index} className="category-stat-card">
                <div className="category-stat-header">
                  <h3>{category.name}</h3>
                  <span 
                    className="category-score"
                    style={{ color: getScoreColor(category.average) }}
                  >
                    {category.average}%
                  </span>
                </div>
                <div className="category-stat-details">
                  <div className="stat-detail">
                    <span className="detail-label">Quizzes:</span>
                    <span className="detail-value">{category.quizzes}</span>
                  </div>
                  <div className="stat-detail">
                    <span className="detail-label">Questions:</span>
                    <span className="detail-value">{category.questions}</span>
                  </div>
                  <div className="stat-detail">
                    <span className="detail-label">Correct:</span>
                    <span className="detail-value">{category.correct}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${category.average}%`,
                      backgroundColor: getScoreColor(category.average)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="section">
          <h2 className="section-title">📝 Recent Quizzes</h2>
          <div className="recent-quizzes">
            {recentQuizzes.map((quiz, index) => (
              <div key={index} className="quiz-history-card">
                <div className="quiz-history-date">
                  {new Date(quiz.date).toLocaleDateString()}
                </div>
                <div className="quiz-history-category">
                  {quiz.category}
                </div>
                <div className="quiz-history-score" style={{ color: getScoreColor(quiz.score) }}>
                  {quiz.score}%
                </div>
                <div className="quiz-history-details">
                  <span>{quiz.questions} questions</span>
                  <span>{Math.floor(quiz.time / 60)}m {quiz.time % 60}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="section">
          <h2 className="section-title">🏆 Achievements</h2>
          <div className="achievements-grid">
            {/* Achievements content will be populated here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage; 