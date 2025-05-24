<template>
  <v-card class="meal-plan-card mb-6">
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
    
    <!-- Restructured meals layout with meal types on left -->
    <div class="meal-plan-grid">
      <!-- Header row with days -->
      <div class="grid-header">
        <div class="meal-type-header">
          <!-- Empty corner cell -->
        </div>
        <div 
          v-for="(day, index) in sortedMealPlan" 
          :key="index"
          class="day-header-cell"
          :class="{'current-day': isToday(day.day)}"
        >
          <div class="text-body-1 font-weight-medium">
            {{ day.day }}
          </div>
          <div class="d-flex align-center justify-center">
            <div class="text-no-wrap text-caption text-medium-emphasis mr-2">
              {{ getFormattedDate(day.day) }}
            </div>
            <v-chip
              v-if="isToday(day.day)"
              size="x-small"
              color="primary"
              class="flex-shrink-0"
              density="compact"
            >
              Today
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Breakfast row -->
      <div class="meal-type-row" :ref="hasCurrentDayBreakfast() ? setTodaySection : undefined">
        <div class="meal-type-label-cell">
          <div class="meal-type-label">
            <v-icon size="small" class="mr-2">mdi-coffee</v-icon>
            <span class="text-body-1 font-weight-medium">Breakfast</span>
          </div>
        </div>
        <div 
          v-for="(day, index) in sortedMealPlan" 
          :key="'breakfast-' + index"
          class="meal-cell"
          :class="{'current-day-cell': isToday(day.day)}"
        >
          <UpcomingMeal
            :meal-name="day.breakfast"
            :day-name="day.day"
            meal-type="breakfast"
            :color="getMealColor(day.breakfast)"
            :needs-prep="mealNeedsPrep(day.breakfast, day.day)"
            :is-prepared="mealIsPrepared(day.breakfast, day.day)"
            :leftovers="getMealLeftovers(day.breakfast)"
          />
        </div>
      </div>

      <!-- Lunch row -->
      <div class="meal-type-row">
        <div class="meal-type-label-cell">
          <div class="meal-type-label">
            <v-icon size="small" class="mr-2">mdi-food-apple</v-icon>
            <span class="text-body-1 font-weight-medium">Lunch</span>
          </div>
        </div>
        <div 
          v-for="(day, index) in sortedMealPlan" 
          :key="'lunch-' + index"
          class="meal-cell"
          :class="{'current-day-cell': isToday(day.day)}"
        >
          <UpcomingMeal
            :meal-name="day.lunch"
            :day-name="day.day"
            meal-type="lunch"
            :color="getMealColor(day.lunch)"
            :needs-prep="mealNeedsPrep(day.lunch, day.day)"
            :is-prepared="mealIsPrepared(day.lunch, day.day)"
            :leftovers="getMealLeftovers(day.lunch)"
          />
        </div>
      </div>

      <!-- Dinner row -->
      <div class="meal-type-row">
        <div class="meal-type-label-cell">
          <div class="meal-type-label">
            <v-icon size="small" class="mr-2">mdi-food</v-icon>
            <span class="text-body-1 font-weight-medium">Dinner</span>
          </div>
        </div>
        <div 
          v-for="(day, index) in sortedMealPlan" 
          :key="'dinner-' + index"
          class="meal-cell"
          :class="{'current-day-cell': isToday(day.day)}"
        >
          <UpcomingMeal
            :meal-name="day.dinner"
            :day-name="day.day"
            meal-type="dinner"
            :color="getMealColor(day.dinner)"
            :needs-prep="mealNeedsPrep(day.dinner, day.day)"
            :is-prepared="mealIsPrepared(day.dinner, day.day)"
            :leftovers="getMealLeftovers(day.dinner)"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, nextTick, PropType } from 'vue';
import { useMealPrepStore } from '../../stores/meal-prep.store';
import UpcomingMeal from './UpcomingMeal.vue';

interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  needsPrep?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  isPrepared?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
}

