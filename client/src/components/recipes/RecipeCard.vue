<template>  <v-card
    elevation="2"
    hover
    :ripple="false"
  >
    <!-- Recipe Image -->
    <div class="position-relative">
      <v-img
        :src="currentImageUrl"
        :alt="recipe.title"
        height="200"
        cover
        @error="handleImageError"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="grey-lighten-4"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>
      </v-img>
      
      <!-- Overlay actions -->
      <div class="position-absolute" style="top: 8px; right: 8px;">
        <v-btn
          icon
          variant="text"
          color="white"
          size="small"
          @click="$emit('view-recipe', recipe)"
          class="mr-1"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="white"
          size="small"
          @click="$emit('schedule-recipe', recipe)"
        >
          <v-icon>mdi-calendar-plus</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Recipe Content -->
    <v-card-text class="pa-4">      <!-- Title -->
      <h3 class="text-h6 font-weight-medium mb-2" style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        {{ recipe.title }}
      </h3>

      <!-- Description -->
      <p v-if="recipe.description" class="text-body-2 text-grey-darken-1 mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        {{ recipe.description }}
      </p><!-- Recipe tags -->
      <div class="mb-3">
        <!-- Recipe Tags -->
        <template v-if="recipe.tags && recipe.tags.length > 0">
          <v-chip
            v-for="tag in recipe.tags.slice(0, 3)"
            :key="tag.id"
            size="x-small"
            color="accent"
            variant="outlined"
            class="mr-1"
          >
            {{ tag.tag.name }}
          </v-chip>
          <v-chip
            v-if="recipe.tags.length > 3"
            size="x-small"
            color="grey"
            variant="text"
            class="text-caption"
          >
            +{{ recipe.tags.length - 3 }}
          </v-chip>
        </template>
      </div>      <!-- Recipe Stats -->
      <div class="d-flex align-center gap-2 mb-3">
        <div class="d-flex align-center">
          <v-icon icon="mdi-clock-outline" size="small" class="mr-1 text-grey-darken-1"></v-icon>
          <span class="text-caption text-grey-darken-1">
            {{ totalTime }} min
          </span>
          
          <!-- Quick Recipe Badge -->
          <v-chip 
            v-if="isQuickRecipe" 
            size="x-small" 
            color="success"
            class="ml-2"
          >
            <v-icon icon="mdi-clock-fast" size="x-small" class="mr-1"></v-icon>
            Quick
          </v-chip>
        </div>
      </div>

      <!-- Nutrition Info (if available) -->
      <div v-if="recipe.nutritionInfo" class="nutrition-info mb-3">
        <v-row dense>
          <v-col cols="6">
            <div class="text-center">
              <div class="text-caption text-grey-darken-1">Calories</div>
              <div class="text-subtitle-2 font-weight-medium">
                {{ recipe.nutritionInfo.calories }}
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-center">
              <div class="text-caption text-grey-darken-1">Protein</div>
              <div class="text-subtitle-2 font-weight-medium">
                {{ recipe.nutritionInfo.protein }}g
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Author Info -->
      <div v-if="recipe.user" class="d-flex align-center mb-3">
        <v-avatar size="24" color="grey-lighten-2" class="mr-2">
          <v-img
            v-if="recipe.user.avatar"
            :src="recipe.user.avatar"
            :alt="recipe.user.name"
          ></v-img>
          <v-icon v-else icon="mdi-account" size="small"></v-icon>
        </v-avatar>
        <span class="text-caption text-grey-darken-1">
          by {{ recipe.user.name }}        </span>
      </div>
    </v-card-text>

    <!-- Action Buttons -->
    <v-card-actions class="pa-4 pt-0">
      <v-row dense>
        <v-col cols="6">
          <v-btn
            variant="outlined"
            color="primary"
            block
            @click="$emit('view-recipe', recipe)"
            prepend-icon="mdi-book-open-page-variant"
          >
            View Recipe
          </v-btn>
        </v-col>        <v-col cols="6">
          <!-- Schedule Button for Authenticated Users -->
          <v-btn
            v-if="showScheduleButton"
            variant="flat"
            color="accent"
            block
            @click="$emit('schedule-recipe', recipe)"
            prepend-icon="mdi-calendar-plus"
          >
            Schedule
          </v-btn>
          <!-- Login Prompt for Non-Authenticated Users -->
          <v-btn
            v-else
            variant="outlined"
            color="grey"
            block
            @click="$router.push('/login')"
            prepend-icon="mdi-login"
          >
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { Recipe } from '../../types/recipe';

// Props
interface Props {
  recipe: Recipe;
}

const props = defineProps<Props>();

// Emits
defineEmits<{
  'view-recipe': [recipe: Recipe];
  'schedule-recipe': [recipe: Recipe];
}>();

// Composables
const router = useRouter();
const authStore = useAuthStore();

// Reactive state for image handling
const hasImageError = ref(false);

// Computed properties
const totalTime = computed(() => {
  const prep = props.recipe.prepTime || 0;
  const cook = props.recipe.cookTime || 0;
  return prep + cook;
});

const isQuickRecipe = computed(() => {
  return totalTime.value <= 30;
});

const defaultImageUrl = computed(() => {
  // Import the healthy food bowl image as fallback
  return new URL('../../assets/images/healthy-food-bowl.jpg', import.meta.url).href;
});

const imageUrl = computed(() => {
  // Use recipe image if available and valid, otherwise use fallback
  return props.recipe.imageUrl || defaultImageUrl.value;
});

const currentImageUrl = computed(() => {
  // If there was an error loading the recipe image, use the fallback
  if (hasImageError.value || !props.recipe.imageUrl) {
    return defaultImageUrl.value;
  }
  return props.recipe.imageUrl;
});

const showScheduleButton = computed(() => {
  return authStore.isAuthenticated;
});

// Error handling for image loading
const handleImageError = () => {
  console.log('Image failed to load for recipe:', props.recipe.title);
  hasImageError.value = true;
};
</script>