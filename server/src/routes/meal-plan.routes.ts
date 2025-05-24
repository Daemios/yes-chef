/**
 * Meal Plan routes
 * Handles all meal plan-related API endpoints
 */
import express from 'express';
import * as mealPlanController from '../controllers/meal-plan.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// All meal plan routes are protected - require authentication
router.use(authenticateToken);

// Meal plan CRUD endpoints
router.get('/', mealPlanController.getUserMealPlans);
router.get('/:id', mealPlanController.getMealPlanById);
router.post('/', mealPlanController.createMealPlan);
router.put('/:id', mealPlanController.updateMealPlan);
router.delete('/:id', mealPlanController.deleteMealPlan);

// Meal slot endpoints
router.post('/slot', mealPlanController.addRecipeToMealSlot);
router.delete('/:id/slot', mealPlanController.removeRecipeFromMealSlot);

export default router;
