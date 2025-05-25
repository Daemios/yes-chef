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
  description: string | null;
  instructions: string;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  difficulty: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  userId: number | null;
  user?: User;
  tags?: RecipeTag[];
  ingredients?: any[]; // Will be Ingredient[] when populated
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
export type CreateRecipeDTO = Omit<BaseRecipe, 'id' | 'user' | 'tags' | 'ingredients'>;
export type UpdateRecipeDTO = Partial<CreateRecipeDTO>;
