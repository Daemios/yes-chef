import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MealPrep, PortionDate } from '@/types/meal-prep';
import { generateRandomColor } from '@/services/color.service';

export const useMealPrepStore = defineStore('mealPrep', () => {
  const mealPreps = ref<MealPrep[]>([]);
  const mealColors = ref<Record<string, string>>({});

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
  
  // Delete a meal prep
  function deleteMealPrep(mealId: string) {
    const index = mealPreps.value.findIndex(m => m.id === mealId);
    if (index !== -1) {
      mealPreps.value.splice(index, 1);
      return true;
    }
    return false;
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
      ingredients: ['chicken', 'garlic', 'olive oil', 'herbs']
    });
    
    addMealPrep({
      name: 'Quinoa Salad',
      mealType: 'lunch',
      totalPortions: 4,
      prepDate: formatDate(today),
      ingredients: ['quinoa', 'tomatoes', 'cucumber', 'feta cheese']
    });
    
    addMealPrep({
      name: 'Overnight Oats',
      mealType: 'breakfast',
      totalPortions: 3,
      prepDate: formatDate(today),
      ingredients: ['oats', 'milk', 'honey', 'berries']
    });
  }
  
  return {
    mealPreps,
    mealColors,
    getAllMealPreps,
    getUpcomingLeftovers,
    addMealPrep,
    markPortionConsumed,
    getMealColorByName,
    deleteMealPrep,
    clearAllMealPreps,
    loadSampleData
  };
});
