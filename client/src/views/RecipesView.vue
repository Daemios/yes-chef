<template>  <div class="recipes-view">
    <!-- Main Content Area -->
    <v-container class="py-6" v-if="currentMode === 'browsing'">
      <!-- Search and Filters -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search recipes..."
            variant="outlined"
            density="comfortable"
            clearable
            @input="handleSearch"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedDifficulty"
            :items="difficultyOptions"
            label="Difficulty"
            variant="outlined"
            density="comfortable"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sort by"
            variant="outlined"
            density="comfortable"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Recipe Grid -->
      <div>
        <!-- Loading State -->
        <div v-if="recipeStore.loading" class="text-center py-12">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <p class="text-h6 mt-4">Loading recipes...</p>
        </div>

        <!-- Error State -->
        <v-alert
          v-else-if="recipeStore.error"
          type="error"
          variant="tonal"
          class="mb-6"
        >
          <template v-slot:title>Error loading recipes</template>
          {{ recipeStore.error }}
          <template v-slot:append>
            <v-btn 
              variant="text" 
              @click="recipeStore.fetchAllRecipes()"
            >
              Retry
            </v-btn>
          </template>
        </v-alert>

        <!-- Empty State -->
        <div v-else-if="filteredRecipes.length === 0" class="text-center py-12">
          <v-icon icon="mdi-book-open-variant" size="96" color="grey-lighten-1"></v-icon>
          <h3 class="text-h5 mb-3 text-grey-darken-1">No recipes found</h3>
          <p class="text-body-1 text-grey-darken-1 mb-6">
            {{ searchQuery ? 'Try adjusting your search terms or filters' : 'No recipes available yet' }}
          </p>
          <v-btn
            v-if="authStore.isAuthenticated"
            color="primary"
            prepend-icon="mdi-plus"
            @click="$router.push('/dashboard')"
          >
            Add Your First Recipe
          </v-btn>
        </div>

        <!-- Recipe Cards -->
        <v-row v-else>
          <v-col
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <recipe-card
              :recipe="recipe"
              @schedule-recipe="handleScheduleRecipe"
              @view-recipe="handleViewRecipe"
            ></recipe-card>
          </v-col>
        </v-row>

        <!-- Load More Button -->
        <div v-if="hasMoreRecipes" class="text-center mt-8">
          <v-btn
            variant="outlined"
            color="primary"
            @click="loadMoreRecipes"
            :loading="loadingMore"
          >
            Load More Recipes
          </v-btn>
        </div>
      </div>
    </v-container>    <!-- Meal Planning Mode -->
    <v-container fluid class="py-6" v-else-if="currentMode === 'planning'">
      <v-row>
        <!-- Calendar Column -->
        <v-col cols="12" lg="8">          <meal-planning-calendar
            :scheduled-meals="scheduledMeals"
            @meal-scheduled="handleMealScheduled"
            @meal-removed="handleMealRemoved"
            @slot-clicked="handleSlotClicked"
            @servings-updated="handleServingsUpdated"
          />
        </v-col>        <!-- Recipe Cards Column -->
        <v-col cols="12" lg="4">
          <v-card class="recipe-cards-panel" elevation="2">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6">Available Recipes</span>
              <v-chip color="primary" size="small">
                {{ filteredRecipes.length }} recipes
              </v-chip>
            </v-card-title>

            <v-divider></v-divider>

            <!-- Enhanced Search and Filters -->
            <v-card-text class="pb-2">
              <!-- Search -->
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search recipes..."
                variant="outlined"
                density="compact"
                clearable
                hide-details="auto"
                class="mb-3"
                @input="handleSearch"
              ></v-text-field>

              <!-- Quick Filters -->
              <div class="mb-3">
                <v-chip-group
                  v-model="selectedQuickFilter"
                  column
                  selected-class="text-white"
                >
                  <v-chip
                    v-for="filter in quickFilters"
                    :key="filter.value"
                    :value="filter.value"
                    variant="outlined"
                    color="primary"
                    size="small"
                    :prepend-icon="filter.icon"
                  >
                    {{ filter.label }}
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- Advanced Filters Row -->
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="selectedRecipeMealType"
                    :items="mealTypeOptions"
                    label="Meal Type"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="maxPrepTime"
                    :items="prepTimeOptions"
                    label="Max Prep Time"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Sort Options -->
              <div class="mt-3">
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  label="Sort by"
                  variant="outlined"
                  density="compact"
                  hide-details
                  prepend-inner-icon="mdi-sort"
                ></v-select>
              </div>
            </v-card-text>            <!-- Recipe Cards Container -->
            <v-card-text class="recipe-cards-container">
              <available-recipes-list
                :recipes="recipeStore.recipes"
                :loading="recipeStore.loading"
                :error="recipeStore.error"
                :search-query="searchQuery"
                :meal-type-filter="selectedRecipeMealType"
                :max-prep-time-filter="maxPrepTime"
                :sort-by="sortBy"
                :draggable="true"
                :show-filters="false" 
                @view-recipe="handleViewRecipe"
                @load-more="loadMorePlanningRecipes"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container><!-- Recipe Selection Dialog -->
    <v-dialog v-model="recipeSelectionDialog" width="600" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center py-4 px-6">
          <div>
            <h3 class="text-h6 mb-0">Select Recipe</h3>
            <p class="text-caption text-grey-darken-1 mb-0" v-if="selectedSlot">
              {{ formatSlotInfo(selectedSlot.date, selectedSlot.mealType) }}
            </p>
          </div>
          <v-btn icon size="small" variant="text" @click="recipeSelectionDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>        <v-card-text class="pa-4">
          <!-- Recipe List with integrated filters -->
          <available-recipes-list
            :recipes="recipeStore.recipes"
            :loading="recipeStore.loading"
            :error="recipeStore.error"
            :search-query="dialogSearchQuery"
            :draggable="false"
            :show-filters="true"
            @view-recipe="handleViewRecipe"
            @select-recipe="handleSelectRecipeFromDialog"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Schedule Recipe Dialog -->
    <v-dialog v-model="scheduleDialog" width="auto" max-width="420">
      <v-card class="pa-2">
        <v-card-title class="text-h5 pb-2">
          Schedule Recipe
        </v-card-title>
        <v-card-text class="pb-2">
          <div v-if="!authStore.isAuthenticated" class="text-center py-4">
            <v-icon icon="mdi-account-alert" size="48" color="warning" class="mb-3"></v-icon>
            <h3 class="text-h6 mb-3">Login Required</h3>
            <p class="text-body-2 text-grey-darken-1 mb-4">
              You need to be logged in to schedule recipes for meal prep.
            </p>
            <v-btn
              color="primary"
              @click="$router.push('/login')"
              prepend-icon="mdi-login"
            >
              Login Now
            </v-btn>
          </div>
          <div v-else>
            <p class="mb-4">
              Schedule "<strong>{{ selectedRecipe?.title }}</strong>" for meal prep:
            </p>
            <v-date-picker
              v-model="selectedDate"
              color="primary"
              show-adjacent-months
              :min="new Date().toISOString().split('T')[0]"
            ></v-date-picker>            <div class="mt-4">
              <v-label class="text-subtitle-2 mb-2">Meal Type</v-label>
              <v-chip-group
                v-model="selectedMealType"
                selected-class="text-white"
                mandatory
                class="mt-2"
                column
              >
                <v-chip
                  v-for="mealType in mealTypeChips"
                  :key="mealType.value"
                  :value="mealType.value"
                  variant="outlined"
                  color="primary"
                  :prepend-icon="mealType.icon"
                  class="mr-2 mb-2"
                  size="default"
                >
                  {{ mealType.title }}
                </v-chip>
              </v-chip-group>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="scheduleDialog = false">
            Cancel
          </v-btn>          <v-btn
            v-if="authStore.isAuthenticated"
            variant="flat"
            color="primary"
            @click="confirmScheduleRecipe"
            :disabled="!selectedDate || !selectedMealType"
          >
            Schedule Recipe
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessMessage"
      color="success"
      timeout="4000"
      location="top"
    >
      <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSuccessMessage = false">
          Close
        </v-btn>      </template>
    </v-snackbar>

    <!-- Recipe Detail Modal -->
    <recipe-detail-modal
      v-model="showRecipeModal"
      :recipe="selectedRecipeForModal"
      @close="closeRecipeModal"
      @schedule-recipe="handleScheduleRecipe"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRecipeStore } from '../stores/recipe.store';
