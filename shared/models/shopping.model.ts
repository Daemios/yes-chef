/**
 * Shopping Model
 * Represents shopping lists and shopping items
 */

/**
 * Shopping item categories for organizing the shopping list
 */
export enum ShoppingCategory {
  PRODUCE = 'Produce',
  DAIRY = 'Dairy & Eggs',
  MEAT = 'Meat & Seafood',
  GRAINS = 'Grains & Pasta',
  PANTRY = 'Pantry',
  FROZEN = 'Frozen Foods',
  BAKERY = 'Bakery',
  CANNED = 'Canned Goods',
  SNACKS = 'Snacks',
  BEVERAGES = 'Beverages',
  OTHER = 'Other'
}

/**
 * Represents a single item in a shopping list
 */
export interface ShoppingItem {
  id: number | string;
  name: string;
  quantity: string; // Can be "2 lbs", "3 cups", etc.
  section: ShoppingCategory | string;
  recipe?: string; // Name of the recipe this item is for
  purchased: boolean;
  notes?: string;
}

/**
 * Represents a section in the shopping list
 */
export interface ShoppingSection {
  name: string;
  icon: string;
  color: string;
  items: ShoppingItem[];
}

/**
 * Represents a complete shopping list
 */
export interface ShoppingList {
  id: number | string;
  userId: number;
  name: string;
  sections: ShoppingSection[];
  mealPlanId?: number | string; // Optional reference to the meal plan this list is for
  createdAt: string | Date;
  updatedAt: string | Date;
  isComplete: boolean;
}
