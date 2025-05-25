// This file ensures TypeScript can find the shared model files

// Recipe model exports
import { BaseRecipe, Recipe, ServerRecipe, Tag, RecipeTag, NutritionInfo, CreateRecipeDTO, UpdateRecipeDTO } from '../../../shared/models/recipe.model';
export { BaseRecipe, Recipe, ServerRecipe, Tag, RecipeTag, NutritionInfo, CreateRecipeDTO, UpdateRecipeDTO };

// Ingredient model exports
import { BaseIngredient, Ingredient, ServerIngredient, CreateIngredientDTO, UpdateIngredientDTO } from '../../../shared/models/ingredient.model';
export { BaseIngredient, Ingredient, ServerIngredient, CreateIngredientDTO, UpdateIngredientDTO };

// User model exports 
import { User, UserProfile, LoginCredentials, RegistrationData } from '../../../shared/models/user.model';
export { User, UserProfile, LoginCredentials, RegistrationData };

// Meal model exports
import { Meal } from '../../../shared/models/meal.model';
export { Meal };

// Shopping model exports
import { ShoppingList, ShoppingItem, ShoppingSection, ShoppingCategory } from '../../../shared/models/shopping.model';
export { ShoppingList, ShoppingItem, ShoppingSection, ShoppingCategory };
