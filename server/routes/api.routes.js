/**
 * API Routes
 */

import express from 'express';
import { runEnhancedAnalysis } from '../services/enhanced-analysis.service.js';

const router = express.Router();

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
        
        // Run analysis
        const result = runEnhancedAnalysis({
            questionId,
            questionCategory,
            questionDifficulty,
            timeTaken: timeTaken || 0,
            incorrectAttempts: incorrectAttempts || 0,
            currentLevel: currentLevel || 1,
            currentXP: currentXP || 0,
            completedQuestions: completedQuestions || [],
            userHistory: userHistory || [],
            allQuestions: allQuestions || []
        });
        
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
