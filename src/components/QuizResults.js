import React, { useEffect, useRef, useState } from 'react';
import { leaderboardManager } from '../utils/leaderboard';
import { soundManager } from '../utils/soundEffects';
import { saveQuizResult } from '../utils/api';

const QuizResults = ({ results, quizConfig, onRestart, onNewQuiz, user, attemptId }) => {
  const { answers, questions, timeSpent } = results;
  const { questionCount, category, difficulty } = quizConfig;
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [personalBest, setPersonalBest] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const hasSaved = useRef(false);

  const correctAnswers = answers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  
  const score = Math.round((correctAnswers / questionCount) * 100);
  const averageTime = Math.round(timeSpent.reduce((a, b) => a + b, 0) / timeSpent.length);
  const totalTime = typeof results.totalTime === 'number' ? results.totalTime : Math.round(timeSpent.reduce((a, b) => a + b, 0));

 useEffect(() => {
  if (hasSaved.current) return;
  const saveResult = async () => {
    try {
      const result = await saveQuizResult({
        score,
        category,
        difficulty,
        questionCount,
        correctAnswers,
        totalTime,
        averageTime,
        answers,
        timeSpent,
        questions, // Store questions for review
        attemptId
      });
      hasSaved.current = true;
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
  saveResult();
 } , []);
  
  useEffect(() => {
    // Save score to leaderboard
    const scoreData = {
      score,
      category,
      difficulty,
      totalQuestions: questionCount,
      correctAnswers,
      totalTime,
      averageTime
    };
    
    const updatedLeaderboard = leaderboardManager.addScore(scoreData);
    
    // Check if this is a new record
    const currentBest = leaderboardManager.getPersonalBest();
    if (currentBest && currentBest.score === score && currentBest.id === updatedLeaderboard[0]?.id) {
      setIsNewRecord(true);
      soundManager.play('complete');
    }
    
    setPersonalBest(currentBest);
    // eslint-disable-next-line
  }, [score, category, difficulty, questionCount, correctAnswers, totalTime, averageTime]);

  
  const getScoreMessage = (score) => {
    if (score >= 90) return "🎉 Excellent! You're a quiz master!";
    if (score >= 80) return "👏 Great job! You really know your stuff!";
    if (score >= 70) return "👍 Good work! You have solid knowledge!";
    if (score >= 60) return "😊 Not bad! Keep learning and improving!";
    if (score >= 50) return "🤔 You're getting there! More practice needed.";
    return "📚 Keep studying! Every expert was once a beginner.";
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#28a745';
    if (score >= 80) return '#20c997';
    if (score >= 70) return '#17a2b8';
    if (score >= 60) return '#ffc107';
    if (score >= 50) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#667eea' }}>
          🏆 Quiz Results
        </h1>

        {/* New Record Notification */}
        {isNewRecord && (
          <div style={{ 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb', 
            color: '#155724',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center',
            animation: 'pulse 2s infinite'
          }}>
            🎉 <strong>New Personal Best!</strong> 🎉
          </div>
        )}

        {/* Score Display */}
        <div className="score-display">
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: getScoreColor(score),
            marginBottom: '1rem'
          }}>
            {score}%
          </div>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '2rem' }}>
            {getScoreMessage(score)}
          </div>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {correctAnswers}/{questionCount}
            </div>
            <div style={{ color: '#666' }}>Correct Answers</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {questionCount - correctAnswers}
            </div>
            <div style={{ color: '#666' }}>Incorrect Answers</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {averageTime}s
            </div>
            <div style={{ color: '#666' }}>Average Time</div>
          </div>
        </div>

        {/* Personal Best Comparison */}
        {personalBest && personalBest.score !== score && (
          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            color: '#856404',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '0.5rem' }}>
              <strong>Personal Best:</strong> {personalBest.score}% ({personalBest.category})
            </div>
            <div style={{ fontSize: '14px' }}>
              {score > personalBest.score ? 'Great improvement!' : 'Keep practicing to beat your best!'}
            </div>
          </div>
        )}

        {/* Quiz Info */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Quiz Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Category:</strong> {category}</div>
            <div><strong>Difficulty:</strong> {difficulty}</div>
            <div><strong>Questions:</strong> {questionCount}</div>
            <div><strong>Total Time:</strong> {totalTime}s</div>
          </div>
        </div>

        {/* Detailed Results */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Question Breakdown</h3>
          <div className="results-container">
            {questions.map((question, index) => {
              const isCorrect = answers[index] === question.correctAnswer;
              const userAnswer = answers[index] !== null ? question.options[answers[index]] : 'No answer';
              const correctAnswer = question.options[question.correctAnswer];
              
              return (
                <div key={index} className="result-item">
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                      Q{index + 1}: {question.question}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Your answer: {userAnswer}
                    </div>
                    {!isCorrect && (
                      <div style={{ fontSize: '14px', color: '#28a745' }}>
                        Correct: {correctAnswer}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Time: {timeSpent[index]}s
                    </div>
                  </div>
                  <div className={isCorrect ? 'result-correct' : 'result-incorrect'}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={onRestart}>
            🔄 Retry Quiz
          </button>
          <button className="btn btn-secondary" onClick={onNewQuiz}>
            🆕 New Quiz
          </button>
        </div>

        {/* Performance Tips */}
        {score < 80 && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            border: '1px solid #bbdefb'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#1976d2' }}>💡 Tips for Improvement</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1976d2' }}>
              <li>Review the questions you got wrong</li>
              <li>Take your time reading each question carefully</li>
              <li>Practice with different categories</li>
              <li>Don't be afraid to guess when you're unsure</li>
            </ul>
          </div>
        )}

        {/* Leaderboard Stats */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h4 style={{ marginBottom: '1rem', color: '#667eea' }}>📊 Your Stats</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                {leaderboardManager.getLeaderboard().length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Total Quizzes</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                {leaderboardManager.getAverageScore()}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Average Score</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea' }}>
                {personalBest?.score || 0}%
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Best Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 