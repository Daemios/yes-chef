<template>
  <v-card class="calendar-card">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <v-icon
          start
          color="warning"
          class="mr-2"
        >
          mdi-calendar
        </v-icon>
        <span class="text-h6">Schedule</span>
      </div>
      <div class="d-flex align-center">
        <v-btn
          icon
          size="small"
          @click="prevMonth"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="text-subtitle-1 mx-2">{{ monthYearText }}</span>
        <v-btn
          icon
          size="small"
          @click="nextMonth"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </v-card-title>
    
    <v-divider />
    
    <!-- Calendar -->
    <div class="calendar-container pa-3">
      <!-- Legend for leftover meals only -->
      <div class="meal-type-legend d-flex justify-center mb-3">
        <div class="d-flex align-center mx-2 my-1">
          <div 
            class="legend-dot mr-1" 
            style="background-color: var(--v-theme-accent);"
          />
          <span class="text-caption">Leftover Meals</span>
        </div>
      </div>
      
      <!-- Weekday Headers -->      <div class="calendar-grid">
        <div
          v-for="day in weekdays"
          :key="day"
          class="weekday-header"
        >
          {{ day }}
        </div>
      
        <!-- Empty cells for days before the first of the month -->
        <div 
          v-for="i in firstDayOfMonth" 
          :key="'empty-'+i"
          class="calendar-cell empty"
        />
        <!-- Days of the month -->
        <div 
          v-for="day in daysInMonth" 
          :key="'day-'+day" 
          class="calendar-cell"
          :class="{ 
            'has-items': hasItemsOnDay(day),
            'current-day': isCurrentDay(day)
          }"
          @click="openDayDetails(day)"
        >
          <div class="day-content">
            <span class="day-number">{{ day }}</span>            <div class="indicator-container">
              <!-- Show meal dots with their own colors -->
              <div
                v-for="meal in getMealsForDay(day)"
                :key="meal.id + '-' + day" 
                class="item-dot"
                :style="{ backgroundColor: meal.color }"
                :title="meal.name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Day Details Dialog -->
    <v-dialog
      v-model="showDayDetails"
      max-width="400"
    >
      <v-card v-if="selectedDay">
        <v-card-title class="pb-1">
          {{ monthNames[currentMonth] }} {{ selectedDay }}, {{ currentYear }}
        </v-card-title>        <v-card-text class="pb-2 pt-2">
          <!-- Meal section -->
          <template v-if="getMealsForDay(selectedDay).length > 0">
            <div class="font-weight-medium mb-2">
              Meals
            </div>
            <div 
              v-for="(meal, idx) in getMealsForDay(selectedDay)" 
              :key="'meal-'+idx" 
              class="d-flex align-center mb-2"
            >
              <div 
                class="meal-color-dot mr-2" 
                :style="{ backgroundColor: meal.color }"
              />
              <div>
                <div>{{ meal.name }}</div>
                <div class="text-caption text-capitalize">
                  {{ meal.type }}
                </div>
              </div>
            </div>
          </template>
          
          <div
            v-if="getMealsForDay(selectedDay).length === 0"
            class="text-center text-subtitle-2 py-3 text-medium-emphasis"
          >
            No meals scheduled for this day
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn 
            color="primary" 
            variant="text" 
            @click="showDayDetails = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>    <v-divider />    <div class="today-tasks pa-3">
      <div class="mb-3">
        <div class="d-flex align-center">
          <v-icon
            color="warning"
            class="mr-2"
          >
            mdi-chef-hat
          </v-icon>
          <span class="text-subtitle-1 font-weight-medium">Today's Prep</span>
        </div>
      </div>
      <template v-if="getTodaysPrep.length > 0">
        <!-- Today's prep meals -->
        <div
          v-for="(meal, idx) in getTodaysPrep"
          :key="'prep-'+idx"
          class="meal-item mb-3"
        >
          <v-card
            variant="flat"
            class="meal-calendar-card"
            :style="{
              borderTop: `4px solid ${meal.color}`,
              backgroundColor: 'transparent'
            }"
          >
            <div class="meal-card-content py-3">
              <div class="d-flex align-center">
                <v-icon 
                  size="small" 
                  icon="mdi-chef-hat"
                  color="primary"
                  class="mr-2"
                />
                <div class="meal-name">
                  {{ meal.name }}
                </div>
              </div>
              <div class="text-caption text-capitalize d-flex align-center mt-1">
                <v-icon 
                  size="x-small" 
                  :icon="getMealTypeIcon(meal.type)" 
                  class="mr-1"
                />
                Prep for tomorrow's {{ meal.type }}
              </div>
            </div>
          </v-card>
        </div>
      </template>
      <div
        v-else
        class="text-center text-subtitle-2 py-2 text-medium-emphasis"
      >
        No meals to prep today
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { useMealPrepStore } from '@/stores/meal-prep.store';
import { MealPrep, CalendarMeal } from '@/types/meal-prep';

