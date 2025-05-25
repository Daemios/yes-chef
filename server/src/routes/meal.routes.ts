import { Router } from 'express';
import { 
  getMeals, 
  getMealById, 
  createMeal, 
  updateMeal, 
  deleteMeal, 
  getMealsByDateRange 
} from '../controllers/meal.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All meal routes require authentication
router.use(authenticateToken);

// GET /api/meals - Get all meals for user
router.get('/', getMeals);

// GET /api/meals/date-range - Get meals by date range
router.get('/date-range', getMealsByDateRange);

// GET /api/meals/:id - Get specific meal
router.get('/:id', getMealById);

// POST /api/meals - Create new meal
router.post('/', createMeal);

// PUT /api/meals/:id - Update meal
router.put('/:id', updateMeal);

// DELETE /api/meals/:id - Delete meal
router.delete('/:id', deleteMeal);

export default router;
