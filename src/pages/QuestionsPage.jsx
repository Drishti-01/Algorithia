import { Link } from "react-router-dom";
import { QuestionCard } from "../components/QuestionCard";
import { QUESTIONS } from "../data/questions";

export default function QuestionsPage() {
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

            <section className="questions-grid">
                {QUESTIONS.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                ))}
            </section>
        </div>
    );
}