import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { QuestionCard } from "../components/QuestionCard";
import { QUESTIONS } from "../data/questions";

export default function QuestionsPage() {
    const [searchParams] = useSearchParams();
    const districtParam = searchParams.get('district');
    
    const [selectedCategory, setSelectedCategory] = useState(districtParam || "all");
    const [expandedLevels, setExpandedLevels] = useState({});
    
    // Auto-expand first level when district is selected
    useEffect(() => {
        if (districtParam && districtParam !== "all") {
            setSelectedCategory(districtParam);
            // Auto-expand Level 1 of the selected district
            setExpandedLevels({ [`${districtParam}-1`]: true });
        }
    }, [districtParam]);
    
    // Group questions by category and level
    const groupedQuestions = {
        array: { 1: [], 2: [], 3: [] },
        linkedlist: { 1: [], 2: [], 3: [] },
        stack: { 1: [], 2: [], 3: [] },
        queue: { 1: [], 2: [], 3: [] }
    };
    
    QUESTIONS.forEach(q => {
        const category = q.category || 'array';
        const level = q.level || 1;
        if (groupedQuestions[category] && groupedQuestions[category][level]) {
            groupedQuestions[category][level].push(q);
        }
    });
    
    const toggleLevel = (category, level) => {
        const key = `${category}-${level}`;
        setExpandedLevels(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    
    const categories = [
        { id: 'array', name: 'Array District', icon: '📊', color: '#3b82f6' },
        { id: 'linkedlist', name: 'LinkedList Harbor', icon: '🔗', color: '#06b6d4' },
        { id: 'stack', name: 'Stack Tower', icon: '📚', color: '#8b5cf6' },
        { id: 'queue', name: 'Queue Lane', icon: '🎫', color: '#10b981' }
    ];
    
    const levelNames = {
        1: { name: 'Level 1: Basics', emoji: '🟢', desc: 'Beginner' },
        2: { name: 'Level 2: Intermediate', emoji: '🟡', desc: 'Intermediate' },
        3: { name: 'Level 3: Advanced', emoji: '🔴', desc: 'Advanced' }
    };

    return (
        <div className="questions-page">
            <header className="questions-header">
                <div>
                    <p className="section-kicker">Question Hub</p>
                    <h1>
                        {selectedCategory === "all" 
                            ? "All Districts" 
                            : categories.find(c => c.id === selectedCategory)?.name || "Select A Challenge"}
                    </h1>
                    <p>
                        {selectedCategory === "all"
                            ? "Choose a district and level, then write code to solve the challenge."
                            : `Explore ${categories.find(c => c.id === selectedCategory)?.name} challenges organized by difficulty levels.`}
                    </p>
                </div>
                <div className="header-actions">
                    <Link to="/districts" className="secondary-btn">← All Districts</Link>
                    <Link to="/" className="secondary-btn">Home</Link>
                </div>
            </header>

            <div className="filter-bar">
                <button 
                    className={selectedCategory === "all" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setSelectedCategory("all")}
                >
                    All Districts
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat.id}
                        className={selectedCategory === cat.id ? "filter-btn active" : "filter-btn"}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            <div className="districts-container">
                {categories
                    .filter(cat => selectedCategory === "all" || selectedCategory === cat.id)
                    .map(category => (
                        <div key={category.id} className="district-section">
                            <div className="district-header" style={{ borderLeftColor: category.color }}>
                                <span className="district-icon">{category.icon}</span>
                                <h2>{category.name}</h2>
                            </div>
                            
                            {[1, 2, 3].map(level => {
                                const questions = groupedQuestions[category.id][level];
                                if (!questions || questions.length === 0) return null;
                                
                                const levelKey = `${category.id}-${level}`;
                                const isExpanded = expandedLevels[levelKey];
                                const levelInfo = levelNames[level];
                                
                                return (
                                    <div key={level} className="level-section">
                                        <button 
                                            className="level-toggle"
                                            onClick={() => toggleLevel(category.id, level)}
                                        >
                                            <div className="level-info">
                                                <span className="level-emoji">{levelInfo.emoji}</span>
                                                <span className="level-name">{levelInfo.name}</span>
                                                <span className="level-count">({questions.length} questions)</span>
                                            </div>
                                            <span className="toggle-arrow">{isExpanded ? '▼' : '▶'}</span>
                                        </button>
                                        
                                        {isExpanded && (
                                            <div className="level-questions">
                                                {questions.map(question => (
                                                    <QuestionCard key={question.id} question={question} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
            </div>
        </div>
    );
}