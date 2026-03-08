/**
 * Performance Analysis Engine
 * Analyzes user performance with detailed metrics
 */

export function analyzePerformance(data) {
    const { timeTaken, incorrectAttempts, questionDifficulty } = data;
    
    // Base score calculation
    let performanceScore = 100;
    
    // Time penalties (adjusted by difficulty)
    const timeThresholds = {
        easy: 30,
        medium: 60,
        hard: 120
    };

    const normalizedDifficulty = typeof questionDifficulty === 'string'
        ? questionDifficulty.trim().toLowerCase()
        : '';
    const threshold = timeThresholds[normalizedDifficulty] ?? timeThresholds.medium;
    if (timeTaken > threshold) {
        const penalty = Math.floor((timeTaken - threshold) / 10) * 2;
        performanceScore -= penalty;
    }
    
    // Attempt penalties
    performanceScore -= incorrectAttempts * 15;
    
    // Bonus for quick completion
    if (timeTaken < threshold / 2 && incorrectAttempts === 0) {
        performanceScore += 10;
    }
    
    // Clamp between 0-100
    performanceScore = Math.max(0, Math.min(100, performanceScore));
    
    // Calculate efficiency rating
    let efficiency = 'excellent';
    if (performanceScore < 40) efficiency = 'needs-improvement';
    else if (performanceScore < 70) efficiency = 'good';
    else if (performanceScore < 90) efficiency = 'very-good';
    
    return {
        performanceScore,
        efficiency,
        timeTaken,
        incorrectAttempts,
        quickCompletion: timeTaken < threshold / 2
    };
}
