import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MealPrep, PortionDate, MealPrepMode } from '../types/meal-types';
import { generateRandomColor } from '../services/color.service';

export const useMealPrepStore = defineStore('mealPrep', () => {
  const mealPreps = ref<MealPrep[]>([]);
  const mealColors = ref<Record<string, string>>({});
  const currentPrepMode = ref<MealPrepMode>(MealPrepMode.BALANCED); // Default to balanced mode

  // Get all meal preps
  const getAllMealPreps = computed(() => mealPreps.value);
  
  // Get upcoming leftover meals (portions > 1)
  const getUpcomingLeftovers = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    const leftovers: Array<{
      id: string;
      mealId: string;
      name: string;
      date: string;
      portionNumber: number;
      type: string;
      color: string;
    }> = [];
    
    mealPreps.value.forEach(meal => {
      meal.portionDates.forEach(portion => {
        // Only include leftovers (portion > 1) that are today or in the future
        if (portion.portionNumber > 1 && portion.date >= today && !portion.consumed) {
          leftovers.push({
            id: `${meal.id}-${portion.portionNumber}`,
            mealId: meal.id,
            name: meal.name,
            date: portion.date,
            portionNumber: portion.portionNumber,
            type: meal.mealType || 'dinner',
            color: meal.color
          });
        }
      });
    });
    
    return leftovers;
  });
  
  // Add a new meal prep
  function addMealPrep(mealData: Omit<MealPrep, 'id' | 'color' | 'portionDates'>) {
    const id = `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const color = generateRandomColor();
    
    // Generate portion dates
    const portionDates: PortionDate[] = [];
    const prepDate = new Date(mealData.prepDate);
    
    // First portion is on the prep date
    portionDates.push({
      portionNumber: 1,
      date: mealData.prepDate,
      consumed: false
    });
    
    // Additional portions are on subsequent days by default
    for (let i = 2; i <= mealData.totalPortions; i++) {
      const nextDate = new Date(prepDate);
      nextDate.setDate(nextDate.getDate() + (i - 1));
      
      portionDates.push({
        portionNumber: i,
        date: nextDate.toISOString().split('T')[0],
        consumed: false
      });
    }
    
    // Store the meal color for consistent reference
    mealColors.value[mealData.name] = color;
    
    const newMealPrep: MealPrep = {
      id,
      color,
      portionDates,
      ...mealData
    };
    
    mealPreps.value.push(newMealPrep);
    return newMealPrep;
  }
  
  // Mark a portion as consumed
  function markPortionConsumed(mealId: string, portionNumber: number) {
    const meal = mealPreps.value.find(m => m.id === mealId);
    if (!meal) return false;
    
    const portion = meal.portionDates.find(p => p.portionNumber === portionNumber);
    if (!portion) return false;
    
    portion.consumed = true;
    return true;
  }
    // Get color for a specific meal by name
  function getMealColorByName(mealName: string) {
    if (mealColors.value[mealName]) {
      return mealColors.value[mealName];
    }
    
    // If we don't have a color yet, generate one and store it
    const color = generateRandomColor();
    mealColors.value[mealName] = color;
    return color;
  }
  
  // Get meals that need to be prepped today
  function getTodaysPrep() {
    const today = new Date().toISOString().split('T')[0];
    return mealPreps.value.filter(meal => 
      meal.prepDate === today && 
      (meal.needsPrep === undefined || meal.needsPrep === true) &&
      (meal.isPrepared === undefined || meal.isPrepared === false)
    );
  }
  
  // Set the meal prep mode
  function setPrepMode(mode: MealPrepMode) {
    currentPrepMode.value = mode;
    // Here we could adjust existing meals or apply settings based on the mode
  }
  
  // Get the current prep mode
  const getPrepMode = computed(() => currentPrepMode.value);
    // Delete a meal prep
  function deleteMealPrep(mealId: string) {
    const index = mealPreps.value.findIndex(m => m.id === mealId);
    if (index !== -1) {
      mealPreps.value.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Update meal prep servings
  function updateMealPrepServings(mealId: string, servings: number) {
    const meal = mealPreps.value.find(m => m.id === mealId);
    if (!meal) return false;
    
    // Update total portions
    meal.totalPortions = servings;
    
    // Recalculate portion dates
    const currentPortionDates = meal.portionDates;
    const prepDate = new Date(meal.prepDate);
    
    // Clear current portions
    meal.portionDates = [];
    
    // Recreate portion dates
    // First portion is on the prep date
    meal.portionDates.push({
      portionNumber: 1,
      date: meal.prepDate,
      consumed: currentPortionDates.length > 0 ? currentPortionDates[0].consumed : false
    });
    
    // Additional portions are on subsequent days
    for (let i = 2; i <= servings; i++) {
      const nextDate = new Date(prepDate);
      nextDate.setDate(nextDate.getDate() + (i - 1));
      
      const existingPortion = currentPortionDates.find(p => p.portionNumber === i);
      
      meal.portionDates.push({
        portionNumber: i,
        date: nextDate.toISOString().split('T')[0],
        consumed: existingPortion ? existingPortion.consumed : false
      });
    }
    
    return true;
  }
  
  // Clear all meal preps (for testing)
  function clearAllMealPreps() {
    mealPreps.value = [];
    mealColors.value = {};
  }
  
  // Load meal preps from initial data (for testing/demo)
  function loadSampleData() {
    clearAllMealPreps();
    
    // Add some sample meal preps
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      addMealPrep({
      name: 'Garlic Chicken',
      mealType: 'dinner',
      totalPortions: 3,
      prepDate: formatDate(today),
      ingredients: ['chicken', 'garlic', 'olive oil', 'herbs'],
      needsPrep: true,
      isPrepared: false,
      prepMode: MealPrepMode.BALANCED
    });
    
    addMealPrep({
      name: 'Quinoa Salad',
      mealType: 'lunch',
      totalPortions: 4,
      prepDate: formatDate(tomorrow),
      ingredients: ['quinoa', 'tomatoes', 'cucumber', 'feta cheese'],
      needsPrep: true,
      isPrepared: false,
      prepMode: MealPrepMode.BALANCED
    });
    
    addMealPrep({
      name: 'Overnight Oats',
      mealType: 'breakfast',
      totalPortions: 3,
      prepDate: formatDate(today),
      ingredients: ['oats', 'milk', 'honey', 'berries'],
      needsPrep: false,  // This meal is already prepped
      isPrepared: true,
      prepMode: MealPrepMode.LIGHT
    });
    
    // Add a heavy prep meal example
    addMealPrep({
      name: 'Batch Chili',
      mealType: 'dinner',
      totalPortions: 7,
      prepDate: formatDate(today),
      ingredients: ['ground beef', 'beans', 'tomatoes', 'onions', 'peppers', 'spices'],
      needsPrep: true,
      isPrepared: false,
      prepMode: MealPrepMode.HEAVY
    });
  }
    return {
    mealPreps,
    mealColors,
    currentPrepMode,
    getAllMealPreps,
    getUpcomingLeftovers,
    addMealPrep,
    markPortionConsumed,
    getMealColorByName,
    deleteMealPrep,
    updateMealPrepServings,
    clearAllMealPreps,
    loadSampleData,
    getTodaysPrep,
    setPrepMode,
    getPrepMode
  };
});
