<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6">Dashboard</h1>
    
    <v-row>
      <v-col cols="12" md="8">
        <MealPlan :mealPlan="mealPlan" />
        
        <v-row>
          <v-col cols="12" sm="6">
            <NutritionOverview :macros="macros" />
          </v-col>
          
          <v-col cols="12" sm="6">
            <ShoppingInsights />
          </v-col>
        </v-row>
      </v-col>
      
      <v-col cols="12" md="4">
        <TaskCalendar 
          :tasks="prepTasks" 
          :reminders="reminders" 
          @add-activity="addNewActivity"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, nextTick } from 'vue';
import TaskCalendar from '@/components/dashboard/TaskCalendar.vue';
import MealPlan from '@/components/dashboard/MealPlan.vue';
import NutritionOverview from '@/components/dashboard/NutritionOverview.vue';
import ShoppingInsights from '@/components/dashboard/ShoppingInsights.vue';

export default defineComponent({
  name: 'DashboardView',
  components: {
    TaskCalendar,
    MealPlan,
    NutritionOverview,
    ShoppingInsights
  },
  setup() {    // Add function to handle the add activity event
    const addNewActivity = () => {
      // This would typically open a dialog or navigate to activity creation
      console.log('Add new activity triggered');
      // In a real app, you might do something like:
      // dialogOpen.value = true;
    };    // Helper function to check if a day is today (for highlighting)
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
      const sorted = [...mealPlan].sort((a, b) => {
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
    });

    const mealPlan = [
      {
        day: 'Monday',
        breakfast: 'Greek Yogurt with Berries',
        lunch: 'Quinoa Salad with Avocado',
        dinner: 'Grilled Salmon with Roasted Vegetables'
      },
      {
        day: 'Tuesday',
        breakfast: 'Avocado Toast with Eggs',
        lunch: 'Chicken Caesar Wrap',
        dinner: 'Vegetable Stir Fry with Tofu'
      },
      {
        day: 'Wednesday',
        breakfast: 'Smoothie Bowl',
        lunch: 'Mediterranean Hummus Bowl',
        dinner: 'Turkey Meatballs with Pasta'
      },
      {
        day: 'Thursday',
        breakfast: 'Oatmeal with Banana',
        lunch: 'Tuna Salad Sandwich',
        dinner: 'Sheet Pan Chicken with Vegetables'
      },
      {
        day: 'Friday',
        breakfast: 'Breakfast Burrito',
        lunch: 'Lentil Soup with Bread',
        dinner: 'Homemade Pizza Night'
      }
    ];
    
    const macros = [
      { name: 'Protein', value: 65, color: 'primary' },
      { name: 'Carbs', value: 40, color: 'warning' },
      { name: 'Fat', value: 30, color: 'error' }
    ];
    
    const prepTasks = [
      { name: 'Marinate chicken for Tuesday', day: 'Monday', completed: true, date: '2025-05-19' },
      { name: 'Prep vegetables for stir fry', day: 'Tuesday', completed: false, date: '2025-05-20' },
      { name: 'Make turkey meatballs', day: 'Wednesday', completed: false, date: '2025-05-21' },
      { name: 'Prepare pizza dough', day: 'Thursday', completed: false, date: '2025-05-22' }
    ];
    
    const reminders = [
      {
        icon: 'mdi-cart',
        color: 'primary',
        title: 'Shopping Day',
        subtitle: 'Tomorrow is your scheduled grocery shopping day',
        date: '2025-05-21'
      },
      {
        icon: 'mdi-food',
        color: 'error',
        title: 'Check Fridge',
        subtitle: 'Some items may expire soon',
        date: '2025-05-20'
      },
      {
        icon: 'mdi-silverware-fork-knife',
        color: 'success',
        title: 'Meal Prep Sunday',
        subtitle: 'Prepare meals for next week',
        date: '2025-05-25'
      }
    ];    return {
      mealPlan,
      sortedMealPlan,
      macros,
      prepTasks,
      reminders,
      addNewActivity,
      isToday,
      getFormattedDate,
      mealList,
      todaySection
    };
  }
});
</script>

<style>
/* Dashboard-specific styles */
.meal-plan-list {
  max-height: 350px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.current-day-header {
  background-color: rgba(var(--v-theme-primary), 0.1);
  font-weight: bold;
}

.meal-item {
  padding-top: 8px;
  padding-bottom: 8px;
  margin-left: 8px;
  margin-right: 8px;
}

.meal-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
  margin-right: 4px;
}

.meal-title {
  font-weight: 500 !important;
  padding-top: 2px;
}

.meal-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
