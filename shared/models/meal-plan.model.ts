/**
 * Meal Plan Model
 * Represents a weekly meal plan with breakfast, lunch, and dinner for each day
 */

import { Meal } from './meal.model';

/**
 * Represents a single day in the meal plan
 */
export interface MealDay {
  day: string; // Monday, Tuesday, etc.
  date: string; // ISO format date string
  breakfast: string;
  lunch: string;
  dinner: string;
  // Optional metadata for meals
  needsPrep?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  isPrepared?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  // Optional link to the meal objects
  mealObjects?: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  };
}

/**
 * Represents a complete meal plan (typically a week)
 */
export interface MealPlan {
  id: number | string;
  userId: number;
  name: string;
  startDate: string; // ISO format date string
  endDate: string; // ISO format date string
  days: MealDay[];
  createdAt: string | Date;
  updatedAt: string | Date;
  isActive: boolean;
}

/**
 * Represents a single meal preparation task
 */
export interface PrepTask {
  id: number | string;
  name: string;
  day: string; // Monday, Tuesday, etc.
  date: string; // ISO format date string
  completed: boolean;
  mealId?: number | string; // Reference to the meal this task is for
  userId: number;
}
