import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/soundEffects';
import { leaderboardManager } from '../utils/leaderboard';
import './SettingsPage.css';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    soundEnabled: soundManager.isSoundEnabled(),
    volume: 30,
    autoSave: true,
    showTimer: true,
    showProgress: true,
    showExplanations: true,
    difficulty: 'medium',
    questionsPerQuiz: 10,
    timeLimit: 30
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportData, setShowExportData] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('quizAppSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('quizAppSettings', JSON.stringify(newSettings));
    
    // Apply specific settings
    if (key === 'soundEnabled') {
      if (value) {
        soundManager.toggleSound(); // Enable sound
      } else {
        soundManager.toggleSound(); // Disable sound
      }
    }
    
    soundManager.play('click');
  };

  const handleResetData = () => {
    if (showResetConfirm) {
      leaderboardManager.clearLeaderboard();
      localStorage.removeItem('quizAppSettings');
      setSettings({
        soundEnabled: true,
        volume: 30,
        autoSave: true,
        showTimer: true,
        showProgress: true,
        showExplanations: true,
        difficulty: 'medium',
        questionsPerQuiz: 10,
        timeLimit: 30
      });
      setShowResetConfirm(false);
      soundManager.play('click');
    } else {
      setShowResetConfirm(true);
    }
  };

  const handleExportData = () => {
    const data = {
      leaderboard: leaderboardManager.getLeaderboard(),
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-app-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportData(false);
    soundManager.play('click');
  };

  const settingSections = [
    {
      title: 'Appearance',
      icon: '🎨',
      settings: [
        {
          key: 'theme',
          label: 'Dark Mode',
          type: 'toggle',
          value: isDarkMode,
          onChange: toggleTheme,
          description: 'Switch between light and dark themes'
        }
      ]
    },
    {
      title: 'Audio',
      icon: '🔊',
      settings: [
        {
          key: 'soundEnabled',
          label: 'Sound Effects',
          type: 'toggle',
          value: settings.soundEnabled,
          onChange: (value) => updateSetting('soundEnabled', value),
          description: 'Enable or disable sound effects'
        },
        {
          key: 'volume',
          label: 'Volume',
          type: 'range',
          value: settings.volume,
          onChange: (value) => updateSetting('volume', value),
          min: 0,
          max: 100,
          description: 'Adjust sound effect volume'
        }
      ]
    },
    {
      title: 'Quiz Preferences',
      icon: '⚙️',
      settings: [
        {
          key: 'questionsPerQuiz',
          label: 'Questions per Quiz',
          type: 'select',
          value: settings.questionsPerQuiz,
          onChange: (value) => updateSetting('questionsPerQuiz', value),
          options: [5, 10, 15, 20, 25],
          description: 'Number of questions in each quiz'
        },
        {
          key: 'timeLimit',
          label: 'Time Limit (seconds)',
          type: 'select',
          value: settings.timeLimit,
          onChange: (value) => updateSetting('timeLimit', value),
          options: [15, 30, 45, 60, 90, 120],
          description: 'Time limit for each question'
        },
        {
          key: 'difficulty',
          label: 'Default Difficulty',
          type: 'select',
          value: settings.difficulty,
          onChange: (value) => updateSetting('difficulty', value),
          options: ['easy', 'medium', 'hard'],
          description: 'Default difficulty level for quizzes'
        }
      ]
    },
    {
      title: 'Display Options',
      icon: '👁️',
      settings: [
        {
          key: 'showTimer',
          label: 'Show Timer',
          type: 'toggle',
          value: settings.showTimer,
          onChange: (value) => updateSetting('showTimer', value),
          description: 'Display countdown timer during quizzes'
        },
        {
          key: 'showProgress',
          label: 'Show Progress Bar',
          type: 'toggle',
          value: settings.showProgress,
          onChange: (value) => updateSetting('showProgress', value),
          description: 'Display progress bar during quizzes'
        },
        {
          key: 'showExplanations',
          label: 'Show Explanations',
          type: 'toggle',
          value: settings.showExplanations,
          onChange: (value) => updateSetting('showExplanations', value),
          description: 'Show explanations after answering questions'
        }
      ]
    }
  ];

  const renderSetting = (setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={setting.value}
                onChange={(e) => setting.onChange(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        );
      
      case 'range':
        return (
          <div className="setting-control">
            <input
              type="range"
              min={setting.min}
              max={setting.max}
              value={setting.value}
              onChange={(e) => setting.onChange(parseInt(e.target.value))}
              className="range-slider"
            />
            <span className="range-value">{setting.value}%</span>
          </div>
        );
      
      case 'select':
        return (
          <div className="setting-control">
            <select
              value={setting.value}
              onChange={(e) => setting.onChange(e.target.value)}
              className="setting-select"
            >
              {setting.options.map(option => (
                <option key={option} value={option}>
                  {typeof option === 'string' ? option.charAt(0).toUpperCase() + option.slice(1) : option}
                </option>
              ))}
            </select>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h1 className="settings-title">⚙️ Settings</h1>
          <p className="settings-subtitle">
            Customize your quiz experience and manage your preferences
          </p>
        </div>

        <div className="settings-grid">
          {settingSections.map((section, index) => (
            <div key={index} className="settings-section">
              <div className="section-header">
                <span className="section-icon">{section.icon}</span>
                <h2 className="section-title">{section.title}</h2>
              </div>
              
              <div className="settings-list">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="setting-item">
                    <div className="setting-info">
                      <label className="setting-label">{setting.label}</label>
                      <p className="setting-description">{setting.description}</p>
                    </div>
                    {renderSetting(setting)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Data Management */}
        <div className="data-management-section">
          <h2 className="section-title">📊 Data Management</h2>
          
          <div className="data-stats">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{leaderboardManager.getLeaderboard().length}</div>
                <div className="stat-label">Total Quizzes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-value">{leaderboardManager.getPersonalBest()?.score || 0}%</div>
                <div className="stat-label">Best Score</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{leaderboardManager.getAverageScore()}%</div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>
          </div>

          <div className="data-actions">
            <button
              className="action-btn export-btn"
              onClick={() => setShowExportData(true)}
            >
              📤 Export Data
            </button>
            <button
              className="action-btn reset-btn"
              onClick={handleResetData}
            >
              🗑️ Reset All Data
            </button>
          </div>

          {showResetConfirm && (
            <div className="confirm-dialog">
              <p>Are you sure you want to reset all data? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button
                  className="confirm-btn confirm-yes"
                  onClick={handleResetData}
                >
                  Yes, Reset All
                </button>
                <button
                  className="confirm-btn confirm-no"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showExportData && (
            <div className="confirm-dialog">
              <p>Export your quiz data as a JSON file?</p>
              <div className="confirm-actions">
                <button
                  className="confirm-btn confirm-yes"
                  onClick={handleExportData}
                >
                  Export Data
                </button>
                <button
                  className="confirm-btn confirm-no"
                  onClick={() => setShowExportData(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="about-section">
          <h2 className="section-title">ℹ️ About QuizMaster</h2>
          <div className="about-content">
            <div className="about-info">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Features:</strong> Interactive quizzes, leaderboards, themes, sound effects</p>
            </div>
            <div className="about-description">
              <p>
                QuizMaster is an interactive quiz application designed to make learning fun and engaging. 
                Test your knowledge across various categories and track your progress over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 