/**
 * Enhanced Behavior Engine
 * Advanced performance analysis with pattern detection
 */

export function analyzeEnhancedBehavior(data) {
    const { 
        timeTaken, 
        incorrectAttempts, 
        questionDifficulty,
        previousAttempts = [],
        codeLength = 0,
        variablesUsed = 0
    } = data;
    
    // Base behavior score
    let behaviorScore = 100;
    
    // Time penalty (more sophisticated)
    const expectedTime = {
        'Easy': 30,
        'Medium': 60,
        'Hard': 90
    };
    
    const expected = expectedTime[questionDifficulty] || 60;
    if (timeTaken > expected) {
        const overtime = timeTaken - expected;
        behaviorScore -= Math.min(30, Math.floor(overtime / 10) * 2);
    }
    
    // Incorrect attempts penalty (escalating)
    if (incorrectAttempts > 0) {
        behaviorScore -= Math.min(40, incorrectAttempts * 12);
    }
    
    // Pattern detection: repeated mistakes
    const mistakePattern = detectMistakePattern(previousAttempts);
    if (mistakePattern.isRepeating) {
        behaviorScore -= 15;
    }
    
    // Code efficiency bonus/penalty
    const efficiencyScore = analyzeCodeEfficiency(codeLength, variablesUsed, questionDifficulty);
    behaviorScore += efficiencyScore;
    
    // Clamp between 0-100
    behaviorScore = Math.max(0, Math.min(100, behaviorScore));
    
    return {
        behaviorScore,
        timeEfficiency: calculateTimeEfficiency(timeTaken, expected),
        mistakePattern: mistakePattern.type,
        codeEfficiency: efficiencyScore,
        weaknessDetected: identifyWeakness(timeTaken, incorrectAttempts, mistakePattern)
    };
}

function detectMistakePattern(previousAttempts) {
    if (previousAttempts.length < 2) {
        return { isRepeating: false, type: 'none' };
    }
    
    // Check for same error types
    const errorTypes = previousAttempts.map(a => a.errorType);
    const uniqueErrors = new Set(errorTypes);
    
    if (uniqueErrors.size === 1 && errorTypes.length > 2) {
        return { isRepeating: true, type: 'same-error' };
    }
    
    if (previousAttempts.length > 3) {
        return { isRepeating: true, type: 'struggling' };
    }
    
    return { isRepeating: false, type: 'learning' };
}

function analyzeCodeEfficiency(codeLength, variablesUsed, difficulty) {
    // Optimal code length ranges
    const optimalLength = {
        'Easy': { min: 3, max: 8 },
        'Medium': { min: 5, max: 15 },
        'Hard': { min: 8, max: 20 }
    };
    
    const range = optimalLength[difficulty] || optimalLength['Medium'];
    
    if (codeLength >= range.min && codeLength <= range.max) {
        return 5; // Bonus for optimal code
    } else if (codeLength > range.max * 2) {
        return -5; // Penalty for overly complex code
    }
    
    return 0;
}

function calculateTimeEfficiency(actual, expected) {
    const ratio = actual / expected;
    if (ratio <= 0.5) return 'excellent';
    if (ratio <= 1.0) return 'good';
    if (ratio <= 1.5) return 'acceptable';
    return 'slow';
}

function identifyWeakness(timeTaken, incorrectAttempts, mistakePattern) {
    if (incorrectAttempts > 3) return 'logic-errors';
    if (mistakePattern.isRepeating) return 'pattern-recognition';
    if (timeTaken > 120) return 'time-pressure';
    return 'none';
}
