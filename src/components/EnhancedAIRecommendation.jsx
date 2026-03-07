import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function EnhancedAIRecommendation({ analysis, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (analysis) {
            setIsVisible(true);
        }
    }, [analysis]);

    if (!analysis || !isVisible) return null;

    const getStrategyColor = (strategy) => {
        switch (strategy) {
            case 'exploit': return '#ef4444';
            case 'probe': return '#f59e0b';
            case 'support': return '#10b981';
            default: return '#6366f1';
        }
    };

    const getEscalationEmoji = (stage) => {
        const emojis = ['🌱', '🌿', '🌳', '🔥', '⚡'];
        return emojis[stage - 1] || '🎯';
    };

    const getPerformanceColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="enhanced-ai-overlay">
            <div className="enhanced-ai-card">
                <button className="ai-close-btn" onClick={() => setIsVisible(false)}>
                    ×
                </button>

                {/* Header */}
                <div className="ai-header">
                    <span className="ai-icon">🤖</span>
                    <div>
                        <h3>AI Analysis Complete</h3>
                        <p className="ai-subtitle">Performance evaluated with advanced metrics</p>
                    </div>
                </div>

                {/* Main Scores */}
                <div className="ai-scores-grid">
                    <div className="ai-score-card">
                        <div className="score-label">Performance</div>
                        <div className="score-value" style={{ color: getPerformanceColor(analysis.behaviorScore) }}>
                            {analysis.behaviorScore}
                            <span className="score-unit">/100</span>
                        </div>
                        <div className="score-sublabel">{analysis.feedback?.performance}</div>
                    </div>

                    <div className="ai-score-card">
                        <div className="score-label">Escalation</div>
                        <div className="score-value">
                            {getEscalationEmoji(analysis.escalationStage)}
                            <span className="score-unit">Stage {analysis.escalationStage}</span>
                        </div>
                        <div className="score-sublabel">
                            {analysis.escalationStage >= 4 ? 'High Pressure' : 
                             analysis.escalationStage >= 3 ? 'Moderate' : 'Building Up'}
                        </div>
                    </div>

                    <div className="ai-score-card">
                        <div className="score-label">Strategy</div>
                        <div className="score-value" style={{ color: getStrategyColor(analysis.strategy) }}>
                            {analysis.strategy.toUpperCase()}
                        </div>
                        <div className="score-sublabel">
                            {analysis.strategy === 'exploit' ? 'Challenge Mode' :
                             analysis.strategy === 'probe' ? 'Testing Mode' : 'Support Mode'}
                        </div>
                    </div>
                </div>

                {/* Performance Details */}
                {analysis.feedback && (
                    <div className="ai-feedback-section">
                        <div className="feedback-item">
                            <span className="feedback-icon">⏱️</span>
                            <span>{analysis.feedback.timeManagement}</span>
                        </div>
                        <div className="feedback-item">
                            <span className="feedback-icon">📝</span>
                            <span>{analysis.feedback.codeQuality}</span>
                        </div>
                        {analysis.weaknessDetected && analysis.weaknessDetected !== 'none' && (
                            <div className="feedback-item warning">
                                <span className="feedback-icon">⚠️</span>
                                <span>{analysis.feedback.weakness}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Level Progress */}
                {analysis.currentLevel && (
                    <div className="level-progress-section">
                        <div className="level-badge">
                            <span className="level-icon">{analysis.currentLevel.categoryIcon}</span>
                            <div>
                                <div className="level-name">{analysis.currentLevel.levelName}</div>
                                <div className="level-category">{analysis.currentLevel.categoryName}</div>
                            </div>
                        </div>
                        
                        {analysis.shouldProgressLevel && analysis.nextLevel && (
                            <div className="level-up-banner">
                                🎊 Ready for {analysis.nextLevel.name}!
                            </div>
                        )}
                    </div>
                )}

                {/* Trap Info (Collapsible) */}
                <button 
                    className="details-toggle"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? '▼' : '▶'} Advanced Analysis
                </button>

                {showDetails && (
                    <div className="advanced-details">
                        <div className="detail-row">
                            <span className="detail-label">Trap Type:</span>
                            <span className="detail-value">{analysis.trapType}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Pressure Multiplier:</span>
                            <span className="detail-value">{(analysis.pressureMultiplier * 100).toFixed(0)}%</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Time Efficiency:</span>
                            <span className="detail-value">{analysis.timeEfficiency}</span>
                        </div>
                        {analysis.mistakePattern && (
                            <div className="detail-row">
                                <span className="detail-label">Pattern:</span>
                                <span className="detail-value">{analysis.mistakePattern}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Next Question Recommendation */}
                {analysis.nextQuestion && (
                    <div className="next-question-section">
                        <div className="recommendation-label">
                            💡 {analysis.nextQuestion.isLevelUp ? 'Level Up Challenge' : 'Recommended Next'}
                        </div>
                        <div className="next-question-card">
                            <div className="question-info">
                                <h4>{analysis.nextQuestion.title}</h4>
                                <div className="question-meta">
                                    <span className={`difficulty-badge difficulty-${analysis.nextQuestion.difficulty.toLowerCase()}`}>
                                        {analysis.nextQuestion.difficulty}
                                    </span>
                                    <span className="category-badge">
                                        {analysis.nextQuestion.category}
                                    </span>
                                    {analysis.nextQuestion.isLevelUp && (
                                        <span className="levelup-badge">🎊 LEVEL UP</span>
                                    )}
                                </div>
                            </div>
                            <Link 
                                to={`/city/${analysis.nextQuestion.id}`}
                                className="try-now-btn"
                                onClick={() => setIsVisible(false)}
                            >
                                Try Now →
                            </Link>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="ai-footer">
                    <button className="dismiss-btn" onClick={() => setIsVisible(false)}>
                        Continue Practicing
                    </button>
                </div>
            </div>
        </div>
    );
}
