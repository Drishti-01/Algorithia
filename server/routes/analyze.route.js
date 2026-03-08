/**
 * Analysis API Route
 */

import express from 'express';
import { runAnalysis } from '../services/analysis.service.js';

const router = express.Router();

/**
 * POST /api/analyze
 */
router.post('/analyze', (req, res) => {
    try {
        const { questionId, questionCategory, timeTaken, incorrectAttempts } = req.body;
        
        // Validate required fields
        if (!questionId || timeTaken === undefined || incorrectAttempts === undefined) {
            return res.status(400).json({
                error: true,
                message: 'Missing required fields'
            });
        }
        
        // Run analysis
        const result = runAnalysis({
            questionId,
            questionCategory: questionCategory || 'array',
            timeTaken,
            incorrectAttempts
        });
        
        // Log
        console.log(`[AI] Question: ${questionId}, Score: ${result.behaviorScore}, Strategy: ${result.strategy}`);
        
        // Return result
        res.json(result);
        
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
});

/**
 * GET /api/analyze/health
 */
router.get('/analyze/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'AI Analysis Engine'
    });
});

export default router;
