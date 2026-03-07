/**
 * Enhanced AI Analysis Service
 * Orchestrates all enhanced engines with level-based progression
 */

import { analyzeEnhancedBehavior } from './enhanced-behavior.engine';
import { analyzeExploitability } from './exploitability.engine';
import { determineStrategy } from './strategy.engine';
import { recommendNextQuestion } from './adaptive-trap.engine';
import { calculateTrapEscalation } from './trap-escalation.engine';
import { getLevelForQuestion, getNextLevel, QUESTION_LEVELS } from '../data/question-levels';

export function runEnhancedAIAnalysis(data) {
    const {
        questionId,
        questionCategory,
        questionDifficulty,
        timeTaken,
        incorrectAttempts,
        codeLength = 0,
        variablesUsed = 0,
        previousAttempts = [],
        userHistory = {
            consecutiveSuccesses: 0,
            consecutiveFailures: 0,
            completedLevels: []
        }
    } = data;
    
    try {
        // Step 1: Enhanced behavior analysis
        const behaviorResult = analyzeEnhancedBehavior({
            timeTaken,
            incorrectAttempts,
            questionDifficulty,
            previousAttempts,
            codeLength,
            variablesUsed
        });
        
        // Step 2: Calculate exploitability
        const exploitabilityResult = analyzeExploitability({
            behaviorScore: behaviorResult.behaviorScore
        });
        
        // Step 3: Determine strategy
        const strategyResult = determineStrategy({
            exploitabilityScore: exploitabilityResult.exploitabilityScore
        });
        
        // Step 4: Calculate trap escalation
        const trapResult = calculateTrapEscalation({
            behaviorScore: behaviorResult.behaviorScore,
            exploitabilityScore: exploitabilityResult.exploitabilityScore,
            questionId,
            questionCategory,
            questionDifficulty,
            consecutiveSuccesses: userHistory.consecutiveSuccesses,
            consecutiveFailures: userHistory.consecutiveFailures,
            weaknessDetected: behaviorResult.weaknessDetected
        });
        
        // Step 5: Recommend next question (with level awareness)
        const nextQuestionResult = recommendNextQuestionWithLevel({
            questionId,
            questionCategory,
            strategy: strategyResult.strategy,
            trapInfo: trapResult,
            userHistory
        });
        
        // Step 6: Generate comprehensive feedback
        const feedback = generateEnhancedFeedback({
            behaviorResult,
            exploitabilityResult,
            strategyResult,
            trapResult,
            nextQuestionResult
        });
        
        return {
            // Scores
            behaviorScore: behaviorResult.behaviorScore,
            exploitabilityScore: exploitabilityResult.exploitabilityScore,
            
            // Strategy
            strategy: strategyResult.strategy,
            
            // Trap info
            escalationStage: trapResult.escalationStage,
            trapType: trapResult.trapType,
            pressureMultiplier: trapResult.pressureMultiplier,
            
            // Performance details
            timeEfficiency: behaviorResult.timeEfficiency,
            codeEfficiency: behaviorResult.codeEfficiency,
            weaknessDetected: behaviorResult.weaknessDetected,
            mistakePattern: behaviorResult.mistakePattern,
            
            // Level progression
            currentLevel: trapResult.levelInfo,
            shouldProgressLevel: trapResult.shouldProgressLevel,
            
            // Recommendation
            nextQuestion: nextQuestionResult.nextQuestion,
            nextLevel: nextQuestionResult.nextLevel,
            
            // Feedback
            feedback: feedback,
            recommendation: trapResult.recommendation
        };
        
    } catch (error) {
        console.error('Enhanced AI Analysis error:', error);
        return {
            error: true,
            message: error.message
        };
    }
}

function recommendNextQuestionWithLevel(data) {
    const { questionId, questionCategory, strategy, trapInfo, userHistory } = data;
    
    // Get current level info
    const currentLevelInfo = trapInfo.levelInfo;
    
    // If should progress to next level
    if (trapInfo.shouldProgressLevel && currentLevelInfo) {
        const nextLevel = getNextLevel(
            currentLevelInfo.category,
            currentLevelInfo.levelId
        );
        
        if (nextLevel) {
            return {
                nextQuestion: {
                    id: nextLevel.questions[0],
                    title: `${nextLevel.name} - First Challenge`,
                    difficulty: nextLevel.difficulty,
                    category: currentLevelInfo.category,
                    isLevelUp: true
                },
                nextLevel: nextLevel
            };
        }
    }
    
    // Otherwise, use standard recommendation
    const standardResult = recommendNextQuestion({
        questionId,
        questionCategory,
        strategy
    });
    
    return {
        nextQuestion: standardResult.nextQuestion,
        nextLevel: null
    };
}

function generateEnhancedFeedback(data) {
    const { behaviorResult, trapResult, nextQuestionResult } = data;
    
    const feedback = {
        performance: getPerformanceFeedback(behaviorResult.behaviorScore),
        timeManagement: getTimeFeedback(behaviorResult.timeEfficiency),
        codeQuality: getCodeFeedback(behaviorResult.codeEfficiency),
        weakness: getWeaknessFeedback(behaviorResult.weaknessDetected),
        nextSteps: getNextStepsFeedback(trapResult, nextQuestionResult)
    };
    
    return feedback;
}

function getPerformanceFeedback(score) {
    if (score >= 90) return "🌟 Outstanding performance!";
    if (score >= 75) return "✨ Great job!";
    if (score >= 60) return "👍 Good effort!";
    if (score >= 40) return "💪 Keep practicing!";
    return "📚 Review the concepts and try again!";
}

function getTimeFeedback(efficiency) {
    const messages = {
        'excellent': "⚡ Lightning fast!",
        'good': "⏱️ Good timing!",
        'acceptable': "🕐 Consider optimizing your approach",
        'slow': "🐌 Take time to plan before coding"
    };
    return messages[efficiency] || messages['acceptable'];
}

function getCodeFeedback(efficiency) {
    if (efficiency > 0) return "✅ Clean and efficient code!";
    if (efficiency < 0) return "⚠️ Code could be simplified";
    return "📝 Code structure is acceptable";
}

function getWeaknessFeedback(weakness) {
    const messages = {
        'logic-errors': "🎯 Focus on: Logic and edge cases",
        'pattern-recognition': "🔍 Focus on: Pattern identification",
        'time-pressure': "⏰ Focus on: Time management and planning",
        'none': "✨ No major weaknesses detected!"
    };
    return messages[weakness] || messages['none'];
}

function getNextStepsFeedback(trapResult, nextQuestionResult) {
    if (nextQuestionResult.nextLevel) {
        return `🎊 Level Up! Ready for ${nextQuestionResult.nextLevel.name}`;
    }
    
    return trapResult.recommendation;
}
