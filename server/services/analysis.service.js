/**
 * Analysis Service
 * Runs 4 simple AI engines in sequence
 */

import behaviorEngine from '../engines/behavior.engine.js';
import exploitabilityEngine from '../engines/exploitability.engine.js';
import strategyEngine from '../engines/strategy.engine.js';
import adaptiveTrapEngine from '../engines/adaptive-trap.engine.js';

/**
 * Run analysis pipeline
 */
export function runAnalysis(data) {
    const { questionId, questionCategory, timeTaken, incorrectAttempts } = data;
    
    try {
        // Step 1: Calculate behavior score
        const behaviorResult = behaviorEngine({ timeTaken, incorrectAttempts });
        
        // Step 2: Calculate exploitability
        const exploitabilityResult = exploitabilityEngine({ 
            behaviorScore: behaviorResult.behaviorScore 
        });
        
        // Step 3: Determine strategy
        const strategyResult = strategyEngine({ 
            exploitabilityScore: exploitabilityResult.exploitabilityScore 
        });
        
        // Step 4: Recommend next question
        const nextQuestionResult = adaptiveTrapEngine({
            questionId,
            questionCategory,
            strategy: strategyResult.strategy
        });
        
        // Return complete analysis
        return {
            behaviorScore: behaviorResult.behaviorScore,
            exploitabilityScore: exploitabilityResult.exploitabilityScore,
            strategy: strategyResult.strategy,
            nextQuestion: nextQuestionResult.nextQuestion
        };
        
    } catch (error) {
        console.error('Analysis error:', error);
        return {
            error: true,
            message: error.message
        };
    }
}

export default { runAnalysis };
