<template>
  <v-card class="meal-planning-calendar" elevation="2">
    <v-card-title class="d-flex justify-space-between align-center py-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-calendar-month" class="mr-3" color="primary" size="large"></v-icon>
        <div>
          <h2 class="text-h6 mb-0">Meal Planning Calendar</h2>
          <p class="text-caption text-grey-darken-1 mb-0">Drag recipes to schedule your meals</p>
        </div>
      </div>
      <div class="d-flex align-center gap-2">
        <v-chip color="success" size="small" variant="outlined">
          {{ totalScheduledMeals }} meals planned
        </v-chip>
        <v-divider vertical class="mx-2"></v-divider>
        <v-btn icon size="small" @click="prevWeek" variant="text">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="text-subtitle-1 font-weight-medium mx-3">{{ weekText }}</span>
        <v-btn icon size="small" @click="nextWeek" variant="text">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn icon size="small" @click="goToCurrentWeek" variant="text" color="primary">
          <v-icon>mdi-calendar-today</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-0">
      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <CalendarDay
          v-for="day in weekDays"
          :key="day.dateString"
          :day-name="day.dayName"
          :date="day.date"
          :date-string="day.dateString"
          :scheduled-meals="scheduledMeals"
          :is-drag-active="isDragActive"
          @schedule-meal="handleScheduleMeal"
          @remove-meal="removeMeal"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMealPrepStore } from '../../stores/meal-prep.store';
import { Recipe } from '../../types/recipe';
import CalendarDay from './CalendarDay.vue';

// Props
interface ScheduledMeal {
  recipe: Recipe;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const props = defineProps<{
  scheduledMeals?: ScheduledMeal[];
}>();

const emit = defineEmits<{
  mealScheduled: [recipe: Recipe, date: string, mealType: string];
  mealRemoved: [date: string, mealType: string];
}>();

// Stores
const mealPrepStore = useMealPrepStore();

// State
const currentWeekStart = ref(new Date());
const isDragActive = ref(false);
const scheduledMeals = ref<ScheduledMeal[]>(props.scheduledMeals || []);

// Computed
const weekDays = computed(() => {
  const days: Array<{
    dayName: string;
    date: string;
    dateString: string;
    fullDate: Date;
  }> = [];
  const startDate = new Date(currentWeekStart.value);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    days.push({
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      dateString: date.toISOString().split('T')[0],
      fullDate: date
    });
  }
  
  return days;
});

