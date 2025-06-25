import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import SoundToggle from './SoundToggle';

const getFirstName = (user) => {
  if (!user) return '';
  if (user.displayName) return user.displayName.split(' ')[0];
  if (user.email) return user.email.split('@')[0];
  return '';
};

const Navbar = ({ onMenuToggle, onNavigate, user, onLogin, onLogout, onShowHistory }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    onMenuToggle && onMenuToggle(!isMobileMenuOpen);
  };

  const handleNavigation = (page) => {
    onNavigate && onNavigate(page);
  };

  const handleSettingsClick = () => {
    setShowSettingsDropdown((prev) => !prev);
  };

  // User dropdown logic
  const handleUserClick = () => {
    setShowUserDropdown((prev) => !prev);
  };
  React.useEffect(() => {
    if (!showUserDropdown) return;
    const handleClick = (e) => {
      if (!e.target.closest('.navbar-user-dropdown') && !e.target.closest('.navbar-user-btn')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserDropdown]);

  // Settings dropdown logic
  React.useEffect(() => {
    if (!showSettingsDropdown) return;
    const handleClick = (e) => {
      if (!e.target.closest('.navbar-settings-dropdown') && !e.target.closest('.navbar-settings-btn')) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSettingsDropdown]);

  const avatarUrl = user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(getFirstName(user) || 'U') + '&background=667eea&color=fff&size=64';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <h1 className="navbar-logo" onClick={() => handleNavigation('home')} style={{ cursor: 'pointer' }}>
            🧠 QuizMaster
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop">
          <button className="navbar-item" onClick={() => handleNavigation('home')}>
            🏠 Home
          </button>
          <button className="navbar-item" onClick={() => handleNavigation('categories')}>
            📚 Categories
          </button>
          <button className="navbar-item" onClick={() => handleNavigation('statistics')}>
            📊 Statistics
          </button>
          <button className="navbar-item" onClick={() => handleNavigation('contact')}>
            📞 Contact
          </button>
          <button className="navbar-item" onClick={() => handleNavigation('settings')}>
            ⚙️ Settings
          </button>
          {/* Auth Controls */}
          <div className="navbar-auth">
            {user ? (
              <div className="navbar-user-btn" onClick={handleUserClick} tabIndex={0} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',position:'relative'}}>
                <img src={avatarUrl} alt="avatar" className="navbar-user-avatar" />
                <span className="navbar-user-name">{getFirstName(user)}</span>
                <span className="navbar-user-caret">▼</span>
                {showUserDropdown && (
                  <div className="navbar-user-dropdown">
                    <div className="navbar-user-dropdown-item" style={{fontWeight:600}}>{user.email}</div>
                    <div className="navbar-user-dropdown-item" onClick={onShowHistory}>Quiz History</div>
                    <div className="navbar-user-dropdown-item" onClick={onLogout}>Logout</div>
                    {user.email === 'admin12@gmail.com' && (
                      <div className="dropdown-item" onClick={() => handleNavigation('admin')}>
                        Admin Panel
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button className="navbar-login-btn" onClick={onLogin}>
                <span role="img" aria-label="user">👤</span> Login
              </button>
            )}
          </div>
          {/* Combined Settings Button */}
          <div className="navbar-controls">
            <button className="navbar-settings-btn" onClick={handleSettingsClick} aria-label="Settings">
              <span role="img" aria-label="settings">🛠️</span>
            </button>
            {showSettingsDropdown && (
              <div className="navbar-settings-dropdown">
                <div className="navbar-settings-row">
                  <SoundToggle />
                  <span className="navbar-settings-label">Sound</span>
                </div>
                <div className="navbar-settings-row">
                  <ThemeToggle />
                  <span className="navbar-settings-label">Theme</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 