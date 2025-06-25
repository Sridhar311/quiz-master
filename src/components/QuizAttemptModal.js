import React from 'react';

const QuizAttemptModal = ({ attempt, onClose }) => {
  if (!attempt) return null;
  return (
    <div className="quiz-attempt-modal-overlay" onClick={onClose}>
      <div className="quiz-attempt-modal" onClick={e => e.stopPropagation()}>
        <button className="quiz-attempt-modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>Quiz Attempt Details</h2>
        <div style={{ marginBottom: '1rem', color: '#444' }}>
          <div><strong>Date:</strong> {attempt.date?.toDate ? attempt.date.toDate().toLocaleString() : ''}</div>
          <div><strong>Score:</strong> <span style={{ color: '#667eea', fontWeight: 600 }}>{attempt.score}%</span></div>
          <div><strong>Category:</strong> {attempt.category}</div>
          <div><strong>Difficulty:</strong> {attempt.difficulty}</div>
          <div><strong>Questions:</strong> {attempt.questionCount}</div>
          <div><strong>Total Time:</strong> {attempt.totalTime}s</div>
        </div>
        <h3 style={{ marginBottom: '0.7rem' }}>Question Breakdown</h3>
        <div style={{ maxHeight: '45vh', overflowY: 'auto' }}>
          {attempt.questions && attempt.questions.length > 0 ? (
            attempt.questions.map((q, idx) => {
              const isCorrect = attempt.answers[idx] === q.correctAnswer;
              const userAnswer = attempt.answers[idx] !== null ? q.options[attempt.answers[idx]] : 'No answer';
              const correctAnswer = q.options[q.correctAnswer];
              return (
                <div key={idx} style={{ marginBottom: '1.2rem', padding: '0.7rem', borderRadius: '8px', background: isCorrect ? '#e6f7e6' : '#fbeaea' }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.3rem' }}>Q{idx + 1}: {q.question}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Your answer: {userAnswer}</div>
                  {!isCorrect && <div style={{ fontSize: '14px', color: '#28a745' }}>Correct: {correctAnswer}</div>}
                  <div style={{ fontSize: '12px', color: '#999' }}>Time: {attempt.timeSpent[idx]}s</div>
                </div>
              );
            })
          ) : (
            <div style={{ color: '#888' }}>No question details available for this attempt.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptModal; 