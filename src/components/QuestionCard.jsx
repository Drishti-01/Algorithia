import { Link } from "react-router-dom";

export function QuestionCard({ question }) {
    return (
        <article className="question-card">
            <div className="question-meta">
                <span className={`difficulty-tag difficulty-${question.difficulty.toLowerCase()}`}>
                    {question.difficulty}
                </span>
            </div>

            <h3>{question.title}</h3>
            <p>{question.description}</p>

            <div className="question-card-footer">
                <code>Input: [{question.input.join(", ")}]</code>
                <Link to={`/city/${question.id}`} className="start-btn">
                    Start
                </Link>
            </div>
        </article>
    );
}