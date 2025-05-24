<template>
  <div 
    class="meal-slot"
    :class="[ 
      `${mealType}-slot`,
      { 
        'slot-active': isDragActive,
        'slot-has-meal': !!scheduledMeal
      }
    ]"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="meal-type-header">
      <v-icon :icon="mealTypeIcon" size="small" class="mr-1" :class="mealTypeClass"></v-icon>
      <span class="text-caption font-weight-medium">{{ mealTypeLabel }}</span>
    </div>
    
    <!-- Scheduled Meal -->
    <div 
      v-if="scheduledMeal"
      class="scheduled-meal"
    >      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <div class="meal-chip" v-bind="props">
            <span class="text-caption">{{ scheduledMeal.title }}</span>            
            <div class="servings-control">
              <v-btn 
                icon 
                size="x-small" 
                variant="text"
                @click.stop="handleDecrementServings"
                class="servings-btn"
                :disabled="servingsCount <= 1"
              >
                <v-icon size="x-small">mdi-minus</v-icon>
              </v-btn>
              <span class="text-caption servings-text">{{ servingsCount }}</span>
              <v-btn 
                icon 
                size="x-small" 
                variant="text"
                @click.stop="handleIncrementServings"
                class="servings-btn"
              >
                <v-icon size="x-small">mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-btn 
              icon 
              size="x-small" 
              variant="text"
              @click="handleRemoveClick"
              class="ml-1 remove-btn"
            >
              <v-icon size="small">mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
        <div class="meal-tooltip">
          <div class="font-weight-medium">{{ scheduledMeal.title }}</div>
          <div class="text-caption">
            {{ totalTime }} min total
            • {{ servingsCount }} servings
          </div>
        </div>
      </v-tooltip>
    </div>    <!-- Empty Slot -->
    <div v-else class="empty-slot" @click="$emit('click-slot', mealType)">
      <v-icon icon="mdi-plus" size="small" class="text-grey-lighten-2"></v-icon>
      <span class="text-caption text-grey-lighten-1 mt-1">Click or drop recipe</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Recipe } from '../../types/recipe';

// Props
interface Props {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  scheduledMeal?: Recipe | null;
  date: string;
  isDragActive: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'schedule-meal': [recipe: Recipe, date: string, mealType: string];
  'remove-meal': [];
  'click-slot': [mealType: string];
  'update-servings': [servings: number];
}>();

// Reactive state
import { ref, watch } from 'vue';
const servingsCount = ref(props.scheduledMeal?.servings || 1);

// Update servingsCount when scheduledMeal changes
watch(() => props.scheduledMeal, (newMeal) => {
  if (newMeal) {
    servingsCount.value = newMeal.servings || 1;
  }
}, { immediate: true });

// Computed
const mealTypeIcon = computed(() => {
  switch (props.mealType) {
    case 'breakfast':
      return 'mdi-coffee';
    case 'lunch':
      return 'mdi-food-apple';
    case 'dinner':
      return 'mdi-silverware-fork-knife';
    default:
      return 'mdi-food';
  }
});

const mealTypeClass = computed(() => {
  switch (props.mealType) {
    case 'breakfast':
      return 'breakfast-icon';
    default:
      return '';
  }
});

const mealTypeLabel = computed(() => {
  return props.mealType.charAt(0).toUpperCase() + props.mealType.slice(1);
});

const totalTime = computed(() => {
  if (!props.scheduledMeal) return 0;
  const prep = props.scheduledMeal.prepTime || 0;
  const cook = props.scheduledMeal.cookTime || 0;
  return prep + cook;
});

// Methods
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  console.log(`MealSlot: Drop event on ${props.mealType} for ${props.date}`);
  
  const recipeData = event.dataTransfer?.getData('application/json');
  if (recipeData) {
    try {
      const recipe: Recipe = JSON.parse(recipeData);
      console.log(`MealSlot: Scheduling recipe ${recipe.title} via drag`);
      emit('schedule-meal', recipe, props.date, props.mealType);
    } catch (error) {
      console.error('Error parsing dropped recipe data:', error);
    }
  }
};

const handleRemoveClick = (event: Event) => {
  // Prevent event bubbling which could cause other handlers to fire
  event.stopPropagation();
  console.log(`MealSlot: Remove button clicked for ${props.mealType} on ${props.date}`);
  emit('remove-meal');
};

const handleIncrementServings = (event: Event) => {
  event.stopPropagation();
  servingsCount.value++;
  console.log(`MealSlot: Servings increased to ${servingsCount.value} for ${props.mealType} on ${props.date}`);
  emit('update-servings', servingsCount.value);
};

const handleDecrementServings = (event: Event) => {
  event.stopPropagation();
  if (servingsCount.value > 1) {
    servingsCount.value--;
    console.log(`MealSlot: Servings decreased to ${servingsCount.value} for ${props.mealType} on ${props.date}`);
    emit('update-servings', servingsCount.value);
  }
};
</script>

<style scoped>
.meal-slot {
  min-height: 80px;
  border: 2px dashed rgba(var(--v-theme-primary), 0.2);
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease-in-out;
  background-color: rgba(var(--v-theme-surface), 0.8);
  position: relative;
}

.meal-slot:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  background-color: rgba(var(--v-theme-primary), 0.02);
}

.meal-slot.slot-active {
  border-color: rgba(var(--v-theme-primary), 0.6);
  background-color: rgba(var(--v-theme-primary), 0.05);
  transform: scale(1.02);
}

.meal-slot.slot-has-meal {
  border-style: solid;
  border-color: rgba(var(--v-theme-success), 0.3);
  background-color: rgba(var(--v-theme-success), 0.03);
}

.meal-type-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  opacity: 0.8;
}

.breakfast-slot {
  border-color: rgba(255, 152, 0, 0.3);
}

.breakfast-slot.slot-has-meal {
  border-color: rgba(255, 152, 0, 0.5);
  background-color: rgba(255, 152, 0, 0.05);
}

.breakfast-icon {
  color: rgb(255, 152, 0);
}

.lunch-slot {
  border-color: rgba(76, 175, 80, 0.3);
}

.lunch-slot.slot-has-meal {
  border-color: rgba(76, 175, 80, 0.5);
  background-color: rgba(76, 175, 80, 0.05);
}

.dinner-slot {
  border-color: rgba(156, 39, 176, 0.3);
}

.dinner-slot.slot-has-meal {
  border-color: rgba(156, 39, 176, 0.5);
  background-color: rgba(156, 39, 176, 0.05);
}

.scheduled-meal {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.meal-chip {
  display: flex;
  align-items: center;
  background-color: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  border-radius: 20px;
  padding: 4px 8px;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}

.meal-chip:hover {
  background-color: rgba(var(--v-theme-primary), 0.15);
  transform: scale(1.02);
}

.meal-chip span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.servings-control {
  display: flex;
  align-items: center;
  margin-left: 6px;
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
  border-radius: 12px;
  padding: 0 2px;
}

.servings-text {
  font-size: 10px;
  font-weight: 500;
  color: var(--v-theme-primary);
  min-width: 14px;
  text-align: center;
}

.servings-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
  margin: 0;
  padding: 0;
  height: 20px;
  width: 20px;
}

.servings-btn:hover {
  opacity: 1;
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.remove-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

.remove-btn:hover {
  opacity: 1;
  background-color: rgba(var(--v-theme-error), 0.1);
}

.empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  opacity: 0.6;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border-radius: 8px;
}

.meal-slot:hover .empty-slot {
  opacity: 0.8;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.meal-tooltip {
  max-width: 200px;
}
</style>
