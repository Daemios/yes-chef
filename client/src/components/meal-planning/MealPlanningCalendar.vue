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
        <v-divider vertical class="mx-2"></v-divider>        <v-btn icon size="small" @click="prevPeriod" variant="text" title="Previous 4 days">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="text-subtitle-1 font-weight-medium mx-3">{{ periodText }}</span>
        <v-btn icon size="small" @click="nextPeriod" variant="text" title="Next 4 days">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn icon size="small" @click="goToCurrentPeriod" variant="text" color="primary" title="Go to current period">
          <v-icon>mdi-calendar-today</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-0">
      <!-- Calendar Grid -->
      <div class="calendar-grid">        <CalendarDay
          v-for="day in weekDays"
          :key="day.dateString"
          :day-name="day.dayName"
          :date="day.date"
          :date-string="day.dateString"
          :scheduled-meals="scheduledMeals"
          :is-drag-active="isDragActive"          @schedule-meal="handleScheduleMeal"
          @remove-meal="removeMeal"
          @click-slot="handleSlotClick"
          @update-servings="handleUpdateServings"
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
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const props = defineProps<{
  scheduledMeals?: ScheduledMeal[];
}>();

const emit = defineEmits<{
  mealScheduled: [recipe: Recipe, date: string, mealType: string];
  mealRemoved: [date: string, mealType: string];
  slotClicked: [date: string, mealType: string];
  servingsUpdated: [date: string, mealType: string, servings: number];
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
  
  // Show 4 days by default for better spacing
  for (let i = 0; i < 4; i++) {
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

const periodText = computed(() => {
  const start = new Date(currentWeekStart.value);
  const end = new Date(start);
  end.setDate(start.getDate() + 3); // Show 4 days
  
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
const getStartOfPeriod = (date: Date): Date => {
  // For 4-day view, start from today or the most recent Monday
  const d = new Date(date);
  const day = d.getDay();
  
  // If it's Monday-Thursday, start from Monday
  // If it's Friday-Sunday, start from Friday for better planning
  if (day >= 1 && day <= 4) { // Monday to Thursday
    const diff = d.getDate() - (day - 1); // Start from Monday
    return new Date(d.setDate(diff));
  } else { // Friday, Saturday, Sunday
    const diff = day === 0 ? d.getDate() - 2 : d.getDate() - (day - 5); // Start from Friday
    return new Date(d.setDate(diff));
  }
};

const prevPeriod = () => {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 4); // Move by 4 days
  currentWeekStart.value = newDate;
};

const nextPeriod = () => {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 4); // Move by 4 days
  currentWeekStart.value = newDate;
};

const goToCurrentPeriod = () => {
  currentWeekStart.value = getStartOfPeriod(new Date());
};

const handleScheduleMeal = (recipe: Recipe, date: string, mealType: string) => {
  console.log(`Scheduling meal ${recipe.title} for ${date} - ${mealType}`);
  
  // Remove existing meal in this slot if any
  removeMeal(date, mealType);
  
  // Add new meal
  scheduledMeals.value.push({
    recipe,
    date,
    mealType: mealType as 'breakfast' | 'lunch' | 'dinner'
  });
  // Add to meal prep store
  const mealPrep = mealPrepStore.addMealPrep({
    name: recipe.title,
    mealType: mealType as 'breakfast' | 'lunch' | 'dinner',
    prepDate: date,
    totalPortions: recipe.servings || 1,
    ingredients: recipe.ingredients,
    recipeId: recipe.id
  });
  
  console.log(`Added meal prep with ID: ${mealPrep.id}`);
  
  emit('mealScheduled', recipe, date, mealType);
};

const removeMeal = (date: string, mealType: string) => {
  console.log(`MealPlanningCalendar: Removing meal at ${date} for ${mealType}`);
  
  // Remove from internal scheduledMeals array
  const index = scheduledMeals.value.findIndex(
    meal => meal.date === date && meal.mealType === mealType
  );
  
  if (index > -1) {
    const removedMeal = scheduledMeals.value.splice(index, 1)[0];
    console.log(`MealPlanningCalendar: Removed internal meal: ${removedMeal.recipe.title}`);
  }
  
  emit('mealRemoved', date, mealType);
};

// New handler for slot clicks
const handleSlotClick = (date: string, mealType: string) => {
  emit('slotClicked', date, mealType);
};

// Handler for servings updates
const handleUpdateServings = (date: string, mealType: string, servings: number) => {
  console.log(`MealPlanningCalendar: Updating servings to ${servings} for ${mealType} on ${date}`);
  
  // Update local scheduled meals
  const mealIndex = scheduledMeals.value.findIndex(
    meal => meal.date === date && meal.mealType === mealType
  );
  
  if (mealIndex > -1) {
    // Update the servings in the local recipe object
    scheduledMeals.value[mealIndex].recipe.servings = servings;
    
    // Find meal prep in store to update
    const mealPreps = mealPrepStore.getAllMealPreps;
    const matchingMealPrep = mealPreps.find(
      mp => mp.prepDate === date && mp.mealType === mealType
    );
    
    if (matchingMealPrep) {
      // Update meal prep in store with new number of servings/portions
      mealPrepStore.updateMealPrepServings(matchingMealPrep.id, servings);
    }
    
    emit('servingsUpdated', date, mealType, servings);
  }
};

// Drag events
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
  // Set to start of current period (4 days)
  currentWeekStart.value = getStartOfPeriod(new Date());
  
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
  grid-template-columns: repeat(4, 1fr); /* Default to 4 days for better spacing */
  min-height: 600px;
  background-color: rgba(var(--v-theme-surface), 1);
}

@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: repeat(2, 1fr);
    min-height: 800px;
  }
}

@media (max-width: 600px) {
  .calendar-grid {
    grid-template-columns: 1fr;
    min-height: 1200px;
  }
}
</style>