import React, { useEffect, useState } from 'react';
import { getQuizResults } from '../utils/api';
import QuizAttemptModal from './QuizAttemptModal';

const getScoreColor = (score) => {
  if (score >= 90) return '#28a745';
  if (score >= 80) return '#20c997';
  if (score >= 70) return '#17a2b8';
  if (score >= 60) return '#ffc107';
  if (score >= 50) return '#fd7e14';
  return '#dc3545';
};

const QuizHistory = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const results = await getQuizResults();
        console.log(results);
        setHistory(results);
      } catch (err) {
        setHistory([]);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [user]);

  // Summary stats
  const totalQuizzes = history.length;
  const avgScore = totalQuizzes ? Math.round(history.reduce((a, b) => a + (b.score || 0), 0) / totalQuizzes) : 0;
  const bestScore = totalQuizzes ? Math.max(...history.map(h => h.score || 0)) : 0;

  if (!user) return <div className="main-content"><h2>Please log in to view your quiz history.</h2></div>;
  if (loading) return <div className="main-content"><div className="quiz-history-spinner"></div><h2>Loading quiz history...</h2></div>;
  if (history.length === 0) return <div className="main-content"><h2>No quiz history found.</h2></div>;

  return (
    <div className="main-content">
      <div className="quiz-history-card-container">
        <h2 className="quiz-history-title">📜 Quiz History</h2>
        {/* Summary Stats */}
        <div className="quiz-history-stats-row">
          <div className="quiz-history-stat-block">
            <div className="quiz-history-stat-label">Total Quizzes</div>
            <div className="quiz-history-stat-value">{totalQuizzes}</div>
          </div>
          <div className="quiz-history-stat-block">
            <div className="quiz-history-stat-label">Average Score</div>
            <div className="quiz-history-stat-value">{avgScore}%</div>
          </div>
          <div className="quiz-history-stat-block">
            <div className="quiz-history-stat-label">Best Score</div>
            <div className="quiz-history-stat-value">{bestScore}%</div>
          </div>
        </div>
        <div className="quiz-history-list">
          {history.map((result, idx) => (
            <div
              key={result.id}
              className="quiz-history-list-item"
              onClick={() => setSelectedAttempt(result)}
              style={{ borderLeft: `5px solid ${getScoreColor(result.score)}` }}
            >
              <div className="quiz-history-list-row">
                <span className="quiz-history-list-date">{result.date?.toDate ? result.date.toDate().toLocaleString() : ''}</span>
                <span className="quiz-history-list-score" style={{ color: getScoreColor(result.score) }}>{result.score}%</span>
              </div>
              <div className="quiz-history-list-row">
                <span className="quiz-history-list-label">Category:</span>
                <span className="quiz-history-list-value">{result.category}</span>
                <span className="quiz-history-list-label">Difficulty:</span>
                <span className="quiz-history-list-value">{result.difficulty}</span>
              </div>
              <div className="quiz-history-list-row">
                <span className="quiz-history-list-label">Questions:</span>
                <span className="quiz-history-list-value">{result.questionCount}</span>
                <span className="quiz-history-list-label">Time:</span>
                <span className="quiz-history-list-value">{result.totalTime}s</span>
              </div>
              {idx !== history.length - 1 && <div className="quiz-history-divider"></div>}
            </div>
          ))}
        </div>
      </div>
      <QuizAttemptModal attempt={selectedAttempt} onClose={() => setSelectedAttempt(null)} />
    </div>
  );
};

export default QuizHistory; 