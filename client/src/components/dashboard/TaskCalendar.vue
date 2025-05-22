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
        <span class="text-h6">Tasks</span>
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
    </v-card-title>    <v-divider />    <!-- Calendar -->
    <div class="calendar-container pa-3">
      <!-- Legend for task and reminder indicators only -->
      <div class="meal-type-legend d-flex justify-center mb-3 flex-wrap">
        <div class="d-flex align-center mx-2 my-1">
          <div class="legend-dot task-dot mr-1" />
          <span class="text-caption">Prep Tasks</span>
        </div>
        <div class="d-flex align-center mx-2 my-1">
          <div class="legend-dot reminder-dot mr-1" />
          <span class="text-caption">Reminders</span>
        </div>        <div class="d-flex align-center mx-2 my-1">
          <div 
            class="legend-dot mr-1" 
            style="background-color: var(--v-theme-accent);"
          />
          <span class="text-caption">Leftover Meals</span>
        </div>
      </div>
      
      <!-- Weekday Headers -->
      <div class="calendar-grid">
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
              <div
                v-if="hasTasksOnDay(day)"
                class="item-dot task-dot"
              />
              <div
                v-if="hasRemindersOnDay(day)"
                class="item-dot reminder-dot"
              />
              <!-- Show leftover meal dots with their own colors -->
              <div
                v-for="meal in getLeftoverMealsForDay(day)"
                :key="meal.id + '-' + day" 
                class="item-dot"
                :style="{ backgroundColor: meal.color }"
                :title="meal.name + ' (portion ' + meal.portionNumber + ')'"
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
        </v-card-title>
        <v-card-text class="pb-2 pt-2">
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
              <v-icon
                :color="getMealTypeColor(meal.type)"
                size="small"
                class="mr-2"
              >
                {{ getMealTypeIcon(meal.type) }}
              </v-icon>
              <div>
                <div>{{ meal.name }}</div>
                <div class="text-caption text-capitalize">
                  {{ meal.type }}
                </div>
              </div>
            </div>
          </template>
          
          <!-- Tasks section -->
          <template v-if="getTasksForDay(selectedDay).length > 0">
            <div class="font-weight-medium mb-2 mt-3">
              Prep Tasks
            </div>
            <div 
              v-for="(task, idx) in getTasksForDay(selectedDay)" 
              :key="'task-'+idx" 
              class="d-flex align-center mb-2"
            >
              <v-checkbox
                v-model="task.completed"
                hide-details
                density="compact"
                color="success"
              />
              <span
                :class="{ 'text-decoration-line-through': task.completed }"
                class="ml-2"
              >
                {{ task.name }}
              </span>
            </div>
          </template>
          
          <!-- Reminders section -->
          <template v-if="getRemindersForDay(selectedDay).length > 0">
            <div class="font-weight-medium mt-3 mb-2">
              Kitchen Reminders
            </div>
            <div 
              v-for="(reminder, idx) in getRemindersForDay(selectedDay)" 
              :key="'rem-'+idx" 
              class="d-flex align-center mb-2"
            >
              <v-icon
                :color="reminder.color"
                size="small"
                class="mr-2"
              >
                {{ reminder.icon }}
              </v-icon>
              <div>
                <div>{{ reminder.title }}</div>
                <div class="text-caption">
                  {{ reminder.subtitle }}
                </div>
              </div>
            </div>
          </template>            <div
            v-if="!hasAnyItemOnDay(selectedDay)"
            class="text-center text-subtitle-2 py-3 text-medium-emphasis"
          >
            No meal or prep activities for this day
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
    </v-dialog>
    <v-divider />      <div class="today-tasks pa-3">
      <div class="mb-3">
        <span class="text-subtitle-1 font-weight-medium">Today's Food Prep</span>
      </div>
      
      <template v-if="getTodaysTasks().length > 0 || getTodaysReminders().length > 0 || getTodaysMeals().length > 0">
        <!-- Today's meals -->
        <div
          v-for="(meal, idx) in getTodaysMeals()"
          :key="'meal-'+idx"
          class="d-flex align-center mb-2"
        >
          <v-icon
            :color="getMealTypeColor(meal.type)"
            size="small"
            class="mr-2"
          >
            {{ getMealTypeIcon(meal.type) }}
          </v-icon>
          <div>
            <div>{{ meal.name }}</div>
            <div class="text-caption text-capitalize">
              {{ meal.type }}
            </div>
          </div>
        </div>

        <!-- Today's tasks -->
        <div
          v-for="(task, idx) in getTodaysTasks()"
          :key="'task-'+idx"
          class="d-flex align-center mb-2"
        >
          <v-checkbox
            v-model="task.completed"
            hide-details
            density="compact"
            color="success"
          />
          <span
            :class="{ 'text-decoration-line-through': task.completed }"
            class="ml-2"
          >
            {{ task.name }}
          </span>
        </div>
        
        <!-- Today's reminders -->
        <div
          v-for="(reminder, idx) in getTodaysReminders()"
          :key="'rem-'+idx"
          class="d-flex align-center mb-2 mt-1"
        >
          <v-icon
            :color="reminder.color"
            size="small"
            class="mr-2"
          >
            {{ reminder.icon }}
          </v-icon>
          <div>
            <div>{{ reminder.title }}</div>
            <div class="text-caption">
              {{ reminder.subtitle }}
            </div>
          </div>
        </div>
      </template>
      <div
        v-else
        class="text-center text-subtitle-2 py-2 text-medium-emphasis"
      >
        No food prep tasks scheduled for today
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

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
    };
      const hasItemsOnDay = (day: number) => {
      return hasTasksOnDay(day) || hasRemindersOnDay(day) || hasLeftoverMealsOnDay(day);
    };
    
    const hasAnyItemOnDay = (day: number) => {
      return hasTasksOnDay(day) || hasRemindersOnDay(day) || hasMealsOnDay(day);
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
    };
      // Functions to get today's tasks and reminders
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
    };
    
    // Check if there are any tasks or reminders for today
    const hasTodaysActivities = computed(() => {
      return getTodaysTasks().length > 0 || getTodaysReminders().length > 0 || getTodaysMeals().length > 0;
    });    return {
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
      activeTab,
      getTodaysTasks,
      getTodaysReminders,
      getTodaysMeals,
      hasTodaysActivities
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
</style>
