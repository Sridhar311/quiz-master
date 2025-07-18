import React from 'react';
import { soundManager } from '../utils/soundEffects';
import './SoundToggle.css';

const SoundToggle = () => {
  const [isEnabled, setIsEnabled] = React.useState(soundManager.isSoundEnabled());

  const handleToggle = () => {
    soundManager.toggleSound();
    setIsEnabled(soundManager.isSoundEnabled());
    // Play a test sound if enabling
    if (soundManager.isSoundEnabled()) {
      soundManager.play('click');
    }
  };

  return (
    <button 
      className="sound-toggle" 
      onClick={handleToggle}
      aria-label={isEnabled ? 'Disable sound effects' : 'Enable sound effects'}
    >
      {isEnabled ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
    </button>
  );
};

export default SoundToggle; 