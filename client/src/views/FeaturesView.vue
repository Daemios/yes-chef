<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        class="text-center"
      >
        <h1 class="text-h3 font-weight-bold mb-3">
          Features
        </h1>
        <p
          class="text-subtitle-1 mx-auto"
          style="max-width: 700px"
        >
          Yes Chef is loaded with powerful features to make meal planning effortless
        </p>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col
        v-for="(feature, index) in features"
        :key="index"
        cols="12"
        md="6"
        lg="4"
        class="mb-6"
      >
        <v-card
          height="100%"
          class="d-flex flex-column"
        >
          <v-card-item>
            <div class="mb-4">
              <v-avatar
                :color="feature.color"
                size="52"
                rounded
              >
                <v-icon
                  :icon="feature.icon"
                  size="24"
                  color="white"
                />
              </v-avatar>
            </div>
            <v-card-title class="text-h5 font-weight-bold">
              {{ feature.title }}
            </v-card-title>
            <v-card-text class="text-body-1">
              {{ feature.description }}
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-12">
      <v-col
        cols="12"
        class="text-center"
      >
        <h2 class="text-h4 font-weight-bold mb-4">
          Ready to Transform Your Meal Planning?
        </h2>
        <v-btn
          to="/subscribe"
          color="accent"
          size="large"
          class="text-none mt-2"
        >
          <v-icon start>
            mdi-silverware-fork-knife
          </v-icon>
          Get Started Free
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeaturesView',
  setup() {
    const features = [
      {
        title: 'Smart Meal Planner',
        description: 'Plan your meals for the week with our intuitive drag-and-drop interface. Easily adjust portions and swap recipes.',
        icon: 'mdi-calendar-text',
        color: 'accent'
      },      {
        title: 'Automatic Shopping Lists',
        description: 'We combine all ingredients from your meal plan into an organized shopping list, sorted by store section.',
        icon: 'mdi-cart',
        color: 'primary'
      },
      {
        title: 'Instacart Integration',
        description: 'Premium users can send their shopping lists directly to Instacart for seamless online grocery ordering.',
        icon: 'mdi-cart-outline',
        color: 'secondary'
      },
      {
        title: 'Nutritional Insights',
        description: 'Track calories, macros, and micronutrients for each meal and view your nutritional balance for the week.',
        icon: 'mdi-nutrition',
        color: 'success'
      },
      {
        title: 'Recipe Database',
        description: 'Access thousands of recipes with detailed preparation instructions, cooking times, and ingredient lists.',
        icon: 'mdi-silverware-fork-knife',
        color: 'info'
      },
      {
        title: 'Dietary Preferences',
        description: 'Set your dietary preferences and restrictions to see only recipes that match your needs.',
        icon: 'mdi-food-apple',
        color: 'error'
      },
      {
        title: 'Budget Tracking',
        description: 'Estimate grocery costs before you shop and track your food spending over time.',
        icon: 'mdi-currency-usd',
        color: 'warning'
      }
    ];

    return {
      features
    };
  }
});
</script>
