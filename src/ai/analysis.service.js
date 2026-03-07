/**
 * AI Analysis Service
 * Runs all 4 engines and returns recommendation
 */

import { analyzeBehavior } from './behavior.engine';
import { analyzeExploitability } from './exploitability.engine';
import { determineStrategy } from './strategy.engine';
import { recommendNextQuestion } from './adaptive-trap.engine';

export function runAIAnalysis(data) {
    const { questionId, questionCategory, timeTaken, incorrectAttempts } = data;
    
    try {
        // Step 1: Calculate behavior score
        const behaviorResult = analyzeBehavior({ timeTaken, incorrectAttempts });
        
        // Step 2: Calculate exploitability
        const exploitabilityResult = analyzeExploitability({ 
            behaviorScore: behaviorResult.behaviorScore 
        });
        
        // Step 3: Determine strategy
        const strategyResult = determineStrategy({ 
            exploitabilityScore: exploitabilityResult.exploitabilityScore 
        });
        
        // Step 4: Recommend next question
        const nextQuestionResult = recommendNextQuestion({
            questionId,
            questionCategory,
            strategy: strategyResult.strategy
        });
        
        // Return complete analysis
        return {
            behaviorScore: behaviorResult.behaviorScore,
            exploitabilityScore: exploitabilityResult.exploitabilityScore,
            strategy: strategyResult.strategy,
            nextQuestion: nextQuestionResult.nextQuestion,
            recommendation: `Try "${nextQuestionResult.nextQuestion.title}" next (${nextQuestionResult.nextQuestion.difficulty})`
        };
        
    } catch (error) {
        console.error('AI Analysis error:', error);
        return {
            error: true,
            message: error.message
        };
    }
}
