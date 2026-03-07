import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function AIRecommendation({ analysis, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (analysis) {
            setIsVisible(true);
        }
    }, [analysis]);

    if (!analysis || !isVisible) return null;

    const getStrategyColor = (strategy) => {
        switch (strategy) {
            case 'exploit': return '#ef4444'; // red
            case 'probe': return '#f59e0b'; // orange
            case 'support': return '#10b981'; // green
            default: return '#6366f1';
        }
    };

    const getStrategyEmoji = (strategy) => {
        switch (strategy) {
            case 'exploit': return '🎯';
            case 'probe': return '🔍';
            case 'support': return '💪';
            default: return '🤖';
        }
    };

    const getStrategyText = (strategy) => {
        switch (strategy) {
            case 'exploit': return 'Challenge Mode - Time to push harder!';
            case 'probe': return 'Testing Mode - Let\'s explore your limits';
            case 'support': return 'Growth Mode - Building on your strengths';
            default: return 'Analysis Complete';
        }
    };

    return (
        <div className="ai-recommendation-overlay">
            <div className="ai-recommendation-card">
                <button className="ai-close-btn" onClick={() => setIsVisible(false)}>
                    ×
                </button>

                <div className="ai-header">
                    <span className="ai-icon">🤖</span>
                    <h3>AI Analysis Complete</h3>
                </div>

                <div className="ai-score-section">
                    <div className="ai-score-item">
                        <div className="ai-score-label">Performance Score</div>
                        <div className="ai-score-value" style={{ color: analysis.behaviorScore >= 70 ? '#10b981' : analysis.behaviorScore >= 40 ? '#f59e0b' : '#ef4444' }}>
                            {analysis.behaviorScore}/100
                        </div>
                    </div>
                    <div className="ai-score-item">
                        <div className="ai-score-label">Strategy</div>
                        <div className="ai-score-value" style={{ color: getStrategyColor(analysis.strategy) }}>
                            {getStrategyEmoji(analysis.strategy)} {analysis.strategy.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="ai-strategy-message" style={{ borderLeftColor: getStrategyColor(analysis.strategy) }}>
                    {getStrategyText(analysis.strategy)}
                </div>

                {analysis.nextQuestion && (
                    <div className="ai-recommendation-section">
                        <div className="ai-recommendation-label">
                            💡 Recommended Next Challenge
                        </div>
                        <div className="ai-next-question">
                            <div className="ai-question-info">
                                <h4>{analysis.nextQuestion.title}</h4>
                                <div className="ai-question-meta">
                                    <span className={`difficulty-badge difficulty-${analysis.nextQuestion.difficulty.toLowerCase()}`}>
                                        {analysis.nextQuestion.difficulty}
                                    </span>
                                    <span className="category-badge">
                                        {analysis.nextQuestion.category}
                                    </span>
                                </div>
                            </div>
                            <Link 
                                to={`/city/${analysis.nextQuestion.id}`} 
                                className="ai-try-btn"
                                onClick={() => setIsVisible(false)}
                            >
                                Try Now →
                            </Link>
                        </div>
                    </div>
                )}

                <div className="ai-footer">
                    <button className="ai-dismiss-btn" onClick={() => setIsVisible(false)}>
                        Continue Practicing
                    </button>
                </div>
            </div>
        </div>
    );
}
