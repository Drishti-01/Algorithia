/**
 * Enhanced Analysis Service
 * Orchestrates all engines for comprehensive analysis
 */

import { analyzePerformance } from '../engines/performance.engine.js';
import { calculateLevelProgression } from '../engines/level.engine.js';
import { recommendNextQuestions } from '../engines/recommendation.engine.js';
import { analyzePatterns } from '../engines/analytics.engine.js';

export function runEnhancedAnalysis(data) {
    try {
        // Step 1: Performance Analysis
        const performance = analyzePerformance({
            timeTaken: data.timeTaken,
            incorrectAttempts: data.incorrectAttempts,
            questionDifficulty: data.questionDifficulty,
            currentLevel: data.currentLevel || 1
        });
        
        // Step 2: Pattern Analysis
        const patterns = analyzePatterns({
            userHistory: data.userHistory || [],
            currentPerformance: performance,
            questionCategory: data.questionCategory
        });
        
        // Step 3: Level Progression
        const levelData = calculateLevelProgression({
            currentLevel: data.currentLevel || 1,
            currentXP: data.currentXP || 0,
            performanceScore: performance.performanceScore,
            questionDifficulty: data.questionDifficulty,
            completedQuestions: data.completedQuestions?.length || 0
        });
        
        // Step 4: Smart Recommendations
        const recommendations = recommendNextQuestions({
            questionId: data.questionId,
            questionCategory: data.questionCategory,
            questionDifficulty: data.questionDifficulty,
            performanceScore: performance.performanceScore,
            currentLevel: levelData.currentLevel,
            completedQuestions: data.completedQuestions || [],
            weakCategories: patterns.weakCategories,
            allQuestions: data.allQuestions || []
        });
        
        // Compile complete analysis
        return {
            success: true,
            performance: {
                score: performance.performanceScore,
                efficiency: performance.efficiency,
                timeTaken: performance.timeTaken,
                incorrectAttempts: performance.incorrectAttempts,
                quickCompletion: performance.quickCompletion
            },
            level: {
                current: levelData.currentLevel,
                xp: levelData.currentXP,
                xpEarned: levelData.xpEarned,
                xpForNext: levelData.xpForNextLevel,
                leveledUp: levelData.leveledUp,
                mastery: levelData.masteryLevel,
                masteryPercentage: levelData.masteryPercentage
            },
            patterns: {
                trend: patterns.trend,
                categoryStrength: patterns.categoryStrength,
                weakCategories: patterns.weakCategories,
                strongCategories: patterns.strongCategories,
                averageScore: patterns.averageScore,
                totalAttempts: patterns.totalAttempts
            },
            recommendations: {
                primary: recommendations.primary,
                alternatives: recommendations.alternatives,
                reason: recommendations.reason,
                targetDifficulty: recommendations.targetDifficulty
            },
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Enhanced Analysis Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
