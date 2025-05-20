<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-6">Dashboard</h1>
    
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <span class="text-h6">This Week's Meal Plan</span>
              <span class="text-subtitle-2 text-medium-emphasis ml-2">May 15 - May 21</span>
            </div>
            <v-btn color="primary" variant="text">
              <v-icon start>mdi-pencil</v-icon>
              Edit Plan
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-table hover="false">
            <thead>
              <tr>
                <th class="text-left">Day</th>
                <th class="text-left">Breakfast</th>
                <th class="text-left">Lunch</th>
                <th class="text-left">Dinner</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in mealPlan" :key="index">
                <td class="font-weight-medium">{{ day.day }}</td>
                <td>{{ day.breakfast }}</td>
                <td>{{ day.lunch }}</td>
                <td>{{ day.dinner }}</td>
              </tr>
            </tbody>
          </v-table>
          
          <v-card-actions class="pa-4">
            <v-btn color="primary" variant="outlined" prepend-icon="mdi-cart">
              View Shopping List
            </v-btn>
            <v-btn color="primary" variant="outlined" prepend-icon="mdi-printer" class="ml-2">
              Print Plan
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="accent" variant="text">
              <v-icon start>mdi-plus</v-icon>
              Add Recipe
            </v-btn>
          </v-card-actions>
        </v-card>
        
        <v-row>
          <v-col cols="12" sm="6">
            <v-card height="100%">
              <v-card-title class="text-h6">
                <v-icon start color="error">mdi-food-apple</v-icon>
                Nutritional Overview
              </v-card-title>
              <v-card-text>
                <v-row class="text-center">
                  <v-col v-for="(macro, index) in macros" :key="index" cols="4">
                    <v-progress-circular
                      :rotate="-90"
                      :size="80"
                      :width="8"
                      :model-value="macro.value"
                      :color="macro.color"
                      class="mb-2"
                    >
                      {{ macro.value }}%
                    </v-progress-circular>
                    <div class="text-body-2 font-weight-medium">{{ macro.name }}</div>
                  </v-col>
                </v-row>
                <div class="text-center mt-4">
                  <v-btn color="primary" variant="text" size="small" to="/dietary">
                    View Detailed Breakdown
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6">
            <v-card height="100%">
              <v-card-title class="text-h6">
                <v-icon start color="success">mdi-calendar-check</v-icon>
                Preparation Calendar
              </v-card-title>
              <v-card-text>
                <div v-for="(task, index) in prepTasks" :key="index" class="d-flex align-center mb-2">
                  <v-checkbox v-model="task.completed" hide-details density="compact" color="success"></v-checkbox>
                  <div>
                    <div :class="{ 'text-decoration-line-through': task.completed }">
                      {{ task.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">{{ task.day }}</div>
                  </div>
                </div>
                <div class="text-center mt-4">
                  <v-btn color="primary" variant="text" size="small">
                    View All Tasks
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            <v-icon start color="primary">mdi-star</v-icon>
            Recommended Recipes
          </v-card-title>
          <v-divider></v-divider>
          <v-list lines="two">
            <v-list-item v-for="(recipe, index) in recommendedRecipes" :key="index" :value="recipe">
              <template v-slot:prepend>
                <v-avatar rounded>
                  <v-img :src="recipe.image" alt="Recipe"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium">{{ recipe.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ recipe.time }} · {{ recipe.difficulty }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn icon="mdi-plus" variant="text" size="small"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-card-actions class="justify-center pa-4">
            <v-btn color="primary" variant="text">
              Browse More Recipes
            </v-btn>
          </v-card-actions>
        </v-card>
        
        <v-card>
          <v-card-title class="text-h6">
            <v-icon start color="warning">mdi-bell</v-icon>
            Reminders
          </v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item v-for="(reminder, index) in reminders" :key="index">
              <template v-slot:prepend>
                <v-icon :color="reminder.color">{{ reminder.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ reminder.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ reminder.subtitle }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DashboardView',
  setup() {
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
      { name: 'Marinate chicken for Tuesday', day: 'Monday', completed: true },
      { name: 'Prep vegetables for stir fry', day: 'Tuesday', completed: false },
      { name: 'Make turkey meatballs', day: 'Wednesday', completed: false },
      { name: 'Prepare pizza dough', day: 'Thursday', completed: false }
    ];
    
    const recommendedRecipes = [
      { 
        name: 'Sweet Potato Buddha Bowl', 
        time: '30 min', 
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      },
      { 
        name: 'One-Pot Chicken Pasta', 
        time: '25 min', 
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      },
      { 
        name: 'Mediterranean Grilled Vegetables', 
        time: '20 min', 
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1511994714008-b6d68a8b32a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
      }
    ];
    
    const reminders = [
      {
        icon: 'mdi-cart',
        color: 'primary',
        title: 'Shopping Day',
        subtitle: 'Tomorrow is your scheduled grocery shopping day'
      },
      {
        icon: 'mdi-food',
        color: 'error',
        title: 'Check Fridge',
        subtitle: 'Some items may expire soon'
      },
      {
        icon: 'mdi-silverware-fork-knife',
        color: 'success',
        title: 'Meal Prep Sunday',
        subtitle: 'Prepare meals for next week'
      }
    ];
    
    return {
      mealPlan,
      macros,
      prepTasks,
      recommendedRecipes,
      reminders
    };
  }
});
</script>
