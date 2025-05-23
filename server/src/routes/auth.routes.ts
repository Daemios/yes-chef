/**
 * Auth Routes
 * Defines the authentication endpoints
 */

import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (authentication required)
router.get('/me', authenticateToken, authController.getMe);

export default router;