interface Task {
  name: string;
  day: string;
  completed: boolean;
  date: string;
}

interface Reminder {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  date: string;
}

interface Meal {
  id?: string;
  name: string;
  type: string;
  date: string;
  color?: string;
  portionNumber?: number;
  isLeftover?: boolean;
  needsPrep?: boolean;
  isPrepared?: boolean;
}

export default defineComponent({
  name: 'TaskCalendar',
  props: {
    tasks: {
      type: Array as PropType<Task[]>,
      required: true
    },
    reminders: {
      type: Array as PropType<Reminder[]>,
      required: true
    },
    mealPlanItems: {
      type: Array as PropType<Meal[]>,
      required: true
    }
  },
  emits: ['add-activity'],
  setup(props) {
    // Calendar data
    const currentDate = new Date();
    const currentYear = ref(currentDate.getFullYear());
    const currentMonth = ref(currentDate.getMonth());
    const currentDay = ref(currentDate.getDate());
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Calculate first day of month and days in month
    const firstDayOfMonth = computed(() => {
      const firstDay = new Date(currentYear.value, currentMonth.value, 1);
      return firstDay.getDay(); // 0-6 (Sunday-Saturday)
    });
    
    const daysInMonth = computed(() => {
      // Get the last day of the current month
      return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
    });
    
    const monthYearText = computed(() => {
      return `${monthNames[currentMonth.value]} ${currentYear.value}`;
    });
    
    // Dialog control
    const showDayDetails = ref(false);
    const selectedDay = ref<number | null>(null);
    const activeTab = ref('tasks');
    
    const openDayDetails = (day: number) => {
      selectedDay.value = day;
      showDayDetails.value = true;
    };
    
    // Navigation functions
    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
    };
    
    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
      } else {
        currentMonth.value++;
      }
    };
    
    // Task and reminder helpers
    const formatDate = (day: number) => {
      return `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };
    
    const hasTasksOnDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.tasks.some(task => task.date === dateStr);
    };
    
    const hasRemindersOnDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.reminders.some(reminder => reminder.date === dateStr);
    };    const hasMealsOnDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.mealPlanItems.some(meal => meal.date === dateStr);
    };
    
    const hasLeftoverMealsOnDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.mealPlanItems.some(meal => 
        meal.date === dateStr && meal.isLeftover === true
      );
    };
    
    const getLeftoverMealsForDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.mealPlanItems.filter(meal => 
        meal.date === dateStr && meal.isLeftover === true
      );
    };    const hasItemsOnDay = (day: number) => {
      return hasLeftoverMealsOnDay(day);
    };
      const hasAnyItemOnDay = (day: number) => {
      return hasMealsOnDay(day);
    };
    
    const getTasksForDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.tasks.filter(task => task.date === dateStr);
    };
    
    const getRemindersForDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.reminders.filter(reminder => reminder.date === dateStr);
    };
    
    const getMealsForDay = (day: number) => {
      const dateStr = formatDate(day);
      return props.mealPlanItems.filter(meal => meal.date === dateStr);
    };
    
      const isCurrentDay = (day: number) => {
      const now = new Date();
      return (
        day === currentDay.value && 
        currentMonth.value === now.getMonth() && 
        currentYear.value === now.getFullYear()
      );
    };    // Functions to get today's tasks and reminders
    const getTodaysTasks = () => {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      return props.tasks.filter(task => task.date === dateStr);
    };
    
    const getTodaysReminders = () => {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      return props.reminders.filter(reminder => reminder.date === dateStr);
    };
    
    const getTodaysMeals = () => {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      return props.mealPlanItems.filter(meal => meal.date === dateStr);
    };
    
    // Get meals that need prep today from the meal prep store
    const mealPrepStore = useMealPrepStore();
    
    // Function to get meals that need prep today
    const getTodaysPrep = computed(() => {
      // Get meals directly from the meal prep store that need preparation today
      const todaysPrepMeals = mealPrepStore.getTodaysPrep();
      
      // Format them for display
      return todaysPrepMeals.map(meal => ({
        id: meal.id,
        name: meal.name,
        type: meal.mealType || 'meal',
        date: meal.prepDate,
        color: meal.color,
        portionNumber: meal.totalPortions,
        needsPrep: true,
        isPrepared: false,
        prepMode: meal.prepMode
      }));
    });
    
    // Helper functions for meal type styling
    const getMealTypeIcon = (type: string) => {
      switch (type.toLowerCase()) {
        case 'breakfast': return 'mdi-coffee';
        case 'lunch': return 'mdi-food-apple';
        case 'dinner': return 'mdi-food';
        default: return 'mdi-silverware-fork-knife';
      }
    };
    
    const getMealTypeColor = (type: string) => {
      switch (type.toLowerCase()) {
        case 'breakfast': return 'amber-darken-2';
        case 'lunch': return 'blue';
        case 'dinner': return 'deep-purple';
        default: return 'grey';
      }
    };    // Check if there are any meals to prep today
    const hasPrepsToday = computed(() => {
      return getTodaysPrep.value.length > 0;
    });
    
    return {
      weekdays,
      monthNames,
      currentMonth,
      currentYear,
      currentDay,
      firstDayOfMonth,
      daysInMonth,
      monthYearText,
      prevMonth,
      nextMonth,      hasItemsOnDay,
      hasTasksOnDay,
      hasRemindersOnDay,
      hasMealsOnDay,
      hasLeftoverMealsOnDay,
      getLeftoverMealsForDay,
      hasAnyItemOnDay,
      getTasksForDay,
      getRemindersForDay,
      getMealsForDay,
      getMealTypeIcon,
      getMealTypeColor,
      isCurrentDay,
      showDayDetails,
      selectedDay,
      openDayDetails,
      activeTab,      getTodaysTasks,
      getTodaysReminders,
      getTodaysMeals,
      getTodaysPrep,
      hasPrepsToday,
      mealPrepStore
    };
  }
});
</script>

<style scoped>
.calendar-container {
  padding-bottom: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  width: 100%;
}

.weekday-header {
  text-align: center;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 8px 0;
  color: rgba(255, 255, 255, 0.7);
}

.calendar-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-size: 0.9rem;
  padding: 2px;
  min-height: 34px;
}

.calendar-cell:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.calendar-cell.empty {
  pointer-events: none;
}

.calendar-cell.has-items {
  font-weight: 500;
}

.calendar-cell.current-day {
  background-color: rgba(var(--v-theme-primary), 0.2);
  font-weight: bold;
  border: 2px solid var(--v-theme-primary);
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 32px;
}

.indicator-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
  margin-top: 3px;
  max-width: 100%;
  padding: 0 2px;
}

.item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--v-theme-warning);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.task-dot {
  background-color: #4CAF50; /* success green */
}

.reminder-dot {
  background-color: #2196F3; /* info blue */
}

/* Leftover meal dots will use dynamically assigned colors in :style */

.calendar-tabs {
  margin-top: 8px;
}

.today-tasks {
  background-color: rgba(var(--v-theme-surface-variant), 0.05);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.meal-type-legend {
  font-size: 0.875rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
  position: relative;
  top: 2px;
}

/* Matching color dot style with MealPlan component */
.meal-color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Meal calendar card styling */
.meal-calendar-card {
  width: 100%;
  transition: all 0.2s ease;
}

.meal-calendar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
