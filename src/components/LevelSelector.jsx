import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTION_LEVELS } from '../data/question-levels';
import { QUESTIONS_BY_ID } from '../data/questions';

export function LevelSelector({ selectedCategory, onCategoryChange }) {
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedLevel, setExpandedLevel] = useState(null);

    const toggleCategory = (category) => {
        if (expandedCategory === category) {
            setExpandedCategory(null);
            setExpandedLevel(null);
        } else {
            setExpandedCategory(category);
            setExpandedLevel(null);
            onCategoryChange(category);
        }
    };

    const toggleLevel = (levelId) => {
        setExpandedLevel(expandedLevel === levelId ? null : levelId);
    };

    return (
        <div className="level-selector">
            <h2 className="level-selector-title">📚 Learning Path</h2>
            <p className="level-selector-subtitle">Choose your district and level</p>

            <div className="categories-container">
                {Object.entries(QUESTION_LEVELS).map(([categoryKey, categoryData]) => {
                    const isExpanded = expandedCategory === categoryKey;
                    
                    return (
                        <div key={categoryKey} className="category-card">
                            <button
                                className={`category-header ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => toggleCategory(categoryKey)}
                            >
                                <span className="category-icon">{categoryData.icon}</span>
                                <span className="category-name">{categoryData.name}</span>
                                <span className="category-arrow">{isExpanded ? '▼' : '▶'}</span>
                            </button>

                            {isExpanded && (
                                <div className="levels-container">
                                    {categoryData.levels.map((level) => {
                                        const isLevelExpanded = expandedLevel === level.id;
                                        
                                        return (
                                            <div key={level.id} className="level-item">
                                                <button
                                                    className={`level-header ${isLevelExpanded ? 'expanded' : ''}`}
                                                    onClick={() => toggleLevel(level.id)}
                                                >
                                                    <div className="level-info">
                                                        <span className="level-name">{level.name}</span>
                                                        <span className={`level-difficulty difficulty-${level.difficulty.toLowerCase()}`}>
                                                            {level.difficulty}
                                                        </span>
                                                    </div>
                                                    <span className="level-arrow">{isLevelExpanded ? '▼' : '▶'}</span>
                                                </button>
                                                
                                                <p className="level-description">{level.description}</p>

                                                {isLevelExpanded && (
                                                    <div className="questions-list">
                                                        {level.questions.map((questionId) => {
                                                            const question = QUESTIONS_BY_ID[questionId];
                                                            if (!question) return null;
                                                            
                                                            return (
                                                                <Link
                                                                    key={questionId}
                                                                    to={`/city/${questionId}`}
                                                                    className="question-link"
                                                                >
                                                                    <div className="question-mini-card">
                                                                        <span className="question-title">{question.title}</span>
                                                                        <span className={`question-badge difficulty-${question.difficulty.toLowerCase()}`}>
                                                                            {question.difficulty}
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
