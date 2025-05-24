/**
 * Meal Plan Controller
 * Handles request/response logic for meal plan endpoints
 */
import { Request, Response } from 'express';
import { MealPlanRepository } from '../repositories/meal-plan.repository';

/**
 * Get all meal plans for the authenticated user
 */
export const getUserMealPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from the auth middleware
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const mealPlans = await MealPlanRepository.findByUserId(userId);
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
};

/**
 * Get meal plan by ID
 */
export const getMealPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user?.userId;
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid meal plan ID' });
      return;
    }
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    const mealPlan = await MealPlanRepository.findById(id);
    
    if (!mealPlan) {
      res.status(404).json({ error: 'Meal plan not found' });
      return;
    }
    
    // Check if the meal plan belongs to the user
    if (mealPlan.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    
    res.status(200).json(mealPlan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.status(500).json({ error: 'Failed to fetch meal plan' });
  }
};

/**
 * Create a new meal plan
 */
export const createMealPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // Add userId to the meal plan data
    const mealPlanData = {
      ...req.body,
      userId: userId
    };
    
    // Additional validation for dates
    try {    // Validate and clean up the meal plan data
      if (mealPlanData.days && Array.isArray(mealPlanData.days)) {
        mealPlanData.days = mealPlanData.days.map((day: any) => {
          // Make sure each day has valid properties
          return {
            day: day.day || 'Unknown',
            date: day.date,
            breakfast: day.breakfast || null,
            lunch: day.lunch || null,
            dinner: day.dinner || null,
            breakfastId: day.breakfastId || null,
            lunchId: day.lunchId || null,
            dinnerId: day.dinnerId || null,
          };
        });
      }
    } catch (validationError) {
      console.error('Validation error:', validationError);
    }
    
    // Additional logging to help diagnose the issue
    console.log('Creating meal plan with data:', JSON.stringify(mealPlanData, null, 2));
    
    const newMealPlan = await MealPlanRepository.create(mealPlanData);
    res.status(201).json(newMealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    
    // Include more details in the error response
    const errorMessage = error instanceof Error ? error.message : 'Failed to create meal plan';
    res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : 'Unknown error'
    });
  }
};

/**
 * Update an existing meal plan
 */
export const updateMealPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user?.userId;
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid meal plan ID' });
      return;
    }
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // Check if meal plan exists and belongs to the user
    const existingMealPlan = await MealPlanRepository.findById(id);
    if (!existingMealPlan) {
      res.status(404).json({ error: 'Meal plan not found' });
      return;
    }
    
    if (existingMealPlan.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    
    const updatedMealPlan = await MealPlanRepository.update(id, req.body);
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.status(500).json({ error: 'Failed to update meal plan' });
  }
};

/**
 * Delete a meal plan
 */
export const deleteMealPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user?.userId;
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid meal plan ID' });
      return;
    }
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // Check if meal plan exists and belongs to the user
    const existingMealPlan = await MealPlanRepository.findById(id);
    if (!existingMealPlan) {
      res.status(404).json({ error: 'Meal plan not found' });
      return;
    }
    
    if (existingMealPlan.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    
    await MealPlanRepository.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.status(500).json({ error: 'Failed to delete meal plan' });
  }
};

/**
 * Add a recipe to a meal slot in a meal plan
 */
export const addRecipeToMealSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mealPlanId, dayIndex, mealType, recipeId } = req.body;
    const userId = (req as any).user?.userId;
    
    if (!mealPlanId || !dayIndex || !mealType || !recipeId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // Check if meal plan exists and belongs to the user
    const existingMealPlan = await MealPlanRepository.findById(parseInt(mealPlanId));
    if (!existingMealPlan) {
      res.status(404).json({ error: 'Meal plan not found' });
      return;
    }
    
    if (existingMealPlan.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    
    const updatedMealPlan = await MealPlanRepository.addRecipeToMealSlot(
      parseInt(mealPlanId),
      parseInt(dayIndex),
      mealType,
      parseInt(recipeId)
    );
    
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.error('Error adding recipe to meal slot:', error);
    res.status(500).json({ error: 'Failed to update meal plan' });
  }
};

/**
 * Remove a recipe from a meal slot in a meal plan
 */
export const removeRecipeFromMealSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const mealPlanId = parseInt(req.params.id);
    const { dayIndex, mealType } = req.body;
    const userId = (req as any).user?.userId;
    
    if (isNaN(mealPlanId) || !dayIndex || !mealType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // Check if meal plan exists and belongs to the user
    const existingMealPlan = await MealPlanRepository.findById(mealPlanId);
    if (!existingMealPlan) {
      res.status(404).json({ error: 'Meal plan not found' });
      return;
    }
    
    if (existingMealPlan.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    
    const updatedMealPlan = await MealPlanRepository.removeRecipeFromMealSlot(
      mealPlanId,
      parseInt(dayIndex),
      mealType
    );
    
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    console.error('Error removing recipe from meal slot:', error);
    res.status(500).json({ error: 'Failed to update meal plan' });
  }
};
