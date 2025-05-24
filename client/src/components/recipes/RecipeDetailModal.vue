<template>
  <v-dialog
    v-model="isOpen"
    max-width="800px"
    scrollable
    @update:model-value="handleClose"
  >
    <v-card v-if="recipe" class="recipe-detail-modal">
      <!-- Close button -->
      <v-btn
        icon
        variant="text"
        color="grey-darken-1"
        class="position-absolute"
        style="top: 16px; right: 16px; z-index: 1;"
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <!-- Recipe Image -->
      <v-img
        :src="recipeImageUrl"
        height="300"
        cover
        gradient="to top, rgba(0,0,0,0.6) 0%, transparent 100%"
        @error="handleImageError"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </template>
      </v-img>
      
      <!-- Recipe Content -->
      <v-card-text class="pa-6">
        <!-- Title -->
        <h2 class="text-h4 mb-4 font-weight-light">
          {{ recipe.title }}
        </h2>
        
        <!-- Tags -->
        <v-chip-group class="mb-4" v-if="recipe.tags && recipe.tags.length > 0">
          <v-chip 
            v-for="tagItem in recipe.tags" 
            :key="tagItem.tag.id" 
            color="accent"
            size="small"
            variant="outlined"
          >
            {{ tagItem.tag.name }}
          </v-chip>
        </v-chip-group>
        
        <!-- Description -->
        <p class="text-subtitle-1 mb-4 font-italic bg-grey-lighten-4 pa-3 rounded">
          {{ recipe.description || 'A nutritionally balanced meal plan designed for your health goals.' }}
        </p>
        
        <!-- Recipe Stats -->
        <v-row class="mb-4">
          <v-col cols="4">
            <div class="text-center bg-grey-lighten-5 pa-3 rounded">
              <div class="text-overline text-primary">Calories</div>
              <div class="text-h6">
                <v-icon icon="mdi-fire" size="small" class="mr-1"></v-icon>
                {{ recipe.nutritionInfo?.calories || '450' }} kcal
              </div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-center bg-grey-lighten-5 pa-3 rounded">
              <div class="text-overline text-primary">Total Time</div>
              <div class="text-h6">
                <v-icon icon="mdi-clock-outline" size="small" class="mr-1"></v-icon>
                {{ totalTime }} min
              </div>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-center bg-grey-lighten-5 pa-3 rounded">
              <div class="text-overline text-primary">Servings</div>
              <div class="text-h6">
                <v-icon icon="mdi-silverware-fork-knife" size="small" class="mr-1"></v-icon>
                {{ recipe.servings || '2' }}
              </div>
            </div>
          </v-col>
        </v-row>
        
        <v-divider class="my-4"></v-divider>
        
        <!-- Ingredients -->
        <h3 class="text-h6 mb-3 font-weight-medium text-primary">
          <v-icon icon="mdi-food-variant" class="mr-2"></v-icon>
          Ingredients
        </h3>
        <v-card class="mb-4 pa-3" variant="outlined">
          <v-list density="compact" class="pa-0">
            <v-list-item
              v-for="(ingredient, i) in recipe.ingredients" 
              :key="i"
              prepend-icon="mdi-circle-small"
              class="px-0"
            >
              {{ ingredient }}
            </v-list-item>
          </v-list>
        </v-card>
        
        <!-- Instructions -->
        <h3 class="text-h6 mb-3 font-weight-medium text-primary">
          <v-icon icon="mdi-chef-hat" class="mr-2"></v-icon>
          Instructions
        </h3>
        <v-card class="mb-4 pa-3" variant="outlined">
          <p class="text-pre-wrap">{{ recipe.instructions }}</p>
        </v-card>

        <!-- Nutritional Information -->
        <h3 class="text-h6 mb-3 font-weight-medium text-primary">
          <v-icon icon="mdi-nutrition" class="mr-2"></v-icon>
          Nutritional Information
        </h3>
        <v-card class="mb-4 pa-3" variant="outlined">
          <v-row v-if="recipe.nutritionInfo">
            <v-col cols="6" sm="3">
              <div class="text-overline text-primary">Protein</div>
              <div class="text-body-1">{{ recipe.nutritionInfo.protein }}g</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-primary">Carbs</div>
              <div class="text-body-1">{{ recipe.nutritionInfo.carbs }}g</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-primary">Fat</div>
              <div class="text-body-1">{{ recipe.nutritionInfo.fat }}g</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-overline text-primary">Fiber</div>
              <div class="text-body-1">{{ recipe.nutritionInfo.fiber }}g</div>
            </v-col>
          </v-row>
          <div v-else class="text-grey-darken-1">
            Nutritional information not available
          </div>
        </v-card>
      </v-card-text>

      <!-- Action Buttons -->
      <v-card-actions class="pa-6 pt-0">
        <v-row>
          <v-col cols="6">
            <v-btn
              variant="outlined"
              color="grey"
              block
              @click="$emit('close')"
            >
              Close
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              variant="flat"
              color="accent"
              block
              @click="$emit('schedule-recipe', recipe)"
              prepend-icon="mdi-calendar-plus"
            >
              Schedule Recipe
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Recipe } from '../../types/recipe';

// Props
interface Props {
  modelValue: boolean;
  recipe: Recipe | null;
}

const props = defineProps<Props>();

// Emits
const $emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'close': [];
  'schedule-recipe': [recipe: Recipe];
}>();

// Reactive state
const hasImageError = ref(false);

// Computed properties
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      handleClose();
    }
  }
});

const defaultImageUrl = computed(() => {
  return new URL('../../assets/images/healthy-food-bowl.jpg', import.meta.url).href;
});

const recipeImageUrl = computed(() => {
  if (hasImageError.value || !props.recipe?.imageUrl) {
    return defaultImageUrl.value;
  }
  return props.recipe.imageUrl;
});

const totalTime = computed(() => {
  if (!props.recipe) return 0;
  const prep = props.recipe.prepTime || 0;
  const cook = props.recipe.cookTime || 0;
  return prep + cook;
});

// Methods
const handleImageError = () => {
  hasImageError.value = true;
};

const handleClose = () => {
  hasImageError.value = false; // Reset image error state
  $emit('close');
};
</script>

<style scoped>
.recipe-detail-modal {
  max-height: 90vh;
}

.text-pre-wrap {
  white-space: pre-wrap;
}
</style>
