import { Link } from "react-router-dom";

export default function DistrictSelectionPage() {
    const districts = [
        {
            id: 'array',
            name: 'Array District',
            icon: '📊',
            color: '#3b82f6',
            description: 'Master array operations, sorting, and searching algorithms',
            levels: 3,
            totalQuestions: 4
        },
        {
            id: 'linkedlist',
            name: 'LinkedList Harbor',
            icon: '🔗',
            color: '#06b6d4',
            description: 'Learn linked list traversal, manipulation, and variants',
            levels: 3,
            totalQuestions: 6
        },
        {
            id: 'stack',
            name: 'Stack Tower',
            icon: '📚',
            color: '#8b5cf6',
            description: 'Understand LIFO operations and stack applications',
            levels: 2,
            totalQuestions: 4
        },
        {
            id: 'queue',
            name: 'Queue Lane',
            icon: '🎫',
            color: '#10b981',
            description: 'Explore FIFO operations and queue implementations',
            levels: 2,
            totalQuestions: 4
        }
    ];

    return (
        <div className="district-selection-page">
            <header className="district-selection-header">
                <div className="header-content">
                    <p className="section-kicker">Data City</p>
                    <h1>Choose Your District</h1>
                    <p className="header-description">
                        Select a data structure district to begin your learning journey.
                        Each district contains multiple levels with increasing difficulty.
                    </p>
                </div>
            </header>

            <div className="districts-grid">
                {districts.map(district => (
                    <Link
                        key={district.id}
                        to={`/questions?district=${district.id}`}
                        className="district-card-link"
                    >
                        <div 
                            className="district-card-large"
                            style={{ borderLeftColor: district.color }}
                        >
                            <div className="district-card-icon" style={{ color: district.color }}>
                                {district.icon}
                            </div>
                            <h2 className="district-card-title">{district.name}</h2>
                            <p className="district-card-description">{district.description}</p>
                            <div className="district-card-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{district.levels}</span>
                                    <span className="stat-label">Levels</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{district.totalQuestions}</span>
                                    <span className="stat-label">Questions</span>
                                </div>
                            </div>
                            <div className="district-card-arrow">
                                Enter District →
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="back-link-container">
                <Link to="/" className="secondary-btn">
                    ← Back to Landing
                </Link>
            </div>
        </div>
    );
}
