import { useState } from "react";
import { Link } from "react-router-dom";
import { QuestionCard } from "../components/QuestionCard";
import { QUESTIONS } from "../data/questions";

export default function QuestionsPage() {
    const [filter, setFilter] = useState("all");
    
    const filteredQuestions = QUESTIONS.filter((q) => {
        if (filter === "all") return true;
        if (filter === "array") return !q.category || q.category === "array";
        if (filter === "linkedlist") return q.category === "linkedlist";
        if (filter === "stack") return q.category === "stack";
        if (filter === "queue") return q.category === "queue";
        return true;
    });

    return (
        <div className="questions-page">
            <header className="questions-header">
                <div>
                    <p className="section-kicker">Question Hub</p>
                    <h1>Select A Data City Challenge</h1>
                    <p>
                        Choose a district scenario, write code in solve(), and launch a visual simulation.
                    </p>
                </div>
                <Link to="/" className="secondary-btn questions-back-btn">Back To Landing</Link>
            </header>

            <div className="filter-bar">
                <button 
                    className={filter === "all" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setFilter("all")}
                >
                    All Challenges
                </button>
                <button 
                    className={filter === "array" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setFilter("array")}
                >
                    📊 Array District
                </button>
                <button 
                    className={filter === "linkedlist" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setFilter("linkedlist")}
                >
                    🔗 LinkedList Harbor
                </button>
                <button 
                    className={filter === "stack" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setFilter("stack")}
                >
                    📚 Stack Tower
                </button>
                <button 
                    className={filter === "queue" ? "filter-btn active" : "filter-btn"}
                    onClick={() => setFilter("queue")}
                >
                    🎫 Queue Lane
                </button>
            </div>

            <section className="questions-grid">
                {filteredQuestions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                ))}
            </section>
        </div>
    );
}