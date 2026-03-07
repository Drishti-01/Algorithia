/**
 * Analysis API Route
 */

const express = require('express');
const router = express.Router();
const analysisService = require('../services/analysis.service');

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
        const result = analysisService.runAnalysis({
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

module.exports = router;
