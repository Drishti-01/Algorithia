/**
 * API Routes
 */

import express from 'express';
import { runEnhancedAnalysis } from '../services/enhanced-analysis.service.js';

const router = express.Router();

const VALID_DIFFICULTIES = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
};

const sanitizeNumber = (value, fallback) => {
    if (value === undefined || value === null) return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
};

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ALGorithia Enhanced Backend',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// Enhanced analysis endpoint
router.post('/analyze', (req, res) => {
    try {
        const {
            questionId,
            questionCategory,
            questionDifficulty,
            timeTaken,
            incorrectAttempts,
            currentLevel,
            currentXP,
            completedQuestions,
            userHistory,
            allQuestions
        } = req.body;
        
        // Validate required fields
        if (!questionId || !questionCategory || !questionDifficulty) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: questionId, questionCategory, questionDifficulty'
            });
        }

        const normalizedDifficultyKey = typeof questionDifficulty === 'string'
            ? questionDifficulty.trim().toLowerCase()
            : '';
        const normalizedDifficulty = VALID_DIFFICULTIES[normalizedDifficultyKey];

        if (!normalizedDifficulty) {
            return res.status(400).json({
                success: false,
                error: 'Invalid difficulty level'
            });
        }
        
        // Run analysis
        const result = runEnhancedAnalysis({
            questionId,
            questionCategory,
            questionDifficulty: normalizedDifficulty,
            timeTaken: sanitizeNumber(timeTaken, 0),
            incorrectAttempts: sanitizeNumber(incorrectAttempts, 0),
            currentLevel: sanitizeNumber(currentLevel, 1),
            currentXP: sanitizeNumber(currentXP, 0),
            completedQuestions: completedQuestions ?? [],
            userHistory: userHistory ?? [],
            allQuestions: allQuestions ?? []
        });
        
        if (!result?.success) {
            return res.status(500).json(result);
        }
        
        res.json(result);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

export default router;
