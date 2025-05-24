import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MealPrep, PortionDate, MealPrepMode } from '../types/meal-types';
import { generateRandomColor } from '../services/color.service';
import * as MealPlanService from '../services/meal-plan.service';

export const useMealPrepStore = defineStore('mealPrep', () => {
  const mealPreps = ref<MealPrep[]>([]);
  const mealColors = ref<Record<string, string>>({});
  const currentPrepMode = ref<MealPrepMode>(MealPrepMode.BALANCED); // Default to balanced mode
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const currentMealPlanId = ref<number | null>(null);

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
    
    // Save to the server
    saveMealPlansToServer();
    
    return newMealPrep;
  }
  
  // Mark a portion as consumed
  function markPortionConsumed(mealId: string, portionNumber: number) {
    const meal = mealPreps.value.find(m => m.id === mealId);
    if (!meal) return false;
    
    const portion = meal.portionDates.find(p => p.portionNumber === portionNumber);
    if (!portion) return false;
    
    portion.consumed = true;
    
    // Save changes to server
    saveMealPlansToServer();
    
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
    
    // Save changes to server
    saveMealPlansToServer();
  }
  
  // Get the current prep mode
  const getPrepMode = computed(() => currentPrepMode.value);
    // Delete a meal prep
  function deleteMealPrep(mealId: string) {
    const index = mealPreps.value.findIndex(m => m.id === mealId);
    if (index !== -1) {
      mealPreps.value.splice(index, 1);
      
      // Save changes to server
      saveMealPlansToServer();
      
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
    
    // Save changes to server
    saveMealPlansToServer();
    
    return true;
  }
  
  // Clear all meal preps (for testing)
  function clearAllMealPreps() {
    mealPreps.value = [];
    mealColors.value = {};
    
    // Save changes to server (empty state)
    saveMealPlansToServer();
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
  
  // Save all meal prep data to the server
  async function saveMealPlansToServer() {
    try {
      isLoading.value = true;
      error.value = null;
      
      // Convert our meal preps to the format expected by the API
      const days = convertMealPrepsToMealPlanDays();
      console.log('Meal plan days data:', days);
      
      const mealPlanData = {
        name: 'My Meal Plan', // Default name
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        isActive: true,
        days
      };
      
      let response;
      
      // If we have a current meal plan ID, update it. Otherwise create a new one.
      if (currentMealPlanId.value) {
        response = await MealPlanService.updateMealPlan(currentMealPlanId.value, mealPlanData);
        console.log('Updated existing meal plan:', response);
      } else {
        response = await MealPlanService.createMealPlan(mealPlanData);
        console.log('Created new meal plan:', response);
        
        // Store the ID of the created meal plan for future updates
        if (response && response.id) {
          currentMealPlanId.value = response.id;
        }
      }
      
    } catch (err) {
      console.error('Failed to save meal plans to server:', err);
      error.value = 'Failed to save meal plans';
    } finally {
      isLoading.value = false;
    }
  }
  
  // Load meal plans from the server
  async function loadMealPlansFromServer() {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await MealPlanService.getUserMealPlans();
      console.log('Loaded meal plans from server:', response);
      
      if (response && response.length > 0) {
        // Take the most recent active meal plan
        const activeMealPlans = response.filter(plan => plan.isActive);
        const serverMealPlan = activeMealPlans.length > 0 
          ? activeMealPlans[0] 
          : response[0];
        
        // Store the meal plan ID for future updates
        currentMealPlanId.value = serverMealPlan.id;
        
        // Convert server meal plan to our meal preps format
        convertMealPlanDaysToMealPreps(serverMealPlan);
      }
      
    } catch (err) {
      console.error('Failed to load meal plans from server:', err);
      error.value = 'Failed to load meal plans';
    } finally {
      isLoading.value = false;
    }
  }
  
  // Helper function to convert meal preps to meal plan days format for API
  function convertMealPrepsToMealPlanDays() {
    console.log('Converting meal preps to meal plan days...');
    // Create a map to organize meal preps by date
    const mealsByDate = new Map();
    
    // Group all meal preps by their prep date
    mealPreps.value.forEach(mealPrep => {
      const date = mealPrep.prepDate;
      const mealType = mealPrep.mealType;
      
      // Log for debugging
      console.log(`Processing meal: ${mealPrep.name}, type: ${mealType}, date: ${date}`);
      
      if (!mealsByDate.has(date)) {
        // Create a new day entry with this date
        mealsByDate.set(date, {
          day: getDayName(new Date(date)),
          date: date, // The server will parse this string to a Date
          breakfast: '',
          lunch: '',
          dinner: '',
          breakfastId: null,
          lunchId: null,
          dinnerId: null
        });
      }
      
      // Set the meal in the appropriate slot
      const dayData = mealsByDate.get(date);
      if (mealType && ['breakfast', 'lunch', 'dinner'].includes(mealType)) {
        // If we have a recipeId, set it in the proper ID field
        // Otherwise set the name in the text field
        if (mealPrep.recipeId) {
          dayData[`${mealType}Id`] = mealPrep.recipeId;
          dayData[mealType] = ''; // Clear the text field when using a recipe
        } else {
          dayData[mealType] = mealPrep.name;
        }
      }
    });
    
    // Convert map to array
    return Array.from(mealsByDate.values());
  }
  
  // Helper function to convert meal plan days from API to meal preps format
  function convertMealPlanDaysToMealPreps(serverMealPlan: any) {
    // Clear existing meal preps
    mealPreps.value = [];
    mealColors.value = {};
    
    // Process each day in the meal plan
    serverMealPlan.days.forEach((day: any) => {
      // Process breakfast
      if (day.breakfastRecipe) {
        // We have a recipe relationship
        createMealPrepFromSlot(day.breakfastRecipe, day.date, 'breakfast');
      } else if (day.breakfast) {
        // We have a text meal name
        createMealPrepFromSlot(day.breakfast, day.date, 'breakfast');
      }
      
      // Process lunch
      if (day.lunchRecipe) {
        // We have a recipe relationship
        createMealPrepFromSlot(day.lunchRecipe, day.date, 'lunch');
      } else if (day.lunch) {
        // We have a text meal name
        createMealPrepFromSlot(day.lunch, day.date, 'lunch');
      }
      
      // Process dinner
      if (day.dinnerRecipe) {
        // We have a recipe relationship
        createMealPrepFromSlot(day.dinnerRecipe, day.date, 'dinner');
      } else if (day.dinner) {
        // We have a text meal name
        createMealPrepFromSlot(day.dinner, day.date, 'dinner');
      }
    });
  }
  
  // Helper function to create a meal prep from a meal plan slot
  function createMealPrepFromSlot(mealData: any, date: string, mealType: string) {
    // Check if it's a recipe object, a recipe ID, or just a text name
    let recipeId: number | undefined = undefined;
    let name: string;
    
    // Check if we have a recipe relation (from the API)
    const recipeRelationField = `${mealType}Recipe`;
    const recipeIdField = `${mealType}Id`;
    
    // Handle recipe objects returned from the server
    if (typeof mealData === 'object' && mealData !== null) {
      recipeId = mealData.id;
      name = mealData.title;
    }
    // Handle meal day with recipeId fields
    else if (typeof mealData !== 'object' && mealData !== null) {
      name = mealData;
      
      // If it's a numeric string, treat it as a recipe ID
      if (!isNaN(Number(mealData))) {
        recipeId = Number(mealData);
        name = `Recipe #${mealData}`;
      }
    } else {
      name = 'Unnamed Meal';
    }
    
    addMealPrep({
      name,
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner',
      totalPortions: 1, // Default
      prepDate: date,
      ingredients: [],
      recipeId: recipeId,
      needsPrep: false,
      isPrepared: false,
      prepMode: currentPrepMode.value
    });
  }
  
  // Helper function to get day name from date
  function getDayName(date: Date): string {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  }
  
  return {
    mealPreps,
    mealColors,
    currentPrepMode,
    isLoading,
    error,
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
    getPrepMode,
    saveMealPlansToServer,
    loadMealPlansFromServer
  };
});
