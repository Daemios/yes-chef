<template>
  <v-card height="100%">
    <v-card-title class="text-h6">
      <v-icon
        start
        color="error"
      >
        mdi-food-apple
      </v-icon>
      Nutritional Overview
    </v-card-title>
    <v-card-text>
      <v-row class="text-center">
        <v-col
          v-for="(macro, index) in macros"
          :key="index"
          cols="4"
        >
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
          <div class="text-body-2 font-weight-medium">
            {{ macro.name }}
          </div>
        </v-col>
      </v-row>
      <div class="text-center mt-4">
        <v-btn
          color="primary"
          variant="text"
          size="small"
          to="/dietary"
        >
          View Detailed Breakdown
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface MacroNutrient {
  name: string;
  value: number;
  color: string;
}

export default defineComponent({
  name: 'NutritionOverview',
  props: {
    macros: {
      type: Array as PropType<MacroNutrient[]>,
      required: true
    }
  }
});
</script>

<style scoped>
/* No specific styles needed for this component */
</style>