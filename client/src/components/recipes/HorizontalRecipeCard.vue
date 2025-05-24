<template>  <v-card
    class="horizontal-recipe-card"
    elevation="1"
    :draggable="draggable"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="handleCardClick"
    :class="{ 'selectable': !draggable }"
  >
    <div class="d-flex align-center">      <!-- Recipe Image -->
      <v-img
        :src="currentImageUrl"
        :alt="recipe.title"
        height="90"
        width="120"
        cover
        class="recipe-image flex-shrink-0"
        @error="handleImageError"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="grey-lighten-4"
              indeterminate
              size="20"
            ></v-progress-circular>
          </div>
        </template>
          <!-- Empty image overlay -->
        <div class="image-overlay">
        </div>
      </v-img>

      <!-- Recipe Info -->
      <div class="flex-grow-1 pa-3">
        <div class="d-flex justify-space-between align-start">
          <div class="flex-grow-1 mr-2">
            <!-- Title -->
            <h4 class="text-subtitle-1 font-weight-medium mb-1 line-clamp-1">
              {{ recipe.title }}
            </h4>

            <!-- Description -->
            <p v-if="recipe.description" class="text-caption text-grey-darken-1 mb-2 line-clamp-2">
              {{ recipe.description }}
            </p>            <!-- Stats Row -->
            <div class="d-flex align-center gap-3 mb-2">
              <div class="d-flex align-center">
                <v-icon icon="mdi-clock-outline" size="small" class="mr-1 text-grey-darken-1"></v-icon>
                <span class="text-caption text-grey-darken-1 font-weight-medium">
                  {{ totalTime }} min
                </span>
                <!-- Quick Recipe Badge -->
                <v-chip 
                  v-if="isQuickRecipe" 
                  size="x-small" 
                  color="success" 
                  class="text-caption ml-2"
                >
                  <v-icon icon="mdi-clock-fast" size="x-small" class="mr-1"></v-icon>
                  Quick
                </v-chip>
              </div>
              <div v-if="recipe.nutritionInfo" class="d-flex align-center">
                <v-icon icon="mdi-fire" size="small" class="mr-1 text-grey-darken-1"></v-icon>
                <span class="text-caption text-grey-darken-1 font-weight-medium">
                  {{ recipe.nutritionInfo.calories }}
                </span>
              </div>
            </div>            <!-- Tags and Badges -->
            <div class="d-flex gap-1 flex-wrap">
              
              <!-- Recipe Tags -->
              <template v-if="recipe.tags && recipe.tags.length > 0">
                <v-chip
                  v-for="tag in recipe.tags.slice(0, 2)"
                  :key="tag.id"
                  size="x-small"
                  color="primary"
                  variant="outlined"
                  class="text-caption"
                >
                  {{ tag.tag.name }}
                </v-chip>
                <v-chip
                  v-if="recipe.tags.length > 2"
                  size="x-small"
                  color="grey"
                  variant="text"
                  class="text-caption"
                >
                  +{{ recipe.tags.length - 2 }}
                </v-chip>
              </template>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex-shrink-0 d-flex flex-column gap-1">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="$emit('view-recipe', recipe)"
              class="action-btn"
            >
              <v-icon>mdi-eye</v-icon>
              <v-tooltip activator="parent" location="top">View Recipe</v-tooltip>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              @click="toggleFavorite"
              class="action-btn"
              :color="isFavorite ? 'red' : 'grey'"
            >
              <v-icon>{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
              <v-tooltip activator="parent" location="top">
                {{ isFavorite ? 'Remove from favorites' : 'Add to favorites' }}
              </v-tooltip>
            </v-btn>
          </div>
        </div>
      </div>      <!-- Drag Handle - Only visible when card is draggable -->
      <div v-if="draggable" class="drag-handle pa-2">
        <v-icon icon="mdi-drag-horizontal" color="grey-lighten-1" size="small"></v-icon>
        <div class="drag-hint text-caption text-grey-lighten-1">Drag</div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Recipe } from '../../types/recipe';

// Props
interface Props {
  recipe: Recipe;
  draggable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  draggable: true
});

// Emits
const emit = defineEmits<{
  'view-recipe': [recipe: Recipe];
  'drag-start': [recipe: Recipe];
  'drag-end': [recipe: Recipe];
  'select-recipe': [recipe: Recipe];
}>();

// Reactive state for image handling
const hasImageError = ref(false);
const isFavorite = ref(false);

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
  return new URL('../../assets/images/healthy-food-bowl.jpg', import.meta.url).href;
});

const currentImageUrl = computed(() => {
  if (hasImageError.value || !props.recipe.imageUrl) {
    return defaultImageUrl.value;
  }
  return props.recipe.imageUrl;
});

// Drag and drop handlers
const handleDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(props.recipe));
    event.dataTransfer.effectAllowed = 'copy';
  }
};

const handleDragEnd = () => {
  // Clean up any drag state if needed
};

// Error handling for image loading
const handleImageError = () => {
  console.log('Image failed to load for recipe:', props.recipe.title);
  hasImageError.value = true;
};

// Favorite handling
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  // TODO: Implement favorite functionality with user store
};

// Handle card click for selection
const handleCardClick = () => {
  if (!props.draggable) {
    // Only emit select-recipe when card is not draggable (dialog mode)
    emit('select-recipe', props.recipe);
  }
};
</script>

<style scoped>
.horizontal-recipe-card {
  cursor: grab;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.selectable {
  cursor: pointer;
}

.horizontal-recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3);
}



.horizontal-recipe-card:active {
  cursor: grabbing;
  transform: translateY(0);
}

.recipe-image {
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.image-overlay {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 1;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.1);
}

.drag-handle {
  cursor: grab;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  transition: all 0.2s ease;
}



.drag-hint {
  margin-top: 2px;
  font-size: 0.6rem;
  text-align: center;
}

.gap-3 {
  gap: 0.75rem;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .horizontal-recipe-card {
    border-radius: 8px;
  }
  
  .recipe-image {
    height: 70px !important;
    width: 70px !important;
  }
  
  .drag-handle {
    min-width: 36px;
  }
  
  .drag-hint {
    display: none;
  }
  
  .action-btn {
    transform: scale(0.9);
  }
}
</style>