import { useAuthStore } from '../stores/auth';
import { useMealPrepStore } from '../stores/meal-prep.store';
import { Recipe } from '../types/recipe';
import RecipeCard from '../components/recipes/RecipeCard.vue';
import HorizontalRecipeCard from '../components/recipes/HorizontalRecipeCard.vue';
import MealPlanningCalendar from '../components/meal-planning/MealPlanningCalendar.vue';
import RecipeDetailModal from '../components/recipes/RecipeDetailModal.vue';
import AvailableRecipesList from '../components/recipes/AvailableRecipesList.vue';

// Stores
const recipeStore = useRecipeStore();
const authStore = useAuthStore();
const mealPrepStore = useMealPrepStore();
const router = useRouter();
const route = useRoute();

// View mode state
const currentMode = ref<'browsing' | 'planning'>('planning');

// Search and filter state
const searchQuery = ref('');
const selectedDifficulty = ref<string | null>(null);
const sortBy = ref('newest');

// Enhanced filtering options
const selectedQuickFilter = ref<string | null>(null);
const selectedRecipeMealType = ref<string | null>(null);
const maxPrepTime = ref<number | null>(null);

// Pagination
const loadingMore = ref(false);
const recipesPerPage = 12;
const currentPage = ref(1);
const displayedRecipesCount = ref(10); // For planning mode

