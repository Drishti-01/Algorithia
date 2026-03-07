/**
 * ALGorithia Enhanced Backend Server
 * Version 2.0.0
 */

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'ALGorithia Enhanced Backend',
        version: '2.0.0',
        status: 'running',
        endpoints: {
            health: 'GET /api/health',
            analyze: 'POST /api/analyze'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   ALGorithia Enhanced Backend Server      ║');
    console.log('║   Version 2.0.0                           ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Analysis API: http://localhost:${PORT}/api/analyze`);
    console.log('');
    console.log('✅ Ready to receive requests!');
    console.log('');
});

export default app;
