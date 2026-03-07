import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { QuestionCard } from "../components/QuestionCard";
import { QUESTIONS } from "../data/questions";

export default function QuestionsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const districtParam = searchParams.get("district");

    const normalizeDistrict = (value) => {
        const normalized = (value || "all").toLowerCase();
        const aliases = {
            arrays: "array",
            linkedlist: "linkedbridge",
            stacks: "stack",
            queues: "queue",
        };
        return aliases[normalized] || normalized;
    };

    const [selectedCategory, setSelectedCategory] = useState(normalizeDistrict(districtParam));
    const [expandedLevels, setExpandedLevels] = useState({});

    useEffect(() => {
        if (districtParam) {
            const normalized = normalizeDistrict(districtParam);
            setSelectedCategory(normalized);
            if (normalized !== "all") {
                setExpandedLevels({ [`${normalized}-1`]: true });
            }
        }
    }, [districtParam]);

    const groupedQuestions = {
        array: { 1: [], 2: [], 3: [] },
        linkedlist: { 1: [], 2: [], 3: [] },
        stack: { 1: [], 2: [], 3: [] },
        queue: { 1: [], 2: [], 3: [] },
    };

    QUESTIONS.forEach((q) => {
        const category = q.category || "array";
        const level = q.level || 1;
        if (groupedQuestions[category] && groupedQuestions[category][level]) {
            groupedQuestions[category][level].push(q);
        }
    });

    const toggleLevel = (category, level) => {
        const key = `${category}-${level}`;
        setExpandedLevels((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));
    };

    const categories = [
        { id: "array", name: "Array District", icon: "", questionCategory: "array" },
        { id: "linkedbridge", name: "Linked Bridge", icon: "", questionCategory: "linkedlist" },
        { id: "stack", name: "Stack Tower", icon: "", questionCategory: "stack" },
        { id: "queue", name: "Queue Factory", icon: "", questionCategory: "queue" },
        { id: "trees", name: "Tree Gardens", icon: "", questionCategory: null },
        { id: "graphs", name: "Graph Nexus", icon: "", questionCategory: null },
        { id: "hashmaps", name: "Hash Bazaar", icon: "", questionCategory: null },
        { id: "heaps", name: "Heap Citadel", icon: "", questionCategory: null },
    ];

    const questionDistricts = [
        { id: "array", questionCategory: "array" },
        { id: "linkedbridge", questionCategory: "linkedlist" },
        { id: "stack", questionCategory: "stack" },
        { id: "queue", questionCategory: "queue" },
    ];

    const levelNames = {
        1: { name: "LEVEL I - TRAINING GROUNDS", emoji: "I", desc: "Beginner" },
        2: { name: "LEVEL II - WAR COLLEGE", emoji: "II", desc: "Intermediate" },
        3: { name: "LEVEL III - SIEGE TRIALS", emoji: "III", desc: "Advanced" },
    };

    const selectedFilter = categories.find((cat) => cat.id === selectedCategory);
    const selectedQuestionCategory = selectedFilter?.questionCategory ?? null;
    const shouldShowAll = selectedCategory === "all" || !selectedQuestionCategory;
    const visibleDistricts = shouldShowAll
        ? questionDistricts
        : questionDistricts.filter((d) => d.questionCategory === selectedQuestionCategory);

    return (
        <div className="questions-page dq-page">
            <div className="dq-vignette" aria-hidden="true" />
            <div className="dq-particles" aria-hidden="true" />

            <div className="dq-content-shell">
                <header className="questions-header dq-header">
                    <div className="dq-title-block">
                        <p className="section-kicker">Data City</p>
                        <p className="dq-subtitle">District Challenges</p>
                    </div>
                    <div className="header-actions dq-header-actions">
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => navigate("/map")}
                        >
                            {"<-"} District Map
                        </button>
                        <Link to="/" className="secondary-btn">Home</Link>
                    </div>
                </header>

                <div className="filter-bar dq-filter-bar">
                    <button
                        className={selectedCategory === "all" ? "filter-btn all-districts-btn active" : "filter-btn all-districts-btn"}
                        onClick={() => setSelectedCategory("all")}
                    >
                        All Districts
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={selectedCategory === cat.id ? "filter-btn active" : "filter-btn"}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                        </button>
                    ))}
                </div>

                <div className="districts-container dq-container">
                    {visibleDistricts.map((district) => (
                        <div key={district.id} className="district-section">
                            {[1, 2, 3].map((level) => {
                                const questions = groupedQuestions[district.questionCategory][level];
                                if (!questions || questions.length === 0) {
                                    return null;
                                }

                                const levelKey = `${district.id}-${level}`;
                                const isExpanded = expandedLevels[levelKey];
                                const levelInfo = levelNames[level];

                                return (
                                    <div key={level} className="level-section">
                                        <button
                                            className="level-toggle"
                                            onClick={() => toggleLevel(district.id, level)}
                                        >
                                            <div className="level-info">
                                                <span className="level-emoji">{levelInfo.emoji}</span>
                                                <span className="level-name">{levelInfo.name}</span>
                                                <span className="level-count">({questions.length} challenges)</span>
                                            </div>
                                            <span className="toggle-arrow">{isExpanded ? "▼" : "▶"}</span>
                                        </button>

                                        {isExpanded && (
                                            <div className="level-questions">
                                                {questions.map((question) => (
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
        </div>
    );
}
