/**
 * Trap Escalation Engine
 * Dynamically adjusts difficulty and sets intelligent traps
 */

import { getLevelForQuestion, getNextLevel } from '../data/question-levels';

export function calculateTrapEscalation(data) {
    const {
        behaviorScore,
        exploitabilityScore,
        questionId,
        questionCategory,
        questionDifficulty,
        consecutiveSuccesses = 0,
        consecutiveFailures = 0,
        weaknessDetected = 'none'
    } = data;
    
    // Determine escalation stage (1-5)
    let escalationStage = 1;
    
    if (exploitabilityScore >= 80) escalationStage = 5; // Maximum pressure
    else if (exploitabilityScore >= 60) escalationStage = 4; // High pressure
    else if (exploitabilityScore >= 40) escalationStage = 3; // Moderate pressure
    else if (exploitabilityScore >= 20) escalationStage = 2; // Light pressure
    else escalationStage = 1; // Support mode
    
    // Adjust based on consecutive performance
    if (consecutiveSuccesses >= 3) {
        escalationStage = Math.min(5, escalationStage + 1);
    }
    if (consecutiveFailures >= 2) {
        escalationStage = Math.max(1, escalationStage - 1);
    }
    
    // Calculate pressure multiplier
    const pressureMultiplier = escalationStage * 0.2; // 0.2 to 1.0
    
    // Determine trap type based on weakness
    const trapType = selectTrapType(weaknessDetected, escalationStage);
    
    // Get level progression info
    const levelInfo = getLevelForQuestion(questionId);
    const shouldProgressLevel = shouldMoveToNextLevel(
        behaviorScore,
        consecutiveSuccesses,
        levelInfo
    );
    
    return {
        escalationStage,
        pressureMultiplier,
        trapType,
        targetWeakness: weaknessDetected,
        shouldProgressLevel,
        levelInfo,
        recommendation: generateRecommendation(
            escalationStage,
            trapType,
            weaknessDetected,
            shouldProgressLevel
        )
    };
}

function selectTrapType(weakness, stage) {
    const traps = {
        'logic-errors': [
            'edge-case-trap',
            'boundary-condition-trap',
            'off-by-one-trap',
            'null-check-trap',
            'overflow-trap'
        ],
        'pattern-recognition': [
            'pattern-variation-trap',
            'similar-but-different-trap',
            'reverse-logic-trap',
            'nested-structure-trap'
        ],
        'time-pressure': [
            'complexity-trap',
            'optimization-trap',
            'efficiency-trap',
            'algorithm-choice-trap'
        ],
        'none': [
            'progressive-difficulty-trap',
            'skill-assessment-trap',
            'balanced-challenge-trap'
        ]
    };
    
    const trapList = traps[weakness] || traps['none'];
    const index = Math.min(stage - 1, trapList.length - 1);
    return trapList[index];
}

function shouldMoveToNextLevel(behaviorScore, consecutiveSuccesses, levelInfo) {
    // Criteria for level progression
    if (!levelInfo) return false;
    
    // Need high score and consistent success
    if (behaviorScore >= 80 && consecutiveSuccesses >= 2) {
        return true;
    }
    
    // Or perfect score on current level
    if (behaviorScore === 100) {
        return true;
    }
    
    return false;
}

function generateRecommendation(stage, trapType, weakness, shouldProgress) {
    const recommendations = {
        1: "Building foundation - focus on understanding core concepts",
        2: "Good progress - ready for slight challenges",
        3: "Solid performance - testing your boundaries",
        4: "Strong skills detected - pushing harder",
        5: "Exceptional performance - maximum challenge mode"
    };
    
    let message = recommendations[stage];
    
    if (shouldProgress) {
        message += " | Ready to advance to next level!";
    }
    
    if (weakness !== 'none') {
        message += ` | Focus area: ${weakness.replace('-', ' ')}`;
    }
    
    return message;
}

// Trap difficulty calculator
export function calculateTrapDifficulty(baseQuestion, trapType, escalationStage) {
    const difficultyMap = {
        'Easy': 1,
        'Medium': 2,
        'Hard': 3
    };
    
    const baseDifficulty = difficultyMap[baseQuestion.difficulty] || 2;
    const trapModifier = Math.floor(escalationStage / 2);
    
    const finalDifficulty = Math.min(3, baseDifficulty + trapModifier);
    
    return Object.keys(difficultyMap).find(
        key => difficultyMap[key] === finalDifficulty
    );
}
