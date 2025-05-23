/**
 * Ingredient Model
 * Represents an ingredient in a recipe
 */

/**
 * Base Ingredient interface
 */
export interface BaseIngredient {
  id: number;
  name: string;
  amount?: string;
  recipeId: number;
}

/**
 * Client-side Ingredient (dates as strings)
 */
export interface Ingredient extends BaseIngredient {
  createdAt: string;
  updatedAt: string;
}

/**
 * Server-side Ingredient (dates as Date objects)
 */
export interface ServerIngredient extends BaseIngredient {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTOs for creating and updating ingredients
 */
export type CreateIngredientDTO = Omit<BaseIngredient, 'id'>;
export type UpdateIngredientDTO = Partial<CreateIngredientDTO>;
