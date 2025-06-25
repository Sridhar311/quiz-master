class LeaderboardManager {
  constructor() {
    this.storageKey = 'quizAppLeaderboard';
    this.maxEntries = 10;
  }

  getLeaderboard() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }

  addScore(score) {
    try {
      const leaderboard = this.getLeaderboard();
      
      // Add timestamp and ID to the score
      const scoreEntry = {
        ...score,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };

      // Add to leaderboard
      leaderboard.push(scoreEntry);

      // Sort by score (highest first)
      leaderboard.sort((a, b) => b.score - a.score);

      // Keep only top scores
      const topScores = leaderboard.slice(0, this.maxEntries);

      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(topScores));

      return topScores;
    } catch (error) {
      console.error('Error saving score:', error);
      return this.getLeaderboard();
    }
  }

  getTopScores(limit = 5) {
    const leaderboard = this.getLeaderboard();
    return leaderboard.slice(0, limit);
  }

  getCategoryScores(category) {
    const leaderboard = this.getLeaderboard();
    return leaderboard
      .filter(entry => entry.category === category)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  clearLeaderboard() {
    localStorage.removeItem(this.storageKey);
  }

  getPersonalBest() {
    const leaderboard = this.getLeaderboard();
    return leaderboard.length > 0 ? leaderboard[0] : null;
  }

  getAverageScore() {
    const leaderboard = this.getLeaderboard();
    if (leaderboard.length === 0) return 0;
    
    const total = leaderboard.reduce((sum, entry) => sum + entry.score, 0);
    return Math.round(total / leaderboard.length);
  }
}

export const leaderboardManager = new LeaderboardManager(); 