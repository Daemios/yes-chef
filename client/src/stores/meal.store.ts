import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Meal } from '../types/meal-types';
import { getMeals, createMeal as apiCreateMeal, updateMeal as apiUpdateMeal, deleteMeal as apiDeleteMeal } from '../services/api.service';

export const useMealStore = defineStore('meal', () => {
  const meals = ref<Meal[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Get all meals
  const getAllMeals = computed(() => meals.value);
  
  // Get meals for a specific date
  const getMealsForDate = (date: string) => computed(() => 
    meals.value.filter(meal => {
      const mealDate = meal.date instanceof Date 
        ? meal.date.toISOString().split('T')[0] 
        : meal.date.split('T')[0];
      return mealDate === date;
    })
  );

  // Get meals by type
  const getMealsByType = (mealType: string) => computed(() =>
    meals.value.filter(meal => meal.mealType === mealType)
  );

  // Load meals from server
  const loadMeals = async () => {
    if (isLoading.value) return;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await getMeals();
      meals.value = response.data || response;
    } catch (err: any) {
      error.value = err.message || 'Failed to load meals';
      console.error('Error loading meals:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new meal
  const createMeal = async (mealData: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiCreateMeal(mealData);
      const newMeal = response.data || response;
      meals.value.push(newMeal);
      return newMeal;
    } catch (err: any) {
      error.value = err.message || 'Failed to create meal';
      console.error('Error creating meal:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Update a meal
  const updateMeal = async (id: number, mealData: Partial<Meal>) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await apiUpdateMeal(id, mealData);
      const updatedMeal = response.data || response;
      
      const index = meals.value.findIndex(meal => meal.id === id);
      if (index !== -1) {
        meals.value[index] = updatedMeal;
      }
      
      return updatedMeal;
    } catch (err: any) {
      error.value = err.message || 'Failed to update meal';
      console.error('Error updating meal:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a meal
  const deleteMeal = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await apiDeleteMeal(id);
      meals.value = meals.value.filter(meal => meal.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Failed to delete meal';
      console.error('Error deleting meal:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Clear all meals
  const clearMeals = () => {
    meals.value = [];
    error.value = null;
  };

  return {
    // State
    meals: getAllMeals,
    isLoading,
    error,
    
    // Getters
    getMealsForDate,
    getMealsByType,
    
    // Actions
    loadMeals,
    createMeal,
    updateMeal,
    deleteMeal,
    clearMeals
  };
});
