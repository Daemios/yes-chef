/**
 * Recipe routes
 * Handles all recipe-related API endpoints
 */
import express from 'express';
import * as recipeController from '../controllers/recipe.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public recipe endpoints (anyone can view)
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected recipe endpoints (must be logged in)
router.post('/', authenticateToken, recipeController.createRecipe);
router.put('/:id', authenticateToken, recipeController.updateRecipe);
router.delete('/:id', authenticateToken, recipeController.deleteRecipe);

export default router;
