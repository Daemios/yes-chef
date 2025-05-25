/**
 * Simple meal types for client-side use
 * These match the simplified Meal model from the shared folder
 */

import type { Recipe } from './recipe';

/**
 * Meal - represents a planned meal for a specific date
 * Matches the Prisma schema model
 */
export interface Meal {
  id: number;
  recipeId: number;
  userId: number | null;
  date: Date | string; // Can be Date object or ISO string
  servings: number;
  mealType: string; // breakfast, lunch, dinner, snack
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Relations (optional, populated when needed)
  recipe?: Recipe;
}
