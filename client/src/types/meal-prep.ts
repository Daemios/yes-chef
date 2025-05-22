/**
 * Types for meal prep and portions functionality
 */

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
  // Additional meal info can be added as needed
  mealType?: 'breakfast' | 'lunch' | 'dinner';
  ingredients?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
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
}

/**
 * Helper utilities for meal prep
 */
export const mealPrepUtils = {
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
