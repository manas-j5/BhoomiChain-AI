const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint — used by Docker, CI/CD and monitoring tools.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'BhoomiChain AI Backend Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: `${Math.floor(process.uptime())}s`,
    services: {
      api: 'UP',
      database: 'NOT_CONNECTED (mock data active)',
      ai_engine: 'PENDING',
      gis_engine: 'PENDING',
      blockchain: 'PENDING',
    },
  });
});

module.exports = router;
