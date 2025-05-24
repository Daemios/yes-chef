<template>
  <div class="available-recipes-list">
    <!-- Search and Filters -->
    <div class="filters-section mb-4" v-if="showFilters">
      <!-- Search -->
      <v-text-field
        v-model="localSearchQuery"
        prepend-inner-icon="mdi-magnify"
        label="Search recipes..."
        variant="outlined"
        density="compact"
        clearable
        hide-details="auto"
        class="mb-3"
      ></v-text-field>

      <!-- Quick Filters -->
      <div class="mb-3">
        <v-chip-group
          v-model="localSelectedQuickFilter"
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
            v-model="localMealTypeFilter"
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
            v-model="localMaxPrepTime"
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
          v-model="localSortBy"
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
          density="compact"
          hide-details
          prepend-inner-icon="mdi-sort"
        ></v-select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      ></v-progress-circular>
      <p class="text-body-2 mt-2">Loading recipes...</p>
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      density="compact"
    >
      <template v-slot:title>Error loading recipes</template>
      {{ error }}
    </v-alert>

    <!-- Empty State -->
    <div v-else-if="filteredRecipes.length === 0" class="text-center py-8">
      <v-icon icon="mdi-book-open-variant" size="48" color="grey-lighten-1"></v-icon>
      <p class="text-body-2 text-grey-darken-1 mt-2">
        {{ localSearchQuery ? 'No recipes match your search' : 'No recipes available' }}
      </p>
    </div>

    <!-- Horizontal Recipe Cards -->
    <div v-else class="recipe-cards-list">
      <horizontal-recipe-card
        v-for="recipe in filteredRecipes.slice(0, displayedRecipesCount)"
        :key="recipe.id"
        :recipe="recipe"
        :draggable="draggable"
        @view-recipe="$emit('view-recipe', recipe)"
        @select-recipe="$emit('select-recipe', recipe)"
        class="mb-3"
      />

      <!-- Load More Button -->
      <div v-if="hasMoreRecipes && displayedRecipesCount < filteredRecipes.length" class="text-center mt-4">
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          @click="loadMoreRecipes"
        >
          Load More
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import HorizontalRecipeCard from './HorizontalRecipeCard.vue';
import { Recipe } from '../../types/recipe';

// Props
interface Props {
  recipes: Recipe[];
  loading?: boolean;
  error?: string | null;
  searchQuery?: string;
  mealTypeFilter?: string | null;
  maxPrepTimeFilter?: number | null;
  sortBy?: string | null;
  draggable?: boolean;
  showFilters?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  searchQuery: '',
  mealTypeFilter: null,
  maxPrepTimeFilter: null,
  sortBy: null,
  draggable: true,
  showFilters: true
});

// Emits
defineEmits<{
  'view-recipe': [recipe: Recipe];
  'select-recipe': [recipe: Recipe];
  'load-more': [];
}>();

// Reactive state
const displayedRecipesCount = ref(10);
const localSearchQuery = ref(props.searchQuery);
const localMealTypeFilter = ref(props.mealTypeFilter);
const localMaxPrepTime = ref(props.maxPrepTimeFilter);
const localSortBy = ref(props.sortBy);
const localSelectedQuickFilter = ref<string | null>(null);

// Filter options
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

const sortOptions = [
  { title: 'Newest First', value: 'newest' },
  { title: 'Oldest First', value: 'oldest' },
  { title: 'A-Z', value: 'alphabetical' },
  { title: 'Prep Time', value: 'prepTime' },
  { title: 'Cook Time', value: 'cookTime' }
];

// Computed properties
const filteredRecipes = computed(() => {
  let filtered = [...props.recipes];
  
  // Apply search filter
  const searchQuery = localSearchQuery.value || props.searchQuery;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(recipe => 
      recipe.title.toLowerCase().includes(query) || 
      (recipe.description && recipe.description.toLowerCase().includes(query))
    );
  }
  
  // Apply quick filter
  if (localSelectedQuickFilter.value) {
    switch (localSelectedQuickFilter.value) {
      case 'quick':
        filtered = filtered.filter(recipe => (recipe.prepTime || 0) + (recipe.cookTime || 0) <= 30);
        break;
      case 'healthy':
        filtered = filtered.filter(recipe => 
          recipe.tags?.some(tag => 
            ['healthy', 'low-fat', 'clean-eating'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
      case 'protein':
        filtered = filtered.filter(recipe => 
          recipe.tags?.some(tag => 
            ['high-protein', 'protein-rich', 'muscle-building'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
      case 'vegetarian':
        filtered = filtered.filter(recipe => 
          recipe.tags?.some(tag => 
            ['vegetarian', 'vegan', 'plant-based'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
      case 'lowcarb':
        filtered = filtered.filter(recipe => 
          recipe.tags?.some(tag => 
            ['low-carb', 'keto', 'ketogenic'].includes(tag.tag.name.toLowerCase())
          )
        );
        break;
    }
  }
  
  // Apply meal type filter
  const mealTypeFilter = localMealTypeFilter.value || props.mealTypeFilter;
  if (mealTypeFilter) {
    filtered = filtered.filter(recipe => {
      if (!recipe.tags || !recipe.tags.length) return false;
      return recipe.tags.some(tag => 
        tag.tag.name.toLowerCase() === mealTypeFilter.toLowerCase()
      );
    });
  }
  
  // Apply prep time filter
  const maxPrepTime = localMaxPrepTime.value || props.maxPrepTimeFilter;
  if (maxPrepTime) {
    filtered = filtered.filter(recipe => {
      const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
      return totalTime <= maxPrepTime;
    });
  }
  
  // Apply sorting
  const sortBy = localSortBy.value || props.sortBy;
  if (sortBy) {
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'prepTime':
        filtered.sort((a, b) => (a.prepTime || 0) - (b.prepTime || 0));
        break;
      case 'cookTime':
        filtered.sort((a, b) => (a.cookTime || 0) - (b.cookTime || 0));
        break;
    }
  }
  
  return filtered;
});

const hasMoreRecipes = computed(() => {
  return displayedRecipesCount.value < filteredRecipes.value.length;
});

// Methods
function loadMoreRecipes() {
  displayedRecipesCount.value += 10;
}

// Reset displayed count when filters change
watch([
  localSearchQuery,
  localSelectedQuickFilter,
  localMealTypeFilter,
  localMaxPrepTime,
  localSortBy
], () => {
  displayedRecipesCount.value = 10;
});

// Sync props with local state when props change
watch(() => props.searchQuery, (val) => {
  localSearchQuery.value = val;
});

watch(() => props.mealTypeFilter, (val) => {
  localMealTypeFilter.value = val;
});

watch(() => props.maxPrepTimeFilter, (val) => {
  localMaxPrepTime.value = val;
});

watch(() => props.sortBy, (val) => {
  localSortBy.value = val;
});
</script>

<style scoped>
.recipe-cards-list {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom scrollbar styling */
.recipe-cards-list::-webkit-scrollbar {
  width: 6px;
}

.recipe-cards-list::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 10px;
}

.recipe-cards-list::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 10px;
}

.recipe-cards-list::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>
