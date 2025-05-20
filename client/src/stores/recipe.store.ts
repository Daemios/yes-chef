import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchRecipes, fetchRecipeById, createRecipe, updateRecipe, deleteRecipe } from '../services/recipe.service';
import type { Recipe, CreateRecipeDTO, UpdateRecipeDTO } from '../types/recipe';

export const useRecipeStore = defineStore('recipe', () => {
  // State
  const recipes = ref<Recipe[]>([]);
  const currentRecipe = ref<Recipe | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date | null>(null);

  // Getters
  const getRecipeById = computed(() => {
    return (id: number) => recipes.value.find(recipe => recipe.id === id) || null;
  });

  const getSortedRecipes = computed(() => {
    return [...recipes.value].sort((a, b) => {
      // Sort by creation date descending
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  // Actions
  async function fetchAllRecipes() {
    loading.value = true;
    error.value = null;
    try {
      recipes.value = await fetchRecipes();
      lastUpdated.value = new Date();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch recipes';
      console.error('Error fetching recipes:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecipeDetails(id: number) {
    loading.value = true;
    error.value = null;
    try {
      currentRecipe.value = await fetchRecipeById(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch recipe details';
      console.error(`Error fetching recipe ${id}:`, err);
    } finally {
      loading.value = false;
    }
  }

  async function addRecipe(newRecipe: CreateRecipeDTO) {
    loading.value = true;
    error.value = null;
    try {
      const addedRecipe = await createRecipe(newRecipe);
      recipes.value.push(addedRecipe);
      return addedRecipe;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create recipe';
      console.error('Error creating recipe:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function modifyRecipe(id: number, recipeData: UpdateRecipeDTO) {
    loading.value = true;
    error.value = null;
    try {
      const updatedRecipe = await updateRecipe(id, recipeData);
      const index = recipes.value.findIndex(r => r.id === id);
      if (index !== -1) {
        recipes.value[index] = updatedRecipe;
      }
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = updatedRecipe;
      }
      return updatedRecipe;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update recipe';
      console.error(`Error updating recipe ${id}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeRecipe(id: number) {
    loading.value = true;
    error.value = null;
    try {
      await deleteRecipe(id);
      recipes.value = recipes.value.filter(recipe => recipe.id !== id);
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete recipe';
      console.error(`Error deleting recipe ${id}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Reset store state
  function resetState() {
    recipes.value = [];
    currentRecipe.value = null;
    error.value = null;
    loading.value = false;
    lastUpdated.value = null;
  }

  return {
    // State
    recipes,
    currentRecipe,
    loading,
    error,
    lastUpdated,
    
    // Getters
    getRecipeById,
    getSortedRecipes,
    
    // Actions
    fetchAllRecipes,
    fetchRecipeDetails,
    addRecipe,
    modifyRecipe,
    removeRecipe,
    resetState
  };
});