// Schedule dialog state
const scheduleDialog = ref(false);
const selectedRecipe = ref<Recipe | null>(null);
const selectedDate = ref<string>('');
const selectedMealType = ref('dinner');

// Meal planning state
interface ScheduledMeal {
  recipe: Recipe;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}
const scheduledMeals = ref<ScheduledMeal[]>([]);

// Success notification state
const showSuccessMessage = ref(false);
const successMessage = ref('');

// Recipe modal state
const showRecipeModal = ref(false);
const selectedRecipeForModal = ref<Recipe | null>(null);

// Dialog state for recipe selection
const recipeSelectionDialog = ref(false);
const dialogSearchQuery = ref('');
const selectedSlot = ref<{ date: string, mealType: string } | null>(null);

// Filter options
const difficultyOptions = [
  { title: 'Easy', value: 'easy' },
  { title: 'Medium', value: 'medium' },
  { title: 'Hard', value: 'hard' }
];

const sortOptions = [
  { title: 'Newest First', value: 'newest' },
  { title: 'Oldest First', value: 'oldest' },
  { title: 'A-Z', value: 'alphabetical' },
  { title: 'Prep Time', value: 'prepTime' },
  { title: 'Cook Time', value: 'cookTime' }
];

const mealTypes = [
  { title: 'Breakfast', value: 'breakfast' },
  { title: 'Lunch', value: 'lunch' },
  { title: 'Dinner', value: 'dinner' }
];

const mealTypeChips = [
  { title: 'Breakfast', value: 'breakfast', icon: 'mdi-coffee' },
  { title: 'Lunch', value: 'lunch', icon: 'mdi-food-apple' },
  { title: 'Dinner', value: 'dinner', icon: 'mdi-silverware-fork-knife' }
];

// Enhanced filter options
const quickFilters = [
  { label: 'Quick & Easy', value: 'quick', icon: 'mdi-clock-fast' },
  { label: 'Healthy', value: 'healthy', icon: 'mdi-heart' },
  { label: 'High Protein', value: 'protein', icon: 'mdi-dumbbell' },
  { label: 'Vegetarian', value: 'vegetarian', icon: 'mdi-leaf' },
  { label: 'Low Carb', value: 'lowcarb', icon: 'mdi-food-off' }
];

const mealTypeOptions = [
  { title: 'Breakfast', value: 'breakfast' },
  { title: 'Lunch', value: 'lunch' },
  { title: 'Dinner', value: 'dinner' },
  { title: 'Dessert', value: 'dessert' }
];

const prepTimeOptions = [
  { title: '15 min or less', value: 15 },
  { title: '30 min or less', value: 30 },
  { title: '45 min or less', value: 45 },
  { title: '1 hour or less', value: 60 },
  { title: '2 hours or less', value: 120 }
];

