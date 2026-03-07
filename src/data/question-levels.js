/**
 * Question Levels and Categories
 * Hierarchical structure for organized learning
 */

export const QUESTION_LEVELS = {
    // ARRAY DISTRICT
    array: {
        name: "Array District",
        icon: "📊",
        levels: [
            {
                id: "array-basics",
                name: "Level 1: Basics",
                description: "Learn array traversal and basic operations",
                difficulty: "Easy",
                questions: ["array-traversal", "find-maximum"]
            },
            {
                id: "array-sorting",
                name: "Level 2: Sorting",
                description: "Master sorting algorithms",
                difficulty: "Medium",
                questions: ["bubble-sort", "selection-sort"]
            },
            {
                id: "array-searching",
                name: "Level 3: Searching",
                description: "Learn search algorithms",
                difficulty: "Medium",
                questions: ["binary-search", "linear-search"]
            }
        ]
    },
    
    // LINKEDLIST HARBOR
    linkedlist: {
        name: "LinkedList Harbor",
        icon: "🔗",
        levels: [
            {
                id: "linkedlist-basics",
                name: "Level 1: Singly Linked List",
                description: "Master basic linked list operations",
                difficulty: "Easy",
                questions: ["linkedlist-traversal", "linkedlist-find-max", "linkedlist-count-nodes"]
            },
            {
                id: "linkedlist-advanced",
                name: "Level 2: Advanced Operations",
                description: "Search and manipulation",
                difficulty: "Medium",
                questions: ["linkedlist-search", "linkedlist-insert"]
            },
            {
                id: "linkedlist-variants",
                name: "Level 3: Variants",
                description: "Doubly and circular linked lists",
                difficulty: "Hard",
                questions: ["doubly-linkedlist-traversal", "circular-linkedlist-traversal"]
            }
        ]
    },
    
    // STACK TOWER
    stack: {
        name: "Stack Tower",
        icon: "📚",
        levels: [
            {
                id: "stack-basics",
                name: "Level 1: Basic Operations",
                description: "Learn push, pop, and peek",
                difficulty: "Easy",
                questions: ["stack-push-pop", "stack-peek"]
            },
            {
                id: "stack-applications",
                name: "Level 2: Applications",
                description: "Use stacks to solve problems",
                difficulty: "Medium",
                questions: ["stack-reverse", "stack-is-empty"]
            }
        ]
    },
    
    // QUEUE LANE
    queue: {
        name: "Queue Lane",
        icon: "🎫",
        levels: [
            {
                id: "queue-basics",
                name: "Level 1: Basic Operations",
                description: "Learn enqueue, dequeue, and peek",
                difficulty: "Easy",
                questions: ["queue-enqueue-dequeue", "queue-peek-front"]
            },
            {
                id: "queue-applications",
                name: "Level 2: Applications",
                description: "Use queues to solve problems",
                difficulty: "Medium",
                questions: ["queue-front-rear", "queue-is-empty"]
            }
        ]
    }
};

// Helper function to get all questions by level
export function getQuestionsByLevel(category, levelId) {
    const categoryData = QUESTION_LEVELS[category];
    if (!categoryData) return [];
    
    const level = categoryData.levels.find(l => l.id === levelId);
    return level ? level.questions : [];
}

// Helper function to get level info for a question
export function getLevelForQuestion(questionId) {
    for (const [category, data] of Object.entries(QUESTION_LEVELS)) {
        for (const level of data.levels) {
            if (level.questions.includes(questionId)) {
                return {
                    category,
                    categoryName: data.name,
                    categoryIcon: data.icon,
                    levelId: level.id,
                    levelName: level.name,
                    levelDescription: level.description,
                    levelDifficulty: level.difficulty
                };
            }
        }
    }
    return null;
}

// Get next level in progression
export function getNextLevel(category, currentLevelId) {
    const categoryData = QUESTION_LEVELS[category];
    if (!categoryData) return null;
    
    const currentIndex = categoryData.levels.findIndex(l => l.id === currentLevelId);
    if (currentIndex === -1 || currentIndex === categoryData.levels.length - 1) {
        return null;
    }
    
    return categoryData.levels[currentIndex + 1];
}
