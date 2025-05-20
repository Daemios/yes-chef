/**
 * Health check routes
 * Provides endpoints for monitoring and health checks
 */
import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;