const weekText = computed(() => {
  const start = new Date(currentWeekStart.value);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  } else {
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${start.getFullYear()}`;
  }
});

const totalScheduledMeals = computed(() => {
  return scheduledMeals.value.length;
});

// Methods
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // First day is Sunday (0)
  return new Date(d.setDate(diff));
};

const prevWeek = () => {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 7);
  currentWeekStart.value = newDate;
};

const nextWeek = () => {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 7);
  currentWeekStart.value = newDate;
};

const goToCurrentWeek = () => {
  currentWeekStart.value = getStartOfWeek(new Date());
};

const getMealForSlot = (date: string, mealType: string): Recipe | null => {
  const meal = scheduledMeals.value.find(
    m => m.date === date && m.mealType === mealType
  );
  return meal?.recipe || null;
};

const handleScheduleMeal = (recipe: Recipe, date: string, mealType: string) => {
  // Remove existing meal in this slot if any
  removeMeal(date, mealType);
  
  // Add new meal
  scheduledMeals.value.push({
    recipe,
    date,
    mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack'
  });
  
  // Add to meal prep store
  mealPrepStore.addMealPrep({
    name: recipe.title,
    mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    prepDate: date,
    totalPortions: recipe.servings || 1,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    recipeId: recipe.id
  });
  
  emit('mealScheduled', recipe, date, mealType);
};

const handleDrop = (event: DragEvent, date: string, mealType: string) => {
  event.preventDefault();
  isDragActive.value = false;
  
  const recipeData = event.dataTransfer?.getData('application/json');
  if (recipeData) {
    try {
      const recipe: Recipe = JSON.parse(recipeData);
      handleScheduleMeal(recipe, date, mealType);
    } catch (error) {
      console.error('Error parsing dropped recipe data:', error);
    }
  }
};

const removeMeal = (date: string, mealType: string) => {
  const index = scheduledMeals.value.findIndex(
    m => m.date === date && m.mealType === mealType
  );
  
  if (index > -1) {
    scheduledMeals.value.splice(index, 1);
    emit('mealRemoved', date, mealType);
  }
};

// Global drag event listeners
const handleGlobalDragEnter = () => {
  isDragActive.value = true;
};

const handleGlobalDragLeave = (event: DragEvent) => {
  // Only set to false if we're leaving the entire calendar area
  if (!event.relatedTarget || !(event.target as Element)?.closest('.meal-planning-calendar')) {
    isDragActive.value = false;
  }
};

const handleGlobalDrop = () => {
  isDragActive.value = false;
};

// Lifecycle
onMounted(() => {
  // Set to start of current week
  currentWeekStart.value = getStartOfWeek(new Date());
  
  // Add global drag event listeners
  document.addEventListener('dragenter', handleGlobalDragEnter);
  document.addEventListener('dragleave', handleGlobalDragLeave);
  document.addEventListener('drop', handleGlobalDrop);
});

onUnmounted(() => {
  // Remove global drag event listeners
  document.removeEventListener('dragenter', handleGlobalDragEnter);
  document.removeEventListener('dragleave', handleGlobalDragLeave);
  document.removeEventListener('drop', handleGlobalDrop);
});
</script>

<style scoped>
.meal-planning-calendar {
  width: 100%;
  height: fit-content;
  border-radius: 12px;
}

.gap-2 {
  gap: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.calendar-header {
  background-color: rgba(var(--v-theme-primary), 0.1);
  padding: 12px 8px;
  text-align: center;
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  font-weight: 500;
}

.day-column {
  background-color: rgb(var(--v-theme-surface));
  display: flex;
  flex-direction: column;
}

.meal-slot {
  min-height: 90px;
  padding: 8px 6px;
  border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.5);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.meal-slot:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  transform: translateY(-1px);
}

.meal-slot.slot-active {
  background-color: rgba(var(--v-theme-primary), 0.15);
  border: 2px dashed rgb(var(--v-theme-primary));
  transform: scale(1.02);
}

.meal-slot.slot-has-meal {
  background-color: rgba(var(--v-theme-success), 0.05);
}

.meal-type-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  opacity: 0.9;
}

.breakfast-icon {
  color: #FF9800;
}

.scheduled-meal {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.meal-chip {
  background-color: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  border-radius: 16px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  min-height: 32px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.meal-chip:hover {
  background-color: rgba(var(--v-theme-primary), 0.18);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.meal-chip span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  font-weight: 500;
}

.remove-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
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
  height: 100%;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.empty-slot:hover {
  opacity: 0.8;
}

.meal-tooltip {
  text-align: center;
}

/* Meal type specific styling */
.breakfast-slot .meal-chip {
  background-color: rgba(255, 152, 0, 0.12);
  border-color: rgba(255, 152, 0, 0.3);
}

.lunch-slot .meal-chip {
  background-color: rgba(76, 175, 80, 0.12);
  border-color: rgba(76, 175, 80, 0.3);
}

.dinner-slot .meal-chip {
  background-color: rgba(103, 58, 183, 0.12);
  border-color: rgba(103, 58, 183, 0.3);
}

.snack-slot .meal-chip {
  background-color: rgba(255, 87, 34, 0.12);
  border-color: rgba(255, 87, 34, 0.3);
}

/* Responsive design */
@media (max-width: 960px) {
  .calendar-header {
    padding: 8px 4px;
  }
  
  .meal-slot {
    min-height: 70px;
    padding: 6px 4px;
  }
  
  .meal-chip {
    padding: 4px 6px;
    font-size: 0.75rem;
    min-height: 28px;
  }
}

@media (max-width: 600px) {
  .calendar-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
  }
  
  .calendar-header {
    padding: 6px 2px;
    font-size: 0.75rem;
  }
  
  .meal-slot {
    min-height: 60px;
    padding: 4px 2px;
  }
  
  .meal-chip {
    padding: 2px 4px;
    border-radius: 12px;
  }
  
  .empty-slot span {
    display: none;
  }
}
</style>
