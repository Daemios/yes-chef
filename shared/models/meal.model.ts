import { Recipe } from './recipe.model';

/**
 * Meal - represents a planned meal for a specific date
 * Matches the Prisma schema model
 */
export interface Meal {
  id: number;
  recipeId: number;
  userId: number | null;
  date: Date;
  servings: number;
  mealType: string; // breakfast, lunch, dinner, snack
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optional, populated when needed)
  recipe?: Recipe;
}
