/**
 * Routes index file
 * Centralizes and exports all route modules
 */
import express from 'express';
import healthRoutes from './health.routes';
import apiRoutes from './api.routes';
import recipeRoutes from './recipe.routes';

const router = express.Router();

// Mount route modules
router.use('/health', healthRoutes);
router.use('/api', apiRoutes);
router.use('/recipes', recipeRoutes);

export default router;
