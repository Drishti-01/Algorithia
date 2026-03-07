import { Link } from "react-router-dom";

export function QuestionCard({ question }) {
    const isLinkedList = question.category === "linkedlist";
    const isStack = question.category === "stack";
    const isQueue = question.category === "queue";
    
    const levelColors = {
        1: '#10b981', // green
        2: '#f59e0b', // orange
        3: '#ef4444'  // red
    };
    
    const levelLabels = {
        1: 'Beginner',
        2: 'Intermediate',
        3: 'Advanced'
    };
    
    return (
        <article className="question-card">
            <div className="question-meta">
                <span className={`difficulty-tag difficulty-${question.difficulty.toLowerCase()}`}>
                    {question.difficulty}
                </span>
                {question.level && (
                    <span 
                        className="level-tag" 
                        style={{ 
                            background: `${levelColors[question.level]}22`,
                            border: `1px solid ${levelColors[question.level]}66`,
                            color: levelColors[question.level],
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}
                    >
                        L{question.level} • {levelLabels[question.level]}
                    </span>
                )}
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
            
            {question.group && (
                <div style={{ 
                    fontSize: '12px', 
                    color: '#94a3b8', 
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                }}>
                    📚 {question.group}
                </div>
            )}

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