export default defineComponent({
  name: 'MealPlan',
  components: {
    UpcomingMeal
  },
  props: {
    mealPlan: {
      type: Array as PropType<MealDay[]>,
      required: true
    }
  },  setup(props) {
    // Meal type icons
    const mealIcons = ['mdi-coffee', 'mdi-food-apple', 'mdi-food'];
    
    // Cache for meal colors to maintain consistency
    const mealColorCache = ref<Record<string, string>>({});
    
    // Get the meal prep store
    const mealPrepStore = useMealPrepStore();

    // Helper function to get color for a meal (with caching)
    const getMealColor = (mealName: string): string => {
      if (!mealName) return 'transparent';
      
      // Return cached color if we have one
      if (mealColorCache.value[mealName]) {
        return mealColorCache.value[mealName];
      }
      
      // Generate a consistent color based on meal name
      const color = generateColorFromName(mealName);
      mealColorCache.value[mealName] = color;
      return color;
    };

    // Generate a color from a string (based on MealIcon's generateColorFromName function)
    const generateColorFromName = (name: string): string => {
      // Hash calculation with improved distribution
      let h = 0, s = 70, l = 50;
      
      for (let i = 0; i < name.length; i++) {
        h = Math.imul(31, h) + name.charCodeAt(i) | 0;
      }
      
      // Normalize to 0-360 range for hue
      h = Math.abs(h % 360);
      
      // Adjust saturation and lightness based on name length for more variety
      s = Math.min(90, Math.max(50, 70 + (name.length % 5)));
      l = Math.min(60, Math.max(40, 50 - (name.length % 10)));
      
      return `hsl(${h}, ${s}%, ${l}%)`;
    };
    
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
    
    // Track the element of today's section for scrolling
    const todaySection = ref<HTMLElement | null>(null);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setTodaySection = (el: any) => {
      if (el) {
        todaySection.value = el instanceof Element ? el : el.$el;
      }
    };
      // Scroll to today's meal when component is mounted
    onMounted(() => {
      nextTick(() => {
        if (todaySection.value) {
          todaySection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // Helper function to determine if a meal needs preparation today
    const mealNeedsPrep = (mealName: string, dayName: string): boolean => {
      // Check if this is today's meal
      if (isToday(dayName)) {
        // Demo logic: New meals introduced today need prep
        const heavyPrepMeals = ['Batch Chili', 'Mediterranean Hummus Bowl', 'Turkey Meatballs with Pasta'];
        return heavyPrepMeals.includes(mealName);
      }
      return false;
    };
    
    // Helper function to determine if a meal is already prepared
    const mealIsPrepared = (mealName: string, dayName: string): boolean => {
      // Demo logic: Meals for tomorrow or later are not prepared yet
      if (isToday(dayName)) {
        // Some of today's meals are already prepped
        const preppedMeals = ['Greek Yogurt with Berries', 'Smoothie Bowl', 'Overnight Oats'];
        return preppedMeals.includes(mealName);
      }
      return false;
    };
    
    // Helper function to calculate leftover servings for demo purposes
    const getMealLeftovers = (mealName: string): number => {
      // For demo purposes, some meals will have leftovers
      const leftoverMap: Record<string, number> = {
        'Greek Yogurt with Berries': 0,
        'Quinoa Salad with Avocado': 2,
        'Grilled Salmon with Roasted Vegetables': 1,
        'Avocado Toast with Eggs': 0,
        'Chicken Caesar Wrap': 3,
        'Vegetable Stir Fry with Tofu': 2,
        'Smoothie Bowl': 0,
        'Mediterranean Hummus Bowl': 4,
        'Turkey Meatballs with Pasta': 2,
        'Batch Chili': 5  // Heavy prep example
      };
        // Return the mapped value or a random value between 0 and 2
      return leftoverMap[mealName] !== undefined ? leftoverMap[mealName] : Math.floor(Math.random() * 3);
    };

    // Helper function to check if any of the current day's breakfast meals need today section reference
    const hasCurrentDayBreakfast = (): boolean => {
      return sortedMealPlan.value.some(day => isToday(day.day));
    };
      return {
      sortedMealPlan,
      isToday,
      getFormattedDate,
      setTodaySection,
      getMealColor,
      mealIcons,
      mealNeedsPrep,
      mealIsPrepared,
      getMealLeftovers,
      hasCurrentDayBreakfast,
      mealPrepStore
    };
  }
});
</script>

<style scoped>
/* Grid layout styling */
.meal-plan-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Header row with days */
.grid-header {
  display: grid;
  grid-template-columns: 120px repeat(3, 1fr);
  gap: 1px;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.meal-type-header {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 12px;
}

.day-header-cell {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60px;
}

.day-header-cell.current-day {
  background-color: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
}

/* Meal type rows */
.meal-type-row {
  display: grid;
  grid-template-columns: 120px repeat(3, 1fr);
  gap: 1px;
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.meal-type-label-cell {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.meal-type-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 0.9rem;
}

.meal-cell {
  background-color: rgba(var(--v-theme-surface), 1);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.meal-cell.current-day-cell {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

/* Card styling */
.meal-plan-card {
  overflow: hidden;
}

/* Highlight current day */
.current-day {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-header,
  .meal-type-row {
    grid-template-columns: 100px repeat(3, 1fr);
  }
  
  .meal-type-label-cell,
  .day-header-cell {
    padding: 8px;
    min-height: 60px;
  }
  
  .meal-cell {
    padding: 6px;
    min-height: 60px;
  }
  
  .meal-type-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
  .grid-header,
  .meal-type-row {
    grid-template-columns: 80px repeat(3, 1fr);
  }
  
  .meal-type-label-cell,
  .day-header-cell {
    padding: 6px;
    min-height: 50px;
  }
  
  .meal-cell {
    padding: 4px;
    min-height: 50px;
  }
  
  .meal-type-label {
    font-size: 0.75rem;
    flex-direction: column;
    gap: 2px;
  }
  
  .meal-type-label .v-icon {
    margin-right: 0 !important;
    margin-bottom: 2px;
  }
}
</style>