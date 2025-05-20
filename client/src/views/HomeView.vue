<template>
  <div class="min-h-100">
    <v-row class="mt-12">
      <v-col cols="12" md="6" class="d-flex flex-column justify-center">
        <h1 class="text-h2 font-weight-bold mb-4">Smart Meal Planning<br>Made <span class="text-accent">Simple</span></h1>
        <p class="text-body-1 mb-6">Yes Chef helps you plan your meals, generate shopping lists, and track nutrition - all in one place.</p>
        <div class="d-flex flex-wrap gap-3">
          <v-btn to="/subscribe" color="accent" size="large" class="text-none mb-2 mr-2">
            <v-icon start>mdi-silverware-fork-knife</v-icon>
            Start Meal Planning
          </v-btn>
          <v-btn to="/features" variant="outlined" size="large" class="text-none mb-2">
            <v-icon start>mdi-information-outline</v-icon>
            Learn More
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-img src="/img/home-hero.webp" alt="Yes Chef meal planning" class="rounded-lg" height="500" cover />
      </v-col>
    </v-row>

    <div class="py-16 my-8 bg-dark" style="background-color: rgba(30, 41, 59, 0.5); border-top: 1px solid rgba(148, 163, 184, 0.1); border-bottom: 1px solid rgba(148, 163, 184, 0.1);">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center mb-12">
            <span class="text-overline text-accent font-weight-bold">SIMPLE PROCESS</span>
            <h2 class="text-h3 font-weight-bold mt-2 mb-3">How It Works</h2>
            <p class="text-subtitle-1 mx-auto" style="max-width: 600px">Three simple steps to transform your meal planning routine</p>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12" md="4" v-for="(step, index) in steps" :key="index">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 4 : 1"
                :class="['h-100', isHovering ? 'border border-accent' : '']"
                rounded="lg"
              >
                <v-card-item>
                  <div class="d-flex align-center mb-4">
                    <v-avatar 
                      color="accent" 
                      size="50"
                      class="mr-4"
                    >
                      <span class="text-h6 font-weight-bold">{{ index + 1 }}</span>
                    </v-avatar>
                    <v-card-title class="text-h5 pa-0 font-weight-bold">{{ step.title }}</v-card-title>
                  </div>
                  
                  <v-card-text class="text-body-1 pt-2">
                    {{ step.description }}
                  </v-card-text>
                  
                  <div class="text-center mt-4">
                    <v-icon :icon="step.icon" size="64" color="accent" class="opacity-75"></v-icon>
                  </div>
                </v-card-item>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <v-row class="mt-12">
          <v-col cols="12" class="text-center">
            <v-btn to="/subscribe" color="accent" size="large" class="px-6">
              Get Started Today
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      steps: [
        {
          title: 'Plan Your Meals',
          description: 'Easily select recipes from our curated database or add your own favorites to create personalized weekly meal plans in minutes.',
          icon: 'mdi-calendar-text'
        },
        {
          title: 'Generate Shopping Lists',
          description: 'Our smart system automatically combines ingredients from all your planned meals into organized shopping lists, saving you time and reducing waste.',
          icon: 'mdi-cart-outline'
        },
        {
          title: 'Track Nutrition',
          description: 'Monitor your nutritional intake with detailed breakdowns and visualizations to help you maintain a balanced, healthy diet effortlessly.',
          icon: 'mdi-chart-bar'
        }
      ]
    };
  }
});
</script>
