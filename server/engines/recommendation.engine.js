/**
 * Smart Recommendation Engine
 * Recommends next questions based on performance, level, and learning path
 */

export function recommendNextQuestions(data) {
    const {
        questionId,
        questionCategory,
        questionDifficulty,
        performanceScore,
        currentLevel,
        completedQuestions,
        weakCategories,
        allQuestions
    } = data;
    
    // Filter available questions
    const available = allQuestions.filter(q => 
        q.id !== questionId && !completedQuestions.includes(q.id)
    );
    
    if (available.length === 0) {
        return {
            primary: null,
            alternatives: [],
            reason: 'All questions completed!'
        };
    }
    
    // Determine target difficulty
    let targetDifficulty;
    if (performanceScore >= 85) {
        // Excellent performance - challenge them
        targetDifficulty = questionDifficulty === 'Easy' ? 'Medium' : 'Hard';
    } else if (performanceScore >= 60) {
        // Good performance - same level or slightly harder
        targetDifficulty = questionDifficulty;
    } else {
        // Struggling - easier or same level
        targetDifficulty = questionDifficulty === 'Hard' ? 'Medium' : 
                          questionDifficulty === 'Medium' ? 'Easy' : 'Easy';
    }
    
    // Scoring system for recommendations
    const scored = available.map(q => {
        let score = 0;
        
        // Difficulty match
        if (q.difficulty === targetDifficulty) score += 40;
        else if (Math.abs(getDifficultyValue(q.difficulty) - getDifficultyValue(targetDifficulty)) === 1) {
            score += 20;
        }
        
        // Category diversity (explore different categories)
        if (q.category !== questionCategory) score += 15;
        
        // Weak category focus
        if (weakCategories && weakCategories.includes(q.category)) score += 25;
        
        // Level appropriateness
        if (q.level && q.level <= currentLevel + 1) score += 10;
        
        // Group progression (same group questions)
        if (q.group === getQuestionGroup(questionId)) score += 20;
        
        return { question: q, score };
    });
    
    // Sort by score
    scored.sort((a, b) => b.score - a.score);
    
    // Get top recommendations
    const primary = scored[0]?.question || null;
    const alternatives = scored.slice(1, 4).map(s => s.question);
    
    // Generate reason
    let reason = '';
    if (performanceScore >= 85) {
        reason = 'Excellent work! Ready for a bigger challenge.';
    } else if (performanceScore >= 60) {
        reason = 'Good progress! Continue building your skills.';
    } else {
        reason = 'Let\'s strengthen fundamentals with practice.';
    }
    
    return {
        primary,
        alternatives,
        reason,
        targetDifficulty
    };
}

function getDifficultyValue(difficulty) {
    const map = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return map[difficulty] || 2;
}

function getQuestionGroup(questionId) {
    // Extract group from question ID (e.g., "array-traversal" -> "array")
    return questionId.split('-')[0];
}
