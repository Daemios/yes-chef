/**
 * Meal Model
 * Represents a meal (a recipe with portion and preparation information)
 */

import { Recipe } from './recipe.model';

/**
 * Meal prep planning modes
 */
export enum MealPrepMode {
  HEAVY = 'heavy',  // 3 meals × 7 servings
  BALANCED = 'balanced', // 5 meals × 4-5 servings
  LIGHT = 'light' // 7-10 meals × 2-3 servings
}

/**
 * Represents when a portion of the meal will be consumed
 */
export interface PortionDate {
  portionNumber: number; // 1 is first portion, 2 is second, etc.
  date: string; // ISO format date string
  consumed: boolean;
}

/**
 * Represents a meal prep entry with portions information
 */
export interface MealPrep {
  id: string;
  name: string;
  color: string; // HSL color string
  totalPortions: number;
  prepDate: string; // ISO format date string
  portionDates: PortionDate[];
  // Additional meal info
  mealType: 'breakfast' | 'lunch' | 'dinner';
  recipeId?: number; // Link to the original recipe if applicable
  ingredients?: string[];
  needsPrep?: boolean; // Whether this meal needs preparation today
  isPrepared?: boolean; // Whether this meal has already been prepared
  prepMode?: MealPrepMode; // The meal prep mode this meal belongs to
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
}

/**
 * Calendar meal representation for rendering in calendar
 */
export interface CalendarMeal {
  id: string; // ID from the original meal prep
  name: string;
  type: string; // breakfast, lunch, dinner
  date: string; // ISO format date string
  color: string; // Color for this meal
  portionNumber: number; // Which portion this is (1, 2, 3...)
  isLeftover: boolean; // True for portions after the first one (portion > 1)
  needsPrep: boolean; // Whether this meal needs to be prepared today
  isPrepared: boolean; // Whether this meal has already been prepared
  prepMode?: MealPrepMode; // The meal prep mode this belongs to
}

/**
 * Meal - combines a recipe with meal prep information
 */
export interface Meal {
  id: number | string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string; // ISO format date string
  recipe?: Recipe;
  recipeId?: number;
  servings: number;
  leftovers: number;
  color?: string;
  needsPrep: boolean;
  isPrepared: boolean;
  notes?: string;
}

/**
 * Helper utilities for meal prep
 */
export const mealUtils = {
  /**
   * Determines if a portion is a leftover (not the first portion)
   */
  isLeftover: (portionNumber: number): boolean => {
    return portionNumber > 1;
  },
  
  /**
   * Generates suggested dates for portions based on prep date
   * Simple implementation adds 1 day per portion
   */
  generateSuggestedDates: (prepDate: Date, totalPortions: number): string[] => {
    const dates: string[] = [];
    const currentDate = new Date(prepDate);
    
    for (let i = 0; i < totalPortions; i++) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1); // Advance by one day
    }
    
    return dates;
  }
};
