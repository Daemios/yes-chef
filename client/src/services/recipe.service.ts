/**
 * Recipe Service
 * Handles all API requests related to recipes
 */
import type { Recipe, CreateRecipeDTO, UpdateRecipeDTO } from '../types/recipe';

// API base URL
const API_BASE = '/recipes';

/**
 * Fetch all recipes
 */
export const fetchRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Fetch a recipe by ID
 */
export const fetchRecipeById = async (id: number): Promise<Recipe> => {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error fetching recipe ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new recipe
 */
export const createRecipe = async (recipe: CreateRecipeDTO): Promise<Recipe> => {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error creating recipe:', error);
    throw error;
  }
};

/**
 * Update an existing recipe
 */
export const updateRecipe = async (id: number, recipe: UpdateRecipeDTO): Promise<Recipe> => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error updating recipe ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a recipe
 */
export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  } catch (error) {
    console.error(`API Error deleting recipe ${id}:`, error);
    throw error;
  }
};
