import React, { useState, useEffect } from 'react';
import { login, register, loginWithGoogle } from '../utils/api';
import './AuthModal.css';

const GOOGLE_CLIENT_ID = '466249058294-8vomsq4v0mde9ntvn55o79fm1cbs60hd.apps.googleusercontent.com'; // 

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Load Google Identity Services script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }

    function initializeGoogleSignIn() {
      if (!window.google || !document.getElementById('google-signin-btn')) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const user = await loginWithGoogle(response.credential);
            onAuthSuccess(user);
            onClose();
          } catch (err) {
            setError('Google login failed.');
          }
        }
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' }
      );
    }
    // Cleanup: remove button on close
    return () => {
      const btn = document.getElementById('google-signin-btn');
      if (btn) btn.innerHTML = '';
    };
  }, [isOpen, onAuthSuccess, onClose]);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let user;
      if (isSignup) {
        await register(name, email, password);
        user = await login(email, password);
      } else {
        user = await login(email, password);
      }
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-modal-2col-overlay">
      <div className="auth-modal-2col">
        {/* Left illustration */}
        <div className="auth-modal-illustration">
          {/* Simple SVG geometric illustration */}
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
            <rect x="40" y="40" width="120" height="120" rx="24" fill="url(#grad1)"/>
            <rect x="200" y="80" width="80" height="80" rx="18" fill="url(#grad2)"/>
            <rect x="120" y="200" width="160" height="80" rx="20" fill="url(#grad3)"/>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#667eea"/>
                <stop offset="100%" stopColor="#43e97b"/>
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#43e97b"/>
                <stop offset="100%" stopColor="#38f9d7"/>
              </linearGradient>
              <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#764ba2"/>
                <stop offset="100%" stopColor="#667eea"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Right form */}
        <div className="auth-modal-formcol">
          <button className="auth-close" onClick={onClose}>&times;</button>
          <div className="auth-modal-brand">
            <span className="auth-modal-logo">🧠</span>
            <span className="auth-modal-appname">QuizMaster</span>
          </div>
          <h2 className="auth-modal-welcome">Welcome<br/>to QuizMaster</h2>
          <form onSubmit={handleAuth} className="auth-form-2col">
            {isSignup && (
              <div className="auth-input-group">
                <span className="auth-input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <div className="auth-input-group">
              <span className="auth-input-icon">📧</span>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="auth-input-group">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="auth-form-row">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Remember Me
              </label>
              <button type="button" className="auth-forgot" tabIndex={-1} disabled>Forgot Password?</button>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-btn-2col" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
            </button>
          </form>
          <div className="auth-divider-2col">Or</div>
          <div id="google-signin-btn" style={{ margin: '16px 0' }}></div>
          <div className="auth-switch-2col">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={() => setIsSignup(s => !s)} disabled={loading}>
              {isSignup ? 'Login' : 'Create here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 