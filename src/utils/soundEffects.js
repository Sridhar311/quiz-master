class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = localStorage.getItem('quizAppSound') !== 'false';
    this.volume = 0.3;
    this.initSounds();
  }

  initSounds() {
    // Create audio contexts for different sounds
    this.sounds = {
      correct: this.createBeepSound(800, 200, 'sine'),
      incorrect: this.createBeepSound(300, 200, 'sawtooth'),
      click: this.createBeepSound(600, 100, 'sine'),
      timer: this.createBeepSound(400, 150, 'square'),
      complete: this.createBeepSound(523, 300, 'sine'), // C5 note
      start: this.createBeepSound(659, 200, 'sine'), // E5 note
    };
  }

  createBeepSound(frequency, duration, type = 'sine') {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    };
  }

  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('quizAppSound', this.isEnabled);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isSoundEnabled() {
    return this.isEnabled;
  }
}

export const soundManager = new SoundManager(); 