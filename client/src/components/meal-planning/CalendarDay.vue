<template>
  <div class="day-column">
    <!-- Day Header -->
    <div class="day-header">
      <div class="text-subtitle-2 font-weight-medium">{{ dayName }}</div>
      <div class="text-caption text-grey-darken-1">{{ date }}</div>
    </div>
    
    <!-- Meal Slots -->
    <div class="meal-slots">      <MealSlot
        v-for="mealType in mealTypes"
        :key="mealType"
        :meal-type="mealType"
        :scheduled-meal="getMealForSlot(mealType)"
        :date="dateString"        :is-drag-active="isDragActive"        @schedule-meal="(recipe, date, mealType) => emit('schedule-meal', recipe, date, mealType)"
        @remove-meal="handleRemoveMeal(mealType)"
        @click-slot="(mealType) => emit('click-slot', dateString, mealType)"
        @update-servings="(servings) => handleUpdateServings(mealType, servings)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MealSlot from './MealSlot.vue';
import { Recipe } from '../../types/recipe';

// Props
interface ScheduledMeal {
  recipe: Recipe;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

interface Props {
  dayName: string;
  date: string;
  dateString: string;
  scheduledMeals: ScheduledMeal[];
  isDragActive: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'schedule-meal': [recipe: Recipe, date: string, mealType: string];
  'remove-meal': [date: string, mealType: string];
  'click-slot': [date: string, mealType: string];
  'update-servings': [date: string, mealType: string, servings: number];
}>();

// Constants
const mealTypes: Array<'breakfast' | 'lunch' | 'dinner'> = [
  'breakfast',
  'lunch',
  'dinner'
];

// Methods
const getMealForSlot = (mealType: string): Recipe | null => {
  const meal = props.scheduledMeals.find(
    m => m.date === props.dateString && m.mealType === mealType
  );
  return meal?.recipe || null;
};

const handleRemoveMeal = (mealType: string) => {
  console.log(`CalendarDay: Removing meal for ${mealType} on ${props.dateString}`);
  emit('remove-meal', props.dateString, mealType);
};

const handleUpdateServings = (mealType: string, servings: number) => {
  console.log(`CalendarDay: Updating servings to ${servings} for ${mealType} on ${props.dateString}`);
  emit('update-servings', props.dateString, mealType, servings);
};
</script>

<style scoped>
.day-column {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  padding: 12px 8px;
}

.day-column:last-child {
  border-right: none;
}

.day-header {
  text-align: center;
  padding: 8px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
  position: sticky;
  top: 0;
  background-color: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(8px);
  z-index: 1;
}

.meal-slots {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .day-column {
    padding: 8px 4px;
  }
  
  .day-header {
    margin-bottom: 8px;
  }
}
</style>
