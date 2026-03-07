import { Link } from "react-router-dom";

export function QuestionCard({ question }) {
    const isLinkedList = question.category === "linkedlist";
    const isStack = question.category === "stack";
    const isQueue = question.category === "queue";
    
    return (
        <article className="question-card">
            <div className="question-meta">
                <span className={`difficulty-tag difficulty-${question.difficulty.toLowerCase()}`}>
                    {question.difficulty}
                </span>
                {isLinkedList && (
                    <span className="category-tag">
                        🔗 Linked List
                    </span>
                )}
                {isStack && (
                    <span className="category-tag category-stack">
                        📚 Stack
                    </span>
                )}
                {isQueue && (
                    <span className="category-tag category-queue">
                        🎫 Queue
                    </span>
                )}
            </div>

            <h3>{question.title}</h3>
            <p>{question.description}</p>

            <div className="question-card-footer">
                <code>
                    {isLinkedList 
                        ? `Nodes: [${question.linkedListData.values.join(", ")}]`
                        : isStack
                        ? `Stack: [${question.stackData.values.join(", ")}]`
                        : isQueue
                        ? `Queue: [${question.queueData.values.join(", ")}]`
                        : `Input: [${question.input.join(", ")}]`
                    }
                </code>
                <Link to={`/city/${question.id}`} className="start-btn">
                    Start
                </Link>
            </div>
        </article>
    );
}