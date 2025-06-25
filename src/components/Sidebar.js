import React from 'react';

const Sidebar = ({ isOpen, onClose, onNavigate }) => {
  const handleNavigation = (page) => {
    onNavigate && onNavigate(page);
    onClose();
  };

  const menuItems = [
    { icon: '🏠', label: 'Home', page: 'home' },
    { icon: '📚', label: 'Categories', page: 'categories' },
    { icon: '📊', label: 'Statistics', page: 'statistics' },
    { icon: '🏆', label: 'Leaderboard', page: 'leaderboard' },
    { icon: '📞', label: 'Contact', page: 'contact' },
    { icon: '⚙️', label: 'Settings', page: 'settings' }
  ];

  const categoryItems = [
    { icon: '🔬', label: 'Science', page: 'categories' },
    { icon: '📖', label: 'History', page: 'categories' },
    { icon: '🌍', label: 'Geography', page: 'categories' },
    { icon: '💻', label: 'Technology', page: 'categories' },
    { icon: '⚽', label: 'Sports', page: 'categories' },
    { icon: '📖', label: 'Literature', page: 'categories' }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🧠 QuizMaster</h2>
          <button className="sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3>Main Menu</h3>
            <div className="sidebar-menu">
              {menuItems.map((item, index) => (
                <button 
                  key={index} 
                  className="sidebar-item"
                  onClick={() => handleNavigation(item.page)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Categories</h3>
            <div className="sidebar-menu">
              {categoryItems.map((item, index) => (
                <button 
                  key={index} 
                  className="sidebar-item"
                  onClick={() => handleNavigation(item.page)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">Guest User</div>
              <div className="user-status">Level 1</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 