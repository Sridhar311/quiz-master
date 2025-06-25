import React from 'react';

const CategoriesPage = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      description: 'Explore the wonders of physics, chemistry, and biology',
      questionCount: 85,
      difficulty: 'Medium',
      color: '#667eea'
    },
    {
      id: 'history',
      name: 'History',
      icon: '📖',
      description: 'Journey through time with historical events and figures',
      questionCount: 72,
      difficulty: 'Medium',
      color: '#764ba2'
    },
    {
      id: 'geography',
      name: 'Geography',
      icon: '🌍',
      description: 'Discover countries, capitals, and world geography',
      questionCount: 68,
      difficulty: 'Easy',
      color: '#f093fb'
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: '💻',
      description: 'Test your knowledge of computers and modern tech',
      questionCount: 95,
      difficulty: 'Hard',
      color: '#4facfe'
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '⚽',
      description: 'From football to Olympics, test your sports knowledge',
      questionCount: 58,
      difficulty: 'Easy',
      color: '#43e97b'
    },
    {
      id: 'literature',
      name: 'Literature',
      icon: '📚',
      description: 'Classic books, authors, and literary masterpieces',
      questionCount: 63,
      difficulty: 'Medium',
      color: '#fa709a'
    },
    {
      id: 'movies',
      name: 'Movies & TV',
      icon: '🎬',
      description: 'Hollywood classics, actors, and famous films',
      questionCount: 77,
      difficulty: 'Easy',
      color: '#ff9a9e'
    },
    {
      id: 'music',
      name: 'Music',
      icon: '🎵',
      description: 'Musicians, songs, and music history',
      questionCount: 65,
      difficulty: 'Medium',
      color: '#a8edea'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Hard': return '#f44336';
      default: return '#666';
    }
  };

  const handleCategoryClick = (category) => {
    onSelectCategory(category);
  };

  return (
    <div className="categories-container">
      <div className="categories-content">
        <div className="categories-header">
          <h1 className="categories-title">📚 Quiz Categories</h1>
          <p className="categories-subtitle">Choose your favorite topic and start learning</p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
              style={{ '--category-color': category.color }}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-info">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <div className="category-stats">
                  <span className="category-questions">{category.questionCount} questions</span>
                  <span 
                    className="category-difficulty"
                    style={{ color: getDifficultyColor(category.difficulty) }}
                  >
                    {category.difficulty}
                  </span>
                </div>
              </div>
              <div className="category-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="categories-footer">
          <p className="categories-note">
            💡 Tip: Start with easier categories and work your way up to more challenging ones!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage; 