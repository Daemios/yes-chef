/**
 * API routes
 * Handles all main application API endpoints
 */
import express from 'express';
import * as apiController from '../controllers/api.controller';

const router = express.Router();

// API endpoints
router.get('/hello', apiController.getHello);

export default router;
