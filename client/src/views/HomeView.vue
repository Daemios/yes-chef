<template>
  <div class="home">
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
        <div class="mt-6">
          <span class="text-caption text-medium-emphasis">Trusted by over 10,000+ home cooks and meal preppers</span>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-img src="/img/home-hero.webp" alt="Yes Chef meal planning" class="rounded-lg" height="500" cover />
      </v-col>
    </v-row>

    <v-row class="mt-16">
      <v-col cols="12" class="text-center">
        <h2 class="text-h4 font-weight-bold mb-2">How It Works</h2>
        <p class="text-subtitle-1 mx-auto" style="max-width: 600px">Three simple steps to transform your meal planning routine</p>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="4">
        <v-card height="100%" variant="outlined" class="rounded-lg">
          <v-card-item>
            <v-avatar color="accent" size="56" class="mb-4">
              <span class="text-h5 font-weight-bold">1</span>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-bold">Plan Your Meals</v-card-title>
            <v-card-text class="text-body-1">
              Easily select recipes from our database or add your own favorites to create customized weekly meal plans.
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card height="100%" variant="outlined" class="rounded-lg">
          <v-card-item>
            <v-avatar color="accent" size="56" class="mb-4">
              <span class="text-h5 font-weight-bold">2</span>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-bold">Generate Shopping Lists</v-card-title>
            <v-card-text class="text-body-1">
              We automatically combine ingredients from all your planned meals into a smart shopping list organized by store section.
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card height="100%" variant="outlined" class="rounded-lg">
          <v-card-item>
            <v-avatar color="accent" size="56" class="mb-4">
              <span class="text-h5 font-weight-bold">3</span>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-bold">Track Nutrition</v-card-title>
            <v-card-text class="text-body-1">
              Monitor your nutritional intake with detailed breakdowns and insights to help you maintain a balanced diet.
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView'
});
</script>

<style scoped>
.home {
  min-height: 100%;
}
</style>
