<template>
  <div class="about">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-3">About Yes Chef</h1>
        <p class="text-subtitle-1 mx-auto" style="max-width: 700px">
          We're on a mission to make healthy eating accessible, affordable, and delicious for everyone.
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-img src="/img/about-team.webp" alt="Yes Chef Team" class="rounded-lg" height="400" cover />
      </v-col>
      <v-col cols="12" md="6" class="d-flex flex-column justify-center">
        <h2 class="text-h4 font-weight-bold mb-4">Our Story</h2>
        <p class="text-body-1 mb-4">
          Yes Chef was born out of a simple frustration: the time-consuming process of planning meals, making shopping lists, and trying to eat healthy while staying on budget.
        </p>
        <p class="text-body-1 mb-4">
          Founded in 2020 by a team of food enthusiasts, nutritionists, and software engineers, we set out to build a platform that would solve these challenges and make meal planning effortless.
        </p>
        <p class="text-body-1">
          Today, Yes Chef helps thousands of households save time, reduce food waste, and enjoy healthier, more diverse meals.
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-12">
      <v-col cols="12" class="text-center">
        <h2 class="text-h4 font-weight-bold mb-4">Our Values</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(value, index) in values" :key="index" cols="12" md="4" class="mb-6">
        <v-card height="100%" variant="outlined" class="rounded-lg">
          <v-card-item>
            <v-avatar :color="value.color" class="mb-4">
              <v-icon :icon="value.icon" color="white"></v-icon>
            </v-avatar>
            <v-card-title class="text-h5 font-weight-bold">{{ value.title }}</v-card-title>
            <v-card-text class="text-body-1">{{ value.description }}</v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
  setup() {
    const values = [
      {
        title: 'Simplicity',
        description: 'We believe that meal planning should be simple and accessible to everyone, regardless of their cooking experience.',
        icon: 'mdi-fingerprint',
        color: 'primary'
      },
      {
        title: 'Sustainability',
        description: 'We\'re committed to helping reduce food waste by providing smart planning tools and thoughtful recipes.',
        icon: 'mdi-leaf',
        color: 'success'
      },
      {
        title: 'Community',
        description: 'We foster a community where food enthusiasts can share recipes, tips, and inspire each other.',
        icon: 'mdi-account-group',
        color: 'accent'
      }
    ];

    return {
      values
    };
  }
});
</script>

<style scoped>
.team-card {
  transition: transform 0.3s;
}

.team-card:hover {
  transform: translateY(-5px);
}
</style>
