/**
 * Recipe Model
 * Represents a recipe in the application
 */

// Import the User type for references
import { User } from './user.model';

/**
 * Recipe Tag
 */
export interface Tag {
  id: number;
  name: string;
}

/**
 * Recipe Tag relation
 */
export interface RecipeTag {
  id?: number;
  recipeId?: number;
  tagId?: number;
  tag: Tag;
}

/**
 * Recipe Nutrition Information
 */
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

/**
 * Base Recipe interface with common properties
 */
export interface BaseRecipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  userId?: number;
  user?: User;
  tags?: RecipeTag[];
  nutritionInfo?: NutritionInfo;
}

/**
 * Client-side Recipe (dates as strings)
 */
export interface Recipe extends BaseRecipe {
  createdAt: string;
  updatedAt: string;
}

/**
 * Server-side Recipe (dates as Date objects)
 */
export interface ServerRecipe extends BaseRecipe {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTOs for creating and updating recipes
 */
export type CreateRecipeDTO = Omit<BaseRecipe, 'id'>;
export type UpdateRecipeDTO = Partial<CreateRecipeDTO>;
