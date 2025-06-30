import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { soundManager } from './utils/soundEffects';
import QuizStart from './components/QuizStart';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import HomePage from './components/HomePage';
import CategoriesPage from './components/CategoriesPage';
import StatisticsPage from './components/StatisticsPage';
import Leaderboard from './components/Leaderboard';
import ContactPage from './components/ContactPage';
import SettingsPage from './components/SettingsPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { questions } from './data/questions';
import AuthModal from './components/AuthModal';
import { auth } from './firebase';
import QuizHistory from './components/QuizHistory';
import AdminQuestions from './components/AdminQuestions';
import { v4 as uuidv4 } from 'uuid';
import TestPage from './components/TestPage';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'categories', 'statistics', 'start', 'quiz', 'results'
  const [quizConfig, setQuizConfig] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeSpent, setTimeSpent] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Auth state
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Redirect to home if user logs out
  useEffect(() => {
    if (!user && currentView !== 'home') {
      setCurrentView('home');
      setQuizConfig(null);
      setQuizQuestions([]);
      setAnswers([]);
      setTimeSpent([]);
      setCurrentQuestionIndex(0);
      setQuestionStartTime(null);
      setSelectedCategory(null);
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter questions based on category
  const filterQuestions = (category, difficulty, count) => {
    let filtered = questions;
    
    if (category !== 'All Categories') {
      filtered = filtered.filter(q => q.category === category);
    }
    
    // For now, we'll use all questions as "All Difficulties"
    // In a real app, you'd have difficulty levels in your question data
    
    // Shuffle the questions
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    
    // Take the requested number of questions
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const handleStartQuiz = (config) => {
    if (!user) {
      alert('You must be logged in to start a quiz. Please log in or sign up.');
      setAuthModalOpen(true);
      return;
    }
    soundManager.play('start');
    const selectedQuestions = filterQuestions(config.category, config.difficulty, config.questionCount);
    
    if (selectedQuestions.length === 0) {
      alert('No questions available for the selected category. Please try a different category.');
      return;
    }
    
    setQuizConfig(config);
    setQuizQuestions(selectedQuestions);
    setAnswers(new Array(selectedQuestions.length).fill(null));
    setTimeSpent(new Array(selectedQuestions.length).fill(0));
    setCurrentQuestionIndex(0);
    setQuestionStartTime(Date.now());
    setAttemptId(uuidv4());
    setCurrentView('quiz');
    setElapsedTime(0);
  };

  const handleHomeStartQuiz = () => {
    soundManager.play('click');
    setCurrentView('start');
  };

  const handleCategorySelect = (category) => {
    soundManager.play('click');
    setSelectedCategory(category);
    setCurrentView('start');
  };

  const handleNavigation = (page) => {
    soundManager.play('click');
    setCurrentView(page);
    // Reset quiz state when navigating away
    if (page !== 'quiz' && page !== 'results' && page !== 'test') {
      setQuizConfig(null);
      setQuizQuestions([]);
      setAnswers([]);
      setTimeSpent([]);
      setCurrentQuestionIndex(0);
      setQuestionStartTime(null);
      setSelectedCategory(null);
    }
  };

  const handleAnswerChange = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((idx) => Math.min(idx + 1, quizQuestions.length - 1));
    setQuestionStartTime(Date.now());
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((idx) => Math.max(idx - 1, 0));
    setQuestionStartTime(Date.now());
  };

  const handleSubmitQuiz = () => {
    soundManager.play('complete');
    setCurrentView('results');
  };

  const handleTimeUp = () => {
    soundManager.play('timer');
    // If time runs out, mark as no answer and move to next question
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = null;
    setAnswers(newAnswers);

    // Calculate time spent on this question
    const timeSpentOnQuestion = Math.round((Date.now() - questionStartTime) / 1000);
    const newTimeSpent = [...timeSpent];
    newTimeSpent[currentQuestionIndex] = timeSpentOnQuestion;
    setTimeSpent(newTimeSpent);

    // Move to next question or show results
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      soundManager.play('complete');
      setCurrentView('results');
    }
  };

  const handleRestart = () => {
    soundManager.play('click');
    setCurrentQuestionIndex(0);
    setAnswers(new Array(quizQuestions.length).fill(null));
    setTimeSpent(new Array(quizQuestions.length).fill(0));
    setQuestionStartTime(Date.now());
    setCurrentView('quiz');
    setElapsedTime(0);
  };

  const handleNewQuiz = () => {
    soundManager.play('click');
    setCurrentView('home');
    setQuizConfig(null);
    setQuizQuestions([]);
    setAnswers([]);
    setTimeSpent([]);
    setCurrentQuestionIndex(0);
    setQuestionStartTime(null);
    setSelectedCategory(null);
  };

  const handleMenuToggle = (isOpen) => {
    soundManager.play('click');
    setSidebarOpen(isOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Update question start time when question changes
  useEffect(() => {
    if (currentView === 'quiz') {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentView]);

  // Timer effect for live quiz timer
  useEffect(() => {
    let interval = null;
    if (currentView === 'quiz') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => interval && clearInterval(interval);
  }, [currentView]);

  // Add login/logout handlers
  const handleLoginClick = () => {
    setAuthModalOpen(true);
  };
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };
  const handleAuthSuccess = (user) => {
    setUser(user);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <div className="main-content"><HomePage onStartQuiz={handleHomeStartQuiz} /></div>;
      case 'categories':
        return <div className="main-content"><CategoriesPage onSelectCategory={handleCategorySelect} /></div>;
      case 'statistics':
        return <div className="main-content"><StatisticsPage user={user} /></div>;
      case 'leaderboard':
        return <div className="main-content"><Leaderboard /></div>;
      case 'contact':
        return <ContactPage />;
      case 'settings':
        return <SettingsPage />;
      case 'start':
        return <div className="main-content"><QuizStart onStartQuiz={handleStartQuiz} selectedCategory={selectedCategory} /></div>;
      case 'quiz':
        if (quizQuestions.length === 0) {
          return <div className="main-content">Loading...</div>;
        }
        return (
          <div className="main-content">
            <QuizQuestion
              question={quizQuestions[currentQuestionIndex]}
              onAnswerChange={handleAnswerChange}
              onNext={handleNext}
              onPrev={handlePrev}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizQuestions.length}
              selectedAnswer={answers[currentQuestionIndex]}
              onSubmitQuiz={handleSubmitQuiz}
              elapsedTime={elapsedTime}
            />
          </div>
        );
      case 'results':
        return (
          <div className="main-content">
            <QuizResults
              results={{
                answers,
                questions: quizQuestions,
                timeSpent,
                totalTime: elapsedTime
              }}
              quizConfig={quizConfig}
              onRestart={handleRestart}
              onNewQuiz={handleNewQuiz}
              user={user}
              attemptId={attemptId}
            />
          </div>
        );
      case 'history':
        return <div className="main-content"><QuizHistory user={user} /></div>;
      case 'admin':
        return <div className="main-content"><AdminQuestions user={user} /></div>;
      case 'test':
        return <div className="main-content"><TestPage user={user} questionCount={10} /></div>;
      default:
        return <div className="main-content"><HomePage onStartQuiz={handleHomeStartQuiz} /></div>;
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Navbar
          onNavigate={handleNavigation}
          onMenuToggle={handleMenuToggle}
          user={user}
          onLogin={handleLoginClick}
          onLogout={handleLogout}
          onShowHistory={() => handleNavigation('history')}
        />
        {windowWidth < 900 && (
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} onNavigate={handleNavigation} />
        )}
        {renderCurrentView()}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </ThemeProvider>
  );
}

export default App; 