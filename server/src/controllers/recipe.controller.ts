import { Request, Response } from 'express';
import { RecipeService } from '../services/recipe.service';

/**
 * Get all recipes
 */
export const getAllRecipes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await RecipeService.getRecipes({});
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

/**
 * Get recipe by ID
 */
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid recipe ID' });
      return;
    }
    
    const recipe = await RecipeService.getRecipeById(id);
    
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    
    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

/**
 * Create a new recipe
 */
export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from the auth middleware
    const userId = (req as any).user?.userId;
    
    // Add userId to the recipe data
    const recipeData = {
      ...req.body,
      userId: userId
    };
    
    const newRecipe = await RecipeService.createRecipe(recipeData);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

/**
 * Update an existing recipe
 */
export const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid recipe ID' });
      return;
    }
    
    const updatedRecipe = await RecipeService.updateRecipe(id, req.body);
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid recipe ID' });
      return;
    }
    
    await RecipeService.deleteRecipe(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
