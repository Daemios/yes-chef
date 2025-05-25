import { Request, Response } from 'express';
import { MealRepository } from '../repositories/meal.repository';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const getMeals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const meals = await MealRepository.findByUserId(userId);
    res.json({ success: true, data: meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMealById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mealId = parseInt(id);

    if (isNaN(mealId)) {
      res.status(400).json({ success: false, message: 'Invalid meal ID' });
      return;
    }

    const meal = await MealRepository.findById(mealId);
    
    if (!meal) {
      res.status(404).json({ success: false, message: 'Meal not found' });
      return;
    }

    // Check if user owns this meal
    if (meal.userId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    res.json({ success: true, data: meal });
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createMeal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { recipeId, date, servings, mealType } = req.body;

    if (!recipeId || !date || !servings || !mealType) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: recipeId, date, servings, mealType' 
      });
      return;
    }

    const meal = await MealRepository.create({
      recipeId: parseInt(recipeId),
      userId,
      date: new Date(date),
      servings: parseInt(servings),
      mealType
    });

    res.status(201).json({ success: true, data: meal });
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateMeal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mealId = parseInt(id);

    if (isNaN(mealId)) {
      res.status(400).json({ success: false, message: 'Invalid meal ID' });
      return;
    }

    // Check if meal exists and user owns it
    const existingMeal = await MealRepository.findById(mealId);
    if (!existingMeal) {
      res.status(404).json({ success: false, message: 'Meal not found' });
      return;
    }

    if (existingMeal.userId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const { recipeId, date, servings, mealType } = req.body;
    const updateData: any = {};

    if (recipeId) updateData.recipeId = parseInt(recipeId);
    if (date) updateData.date = new Date(date);
    if (servings) updateData.servings = parseInt(servings);
    if (mealType) updateData.mealType = mealType;

    const meal = await MealRepository.update(mealId, updateData);
    res.json({ success: true, data: meal });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteMeal = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mealId = parseInt(id);

    if (isNaN(mealId)) {
      res.status(400).json({ success: false, message: 'Invalid meal ID' });
      return;
    }

    // Check if meal exists and user owns it
    const existingMeal = await MealRepository.findById(mealId);
    if (!existingMeal) {
      res.status(404).json({ success: false, message: 'Meal not found' });
      return;
    }

    if (existingMeal.userId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    await MealRepository.delete(mealId);
    res.json({ success: true, message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMealsByDateRange = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ 
        success: false, 
        message: 'Missing required query parameters: startDate, endDate' 
      });
      return;
    }

    const meals = await MealRepository.findByUserIdAndDateRange(
      userId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({ success: true, data: meals });
  } catch (error) {
    console.error('Error fetching meals by date range:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
