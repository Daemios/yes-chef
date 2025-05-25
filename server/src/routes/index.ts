import express from 'express';
import recipeRoutes from './recipe.routes';
import authRoutes from './auth.routes';
import mealRoutes from './meal.routes';

const router = express.Router();

// Mount route modules
router.use('/api/recipes', recipeRoutes);
router.use('/api/meals', mealRoutes);
router.use('/auth', authRoutes);

export default router;
