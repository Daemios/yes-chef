<template>
  <v-card class="mb-6">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <span class="text-h6">Upcoming Meals</span>
        <span class="text-subtitle-2 text-medium-emphasis ml-2">Next 3 Days</span>
      </div>
      <div>
        <v-btn
          color="primary"
          variant="text"
          class="mr-2"
          prepend-icon="mdi-calendar-month"
        >
          View Full Week
        </v-btn>
        <v-btn
          color="primary"
          variant="text"
          prepend-icon="mdi-pencil"
        >
          Edit Plan
        </v-btn>
      </div>
    </v-card-title>
    <v-divider />
    <v-list
      ref="mealList"
      class="meal-plan-list py-2"
    >
      <div
        v-for="(day, index) in sortedMealPlan"
        :key="index"
        :ref="isToday(day.day) ? 'todaySection' : null"
      >
        <v-list-subheader 
          class="d-flex justify-space-between align-center py-3 px-4" 
          :class="{'current-day-header': isToday(day.day)}"
        >
          <div>
            <span>{{ day.day }}</span>
            <span class="text-caption text-medium-emphasis ml-2">{{ getFormattedDate(day.day) }}</span>
          </div>
          <v-chip
            v-if="isToday(day.day)"
            size="x-small"
            color="primary"
            class="ml-2"
          >
            Today
          </v-chip>
        </v-list-subheader>        <v-list-item
          density="comfortable"
          class="meal-item"
        >
          <template #prepend>
            <div class="meal-icon-container">
              <div 
                class="meal-color-dot" 
                :style="{ backgroundColor: getMealColor(day.breakfast) }"
              />
              <v-icon
                color="amber-darken-2"
                size="small"
              >
                mdi-coffee
              </v-icon>
            </div>
          </template>
          <v-list-item-title class="meal-title">
            {{ day.breakfast }}
          </v-list-item-title>
          <v-list-item-subtitle class="meal-subtitle">
            Breakfast
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          density="comfortable"
          class="meal-item"
        >
          <template #prepend>
            <div class="meal-icon-container">
              <div 
                class="meal-color-dot" 
                :style="{ backgroundColor: getMealColor(day.lunch) }"
              />
              <v-icon
                color="blue"
                size="small"
              >
                mdi-food-apple
              </v-icon>
            </div>
          </template>
          <v-list-item-title class="meal-title">
            {{ day.lunch }}
          </v-list-item-title>
          <v-list-item-subtitle class="meal-subtitle">
            Lunch
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          density="comfortable"
          class="meal-item"
        >
          <template #prepend>
            <div class="meal-icon-container">
              <div 
                class="meal-color-dot" 
                :style="{ backgroundColor: getMealColor(day.dinner) }"
              />
              <v-icon
                color="deep-purple"
                size="small"
              >
                mdi-food
              </v-icon>
            </div>
          </template>
          <v-list-item-title class="meal-title">
            {{ day.dinner }}
          </v-list-item-title>
          <v-list-item-subtitle class="meal-subtitle">
            Dinner
          </v-list-item-subtitle>
        </v-list-item>
        <v-divider
          v-if="index < sortedMealPlan.length - 1"
          class="my-2"
        />
      </div>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, nextTick, PropType } from 'vue';

interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface MealPrepItem {
  id: string;
  name: string;
  color: string;
  type: string;
  portions: number;
  prepDate: string;
  plannedDates: string[]; // Array of dates when portions will be consumed
}

export default defineComponent({
  name: 'MealPlan',
  props: {
    mealPlan: {
      type: Array as PropType<MealDay[]>,
      required: true
    }
  },
  setup(props) {
    // Helper function to check if a day is today (for highlighting)
    const isToday = (dayName: string) => {
      const today = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[today.getDay()] === dayName;
    };
    
    // Helper function to get the formatted date for a day name
    const getFormattedDate = (dayName: string) => {
      const today = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayIndex = days.indexOf(days[today.getDay()]);
      const dayIndex = days.indexOf(dayName);
      
      // Calculate the difference in days
      let daysToAdd = dayIndex - todayIndex;
      if (daysToAdd < 0) daysToAdd += 7; // Wrap to next week
      
      // Create a new date by adding the difference
      const date = new Date(today);
      date.setDate(today.getDate() + daysToAdd);
      
      // Format as "May 20"
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
    };
    
    // Sort meal plan to have today's meal first
    const sortedMealPlan = computed(() => {
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const today = new Date();
      const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
      const todayIndex = dayOrder.indexOf(todayName);
      
      // Create a new array that starts with today and wraps around
      const reorderedDays = [
        ...dayOrder.slice(todayIndex),
        ...dayOrder.slice(0, todayIndex)
      ];
      
      // Sort the meal plan based on the reordered days
      const sorted = [...props.mealPlan].sort((a, b) => {
        return reorderedDays.indexOf(a.day) - reorderedDays.indexOf(b.day);
      });
      
      // Only return today and the next two days (total of 3 days)
      return sorted.slice(0, 3);
    });
    
    // References for DOM elements
    const mealList = ref(null);
    const todaySection = ref(null);
    
    // Scroll to today's meal when component is mounted
    onMounted(() => {
      nextTick(() => {
        if (todaySection.value && todaySection.value[0]) {
          todaySection.value[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });    // Generate a consistent color for each meal based on the meal name
    const getMealColor = (mealName: string) => {
      if (!mealName) return 'transparent';
      
      // Use string hashing to generate a consistent hue value for each meal
      let hash = 0;
      for (let i = 0; i < mealName.length; i++) {
        hash = mealName.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Convert hash to a hue value (0-360)
      const hue = hash % 360;
      
      // Return HSL color with fixed saturation and lightness
      return `hsl(${hue}, 70%, 50%)`;
    };

    return {
      sortedMealPlan,
      isToday,
      getFormattedDate,
      mealList,
      todaySection,
      getMealColor
    };
  }
});
</script>

<style scoped>
.meal-plan-list {
  max-height: 400px;
  overflow-y: auto;
}

.meal-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: rgba(var(--v-theme-surface-variant), 0.4);
  margin-right: 8px;
  position: relative;
}

.meal-color-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.8);
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.meal-item {
  padding-left: 16px;
}

.meal-title {
  font-size: 0.9rem;
}

.meal-subtitle {
  font-size: 0.8rem;
  opacity: 0.7;
}

.current-day-header {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-left: 3px solid var(--v-theme-primary);
}
</style>