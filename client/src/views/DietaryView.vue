<template>
  <div class="dietary">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Dietary Breakdown</h1>
      <div>
        <v-btn-toggle v-model="timeframe" mandatory color="primary">
          <v-btn value="day">Day</v-btn>
          <v-btn value="week">Week</v-btn>
          <v-btn value="month">Month</v-btn>
        </v-btn-toggle>
      </div>
    </div>
    
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6">
          <v-card-title class="text-h6">Macronutrient Distribution</v-card-title>
          <v-card-text>
            <div style="height: 300px">
              <!-- Chart placeholder - would use a real chart library in production -->
              <div class="chart-placeholder d-flex align-center justify-center">
                <div class="text-center">
                  <div class="text-h6">Macronutrients Chart</div>
                  <div class="text-body-2 text-medium-emphasis">
                    (Would integrate with Chart.js or similar library)
                  </div>
                </div>
              </div>
            </div>
            
            <v-row class="mt-4">
              <v-col v-for="(macro, index) in macros" :key="index" cols="12" md="4">
                <v-card variant="outlined" class="pa-4 text-center h-100">
                  <div class="text-h6 font-weight-bold mb-1">{{ macro.name }}</div>
                  <div class="d-flex justify-center align-center">
                    <span class="text-h4 font-weight-bold" :class="`text-${macro.color}`">{{ macro.value }}g</span>
                    <span class="text-caption text-medium-emphasis ml-2">({{ macro.percentage }}%)</span>
                  </div>
                  <v-progress-linear
                    :model-value="macro.percentage"
                    :color="macro.color"
                    height="8"
                    rounded
                    class="mt-2"
                  ></v-progress-linear>
                  <div class="text-caption text-medium-emphasis mt-2">
                    {{ macro.status }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-card height="100%">
              <v-card-title class="text-h6">Daily Calorie Intake</v-card-title>
              <v-card-text>
                <div class="text-center py-4">
                  <v-progress-circular
                    :rotate="270"
                    :size="150"
                    :width="15"
                    :model-value="(calorieIntake / calorieGoal) * 100"
                    color="primary"
                  >
                    <div class="text-h5 font-weight-bold">{{ calorieIntake }}</div>
                    <div class="text-caption">of {{ calorieGoal }} kcal</div>
                  </v-progress-circular>
                  
                  <div class="mt-4 d-flex justify-center">
                    <div class="px-2 text-center">
                      <div class="text-body-2 font-weight-medium">Goal</div>
                      <div class="text-subtitle-1 font-weight-bold">{{ calorieGoal }}</div>
                    </div>
                    <v-divider vertical class="mx-4"></v-divider>
                    <div class="px-2 text-center">
                      <div class="text-body-2 font-weight-medium">Consumed</div>
                      <div class="text-subtitle-1 font-weight-bold">{{ calorieIntake }}</div>
                    </div>
                    <v-divider vertical class="mx-4"></v-divider>
                    <div class="px-2 text-center">
                      <div class="text-body-2 font-weight-medium">Remaining</div>
                      <div class="text-subtitle-1 font-weight-bold">{{ calorieGoal - calorieIntake }}</div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card height="100%">
              <v-card-title class="text-h6">Meal Distribution</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item v-for="(meal, index) in meals" :key="index">
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="36">
                        <v-icon :icon="meal.icon" color="white"></v-icon>
                      </v-avatar>
                    </template>
                    
                    <v-list-item-title>{{ meal.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ meal.time }}</v-list-item-subtitle>
                    
                    <template v-slot:append>
                      <div class="text-right">
                        <div class="font-weight-medium">{{ meal.calories }} kcal</div>
                        <div class="text-caption text-medium-emphasis">
                          P: {{ meal.protein }}g | C: {{ meal.carbs }}g | F: {{ meal.fat }}g
                        </div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            <v-icon start color="success">mdi-trending-up</v-icon>
            Weekly Trends
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div style="height: 200px" class="mb-4">
              <!-- Chart placeholder - would use a real chart library in production -->
              <div class="chart-placeholder d-flex align-center justify-center">
                <div class="text-center">
                  <div class="text-body-2">Weekly Trends Chart</div>
                  <div class="text-caption text-medium-emphasis">
                    (Would integrate with Chart.js or similar library)
                  </div>
                </div>
              </div>
            </div>
            
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Average Daily Calories</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-medium">2,105 kcal</span>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Protein Goal Achievement</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-medium text-success">92%</span>
                </template>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Sugar Consumption</v-list-item-title>
                <template v-slot:append>
                  <span class="font-weight-medium text-error">+12%</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        
        <v-card class="mb-6">
          <v-card-title class="text-h6">
            <v-icon start color="accent">mdi-food-apple</v-icon>
            Micronutrients
          </v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item v-for="(nutrient, index) in micronutrients" :key="index">
              <v-list-item-title>{{ nutrient.name }}</v-list-item-title>
              <template v-slot:append>
                <div>
                  <v-progress-linear
                    :model-value="nutrient.percentage"
                    :color="getProgressColor(nutrient.percentage)"
                    height="8"
                    rounded
                    class="my-1"
                    min-width="100"
                  ></v-progress-linear>
                  <div class="text-caption text-end">{{ nutrient.value }}{{ nutrient.unit }}</div>
                </div>
              </template>
            </v-list-item>
          </v-list>
          <v-card-actions class="justify-center">
            <v-btn color="primary" variant="text" size="small">
              View All Micronutrients
            </v-btn>
          </v-card-actions>
        </v-card>
        
        <v-card>
          <v-card-title class="text-h6">
            <v-icon start color="primary">mdi-cog</v-icon>
            Dietary Settings
          </v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item>
              <v-list-item-title>Dietary Preferences</v-list-item-title>
              <template v-slot:append>
                <v-chip color="primary" size="small">Balanced</v-chip>
              </template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Calorie Goal</v-list-item-title>
              <template v-slot:append>
                <v-chip color="primary" size="small">{{ calorieGoal }} kcal</v-chip>
              </template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Macronutrient Targets</v-list-item-title>
              <template v-slot:append>
                <v-btn variant="text" size="small" color="primary">Edit</v-btn>
              </template>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Allergies & Restrictions</v-list-item-title>
              <template v-slot:append>
                <v-btn variant="text" size="small" color="primary">Manage</v-btn>
              </template>
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
  name: 'DietaryView',
  setup() {
    const timeframe = ref('day');
    
    const macros = [
      { 
        name: 'Protein', 
        value: 95, 
        percentage: 65, 
        color: 'primary',
        status: 'Within recommended range (10-35%)'
      },
      { 
        name: 'Carbohydrates', 
        value: 210, 
        percentage: 40, 
        color: 'warning',
        status: 'Below target (45-65%)'
      },
      { 
        name: 'Fat', 
        value: 68, 
        percentage: 30, 
        color: 'error',
        status: 'Within recommended range (20-35%)'
      }
    ];
    
    const calorieGoal = 2200;
    const calorieIntake = 1850;
    
    const meals = [
      {
        name: 'Breakfast',
        time: '7:30 AM',
        icon: 'mdi-food-croissant',
        calories: 420,
        protein: 20,
        carbs: 45,
        fat: 18
      },
      {
        name: 'Morning Snack',
        time: '10:30 AM',
        icon: 'mdi-fruit-cherries',
        calories: 150,
        protein: 5,
        carbs: 25,
        fat: 3
      },
      {
        name: 'Lunch',
        time: '12:45 PM',
        icon: 'mdi-bowl-mix',
        calories: 580,
        protein: 35,
        carbs: 60,
        fat: 22
      },
      {
        name: 'Afternoon Snack',
        time: '3:30 PM',
        icon: 'mdi-cookie',
        calories: 180,
        protein: 8,
        carbs: 20,
        fat: 8
      },
      {
        name: 'Dinner',
        time: '7:00 PM',
        icon: 'mdi-silverware-fork-knife',
        calories: 520,
        protein: 27,
        carbs: 60,
        fat: 17
      }
    ];
    
    const micronutrients = [
      { name: 'Vitamin D', value: 12, unit: 'μg', percentage: 60 },
      { name: 'Iron', value: 14, unit: 'mg', percentage: 78 },
      { name: 'Calcium', value: 850, unit: 'mg', percentage: 85 },
      { name: 'Vitamin C', value: 95, unit: 'mg', percentage: 106 },
      { name: 'Fiber', value: 18, unit: 'g', percentage: 64 }
    ];
    
    const getProgressColor = (percentage: number) => {
      if (percentage < 50) return 'error';
      if (percentage < 75) return 'warning';
      if (percentage <= 100) return 'success';
      return 'info';
    };
    
    return {
      timeframe,
      macros,
      calorieGoal,
      calorieIntake,
      meals,
      micronutrients,
      getProgressColor
    };
  }
});
</script>

<style scoped>
.chart-placeholder {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
</style>