// Computed properties
const filteredRecipes = computed(() => {
  let recipes = [...recipeStore.recipes];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    recipes = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(query)
      )
    );
  }

  // Apply quick filter
  if (selectedQuickFilter.value) {
    switch (selectedQuickFilter.value) {
      case 'quick':
        recipes = recipes.filter(recipe => (recipe.prepTime || 0) + (recipe.cookTime || 0) <= 30);
        break;
      case 'healthy':
        recipes = recipes.filter(recipe => 
          recipe.tags?.some(tag => 
            ['healthy', 'low-fat', 'clean-eating'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
      case 'protein':
        recipes = recipes.filter(recipe => 
          recipe.tags?.some(tag => 
            ['high-protein', 'protein-rich', 'muscle-building'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
      case 'vegetarian':
        recipes = recipes.filter(recipe => 
          recipe.tags?.some(tag => 
            ['vegetarian', 'vegan', 'plant-based'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
      case 'lowcarb':
        recipes = recipes.filter(recipe => 
          recipe.tags?.some(tag => 
            ['low-carb', 'keto', 'ketogenic'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
    }
  }

  // Apply meal type filter
  if (selectedRecipeMealType.value) {
    recipes = recipes.filter(recipe => 
      recipe.tags?.some(tag => 
        tag.tag.name.toLowerCase().includes(selectedRecipeMealType.value?.toLowerCase() || '')
      )
    );
  }

  // Apply prep time filter
  if (maxPrepTime.value) {
    recipes = recipes.filter(recipe => (recipe.prepTime || 0) <= maxPrepTime.value!);
  }

  // Apply difficulty filter (would need to be added to recipe model)
  if (selectedDifficulty.value) {
    // This would need to be implemented based on recipe difficulty property
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      recipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      recipes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'alphabetical':
      recipes.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'prepTime':
      recipes.sort((a, b) => (a.prepTime || 0) - (b.prepTime || 0));
      break;
    case 'cookTime':
      recipes.sort((a, b) => (a.cookTime || 0) - (b.cookTime || 0));
      break;
  }

  // Apply pagination
  return recipes.slice(0, currentPage.value * recipesPerPage);
});

const hasMoreRecipes = computed(() => {
  return filteredRecipes.value.length < recipeStore.recipes.length;
});

// Methods
const handleSearch = () => {
  currentPage.value = 1; // Reset pagination when searching
};

const loadMoreRecipes = () => {
  loadingMore.value = true;
  setTimeout(() => {
    currentPage.value++;
    loadingMore.value = false;
  }, 500);
};

const handleScheduleRecipe = (recipe: Recipe) => {
  selectedRecipe.value = recipe;
  selectedDate.value = new Date().toISOString().split('T')[0]; // Default to today
  scheduleDialog.value = true;
};

const handleViewRecipe = (recipe: Recipe) => {
  selectedRecipeForModal.value = recipe;
  showRecipeModal.value = true;
};

const closeRecipeModal = () => {
  showRecipeModal.value = false;
  selectedRecipeForModal.value = null;
};

const confirmScheduleRecipe = () => {
  if (selectedRecipe.value && selectedDate.value && selectedMealType.value) {
    // Add recipe to meal prep schedule
    mealPrepStore.addMealPrep({
      name: selectedRecipe.value.title,
      totalPortions: selectedRecipe.value.servings || 1,
      prepDate: selectedDate.value,
      mealType: selectedMealType.value as 'breakfast' | 'lunch' | 'dinner',
      recipeId: selectedRecipe.value.id,
      ingredients: selectedRecipe.value.ingredients
    });

    // Show success message
    successMessage.value = `"${selectedRecipe.value.title}" has been scheduled for ${selectedMealType.value} on ${new Date(selectedDate.value).toLocaleDateString()}`;
    showSuccessMessage.value = true;
    
    scheduleDialog.value = false;
  }
};

// Meal planning methods
const handleMealScheduled = (recipe: Recipe, date: string, mealType: string) => {
  // Add to scheduled meals array
  scheduledMeals.value.push({
    recipe,
    date,
    mealType: mealType as 'breakfast' | 'lunch' | 'dinner'
  });
  
  successMessage.value = `"${recipe.title}" has been scheduled for ${mealType} on ${new Date(date).toLocaleDateString()}`;
  showSuccessMessage.value = true;
};

// Handle click on a meal slot to open recipe selection dialog
const handleSlotClicked = (date: string, mealType: string) => {
  selectedSlot.value = { date, mealType };
  dialogSearchQuery.value = ''; // Reset dialog search query
  recipeSelectionDialog.value = true; // Open the dialog
};

// Handle recipe selection from dialog
const handleSelectRecipeFromDialog = (recipe: Recipe) => {
  if (selectedSlot.value) {
    // Schedule the selected recipe
    handleMealScheduled(recipe, selectedSlot.value.date, selectedSlot.value.mealType);
    // Close the dialog
    recipeSelectionDialog.value = false;
    selectedSlot.value = null;
  }
};

const handleMealRemoved = (date: string, mealType: string) => {
  console.log(`Removing meal at ${date} for ${mealType}`);
  
  // Remove from scheduled meals array
  const index = scheduledMeals.value.findIndex(
    meal => meal.date === date && meal.mealType === mealType
  );
  
  console.log(`Found meal at index: ${index}`);
  
  if (index > -1) {
    const removedMeal = scheduledMeals.value.splice(index, 1)[0];
    console.log(`Removed meal from array: ${removedMeal.recipe.title}`);
    
    // Find and remove the meal from MealPrepStore
    const mealPreps = mealPrepStore.getAllMealPreps;
    console.log(`Total meal preps in store: ${mealPreps.length}`);
    
    // Get all matching meal preps (might be multiple with same criteria)
    const matchingMealPreps = mealPreps.filter(
      mp => mp.prepDate === date && mp.mealType === mealType
    );
    
    console.log(`Found ${matchingMealPreps.length} matching meal preps`);
    
    // Remove all matching meal preps
    matchingMealPreps.forEach(mealPrep => {
      console.log(`Removing mealPrep ID: ${mealPrep.id}`);
      mealPrepStore.deleteMealPrep(mealPrep.id);
    });
    
    successMessage.value = `"${removedMeal.recipe.title}" removed from ${mealType} on ${new Date(date).toLocaleDateString()}`;
    showSuccessMessage.value = true;
  } else {
    console.log(`No meal found to remove for ${date} - ${mealType}`);
  }
};

const loadMorePlanningRecipes = () => {
  displayedRecipesCount.value += 10;
};

// Handle servings updates from the meal planning calendar
const handleServingsUpdated = (date: string, mealType: string, servings: number) => {
  console.log(`RecipesView: Servings updated to ${servings} for ${mealType} on ${date}`);
  
  // Update the servings in the local scheduled meals array
  const mealIndex = scheduledMeals.value.findIndex(
    meal => meal.date === date && meal.mealType === mealType
  );
  
  if (mealIndex > -1) {
    scheduledMeals.value[mealIndex].recipe.servings = servings;
    successMessage.value = `Updated servings to ${servings} for ${scheduledMeals.value[mealIndex].recipe.title}`;
    showSuccessMessage.value = true;
  }
};

// Format slot info for dialog
const formatSlotInfo = (date: string, mealType: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateString = new Date(date).toLocaleDateString(undefined, options);
  
  return `${dateString} - ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`;
};

// Watchers
watch([selectedDifficulty, sortBy, selectedQuickFilter, selectedRecipeMealType, maxPrepTime], () => {
  currentPage.value = 1; // Reset pagination when filters change
});

// Watch authentication status - force planning mode for authenticated users, browsing for unauthenticated
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    // Default to planning mode for authenticated users
    currentMode.value = 'planning';
  } else {
    // Force browsing mode for unauthenticated users
    currentMode.value = 'browsing';
  }
}, { immediate: true });

// Watch mode changes to reset search and pagination
watch(currentMode, () => {
  searchQuery.value = '';
  currentPage.value = 1;
  displayedRecipesCount.value = 10;
  
  // Update URL path to reflect mode
  if (currentMode.value === 'planning') {
    if (route.path !== '/meals') {
      router.push('/meals');
    }
  } else {
    if (route.path !== '/recipes') {
      router.push('/recipes');
    }
  }
});

// Watch for route changes to sync mode with URL
watch(() => route.path, (path) => {
  if (path === '/meals') {
    currentMode.value = 'planning';
  } else if (path === '/recipes') {
    currentMode.value = 'browsing';
  }
}, { immediate: true });

// Lifecycle
onMounted(() => {
  recipeStore.fetchAllRecipes();
  
  // Initialize mode from URL path and authentication status
  if (route.path === '/meals') {
    currentMode.value = 'planning';
  } else if (authStore.isAuthenticated) {
    // Default to planning mode for authenticated users
    currentMode.value = 'planning';
    router.replace('/meals');
  } else {
    // Default to browsing mode for unauthenticated users
    currentMode.value = 'browsing';
    router.replace('/recipes');
  }
});
</script>

<style scoped>
.recipes-view {
  min-height: 100vh;
}

/* Planning mode specific styles */
.recipe-cards-panel {
  height: calc(100vh - 200px);
  position: sticky;
  top: 20px;
}

.recipe-cards-container {
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  padding-right: 8px;
}

.recipe-cards-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Custom scrollbar for recipe cards container */
.recipe-cards-container::-webkit-scrollbar {
  width: 6px;
}

.recipe-cards-container::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 3px;
}

.recipe-cards-container::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 3px;
}

.recipe-cards-container::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}

/* Responsive adjustments */
@media (max-width: 1264px) {
  .recipe-cards-panel {
    height: auto;
    position: static;
    margin-top: 20px;
  }
  
  .recipe-cards-container {
    max-height: 400px;
  }
}

@media (max-width: 960px) {
  .recipe-cards-container {
    max-height: 300px;
  }
}
</style>
