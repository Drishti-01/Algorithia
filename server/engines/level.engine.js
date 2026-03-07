/**
 * Level Progression Engine
 * Manages user level and progression
 */

export function calculateLevelProgression(data) {
    const { 
        currentLevel, 
        currentXP, 
        performanceScore, 
        questionDifficulty,
        completedQuestions 
    } = data;
    
    // XP rewards based on difficulty and performance
    const baseXP = {
        'Easy': 10,
        'Medium': 25,
        'Hard': 50
    };
    
    const xpEarned = Math.floor(
        (baseXP[questionDifficulty] || 10) * (performanceScore / 100)
    );
    
    const newXP = currentXP + xpEarned;
    
    // Level thresholds (exponential growth)
    const xpForNextLevel = 100 * Math.pow(1.5, currentLevel - 1);
    
    let newLevel = currentLevel;
    let remainingXP = newXP;
    
    // Check for level up
    if (newXP >= xpForNextLevel) {
        newLevel = currentLevel + 1;
        remainingXP = newXP - xpForNextLevel;
    }
    
    // Calculate mastery level
    const masteryPercentage = Math.min(100, (completedQuestions / 40) * 100);
    let masteryLevel = 'beginner';
    if (masteryPercentage >= 80) masteryLevel = 'expert';
    else if (masteryPercentage >= 60) masteryLevel = 'advanced';
    else if (masteryPercentage >= 40) masteryLevel = 'intermediate';
    else if (masteryPercentage >= 20) masteryLevel = 'novice';
    
    return {
        currentLevel: newLevel,
        currentXP: remainingXP,
        xpEarned,
        xpForNextLevel: 100 * Math.pow(1.5, newLevel - 1),
        leveledUp: newLevel > currentLevel,
        masteryLevel,
        masteryPercentage: Math.floor(masteryPercentage)
    };
}
