// This file ensures TypeScript can find the shared model files

// Recipe model exports
import { BaseRecipe, Recipe, ServerRecipe, Tag, RecipeTag, NutritionInfo, CreateRecipeDTO, UpdateRecipeDTO } from '../../../shared/models/recipe.model';
export { BaseRecipe, Recipe, ServerRecipe, Tag, RecipeTag, NutritionInfo, CreateRecipeDTO, UpdateRecipeDTO };

// User model exports 
import { User, UserProfile, LoginCredentials, RegistrationData } from '../../../shared/models/user.model';
export { User, UserProfile, LoginCredentials, RegistrationData };

// Meal model exports
import { Meal, MealPrep, CalendarMeal, PortionDate, MealPrepMode } from '../../../shared/models/meal.model';
export { Meal, MealPrep, CalendarMeal, PortionDate, MealPrepMode };

// Meal plan model exports
import { MealDay, MealPlan, PrepTask } from '../../../shared/models/meal-plan.model';
export { MealDay, MealPlan, PrepTask };

// Shopping model exports
import { ShoppingList, ShoppingItem, ShoppingSection, ShoppingCategory } from '../../../shared/models/shopping.model';
export { ShoppingList, ShoppingItem, ShoppingSection, ShoppingCategory };
