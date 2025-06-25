import React, { useState, useEffect } from 'react';
import { saveQuizResult } from '../utils/api';

const QuizQuestion = ({ 
  question, 
  onAnswerChange, 
  onNext, 
  onPrev, 
  questionNumber, 
  totalQuestions,
  selectedAnswer,
  onSubmitQuiz,
  elapsedTime
}) => {


  return (
    <div className="container">
      <div className="card">
        {/* Live Timer */}
        {typeof elapsedTime === 'number' && (
          <div style={{ textAlign: 'right', color: '#667eea', fontWeight: 600, fontSize: 18, marginBottom: '0.5rem' }}>
            ⏱️ {String(Math.floor(elapsedTime / 60)).padStart(2, '0')}:{String(elapsedTime % 60).padStart(2, '0')}
          </div>
        )}
        {/* Question Number */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#667eea', fontWeight: '500' }}>
          Question {questionNumber} of {totalQuestions}
        </div>

        {/* Category */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#666', fontSize: '14px' }}>
          Category: {question.category}
        </div>

        {/* Question Text */}
        <div className="question-text">
          {question.question}
        </div>

        {/* Options */}
        <div className="options-grid">
          {question.options.map((option, index) => {
            let optionClass = 'option-btn';
            if (selectedAnswer === index) {
              optionClass += ' selected';
            }
            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => onAnswerChange(index)}
              >
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button className="btn" onClick={onPrev} disabled={questionNumber === 1}>
            Prev
          </button>
          {questionNumber < totalQuestions ? (
            <button className="btn" onClick={onNext}>
              Next
            </button>
          ) : (
            <button className="btn" onClick={onSubmitQuiz}>
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion; 