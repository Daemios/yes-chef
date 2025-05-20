<template>
  <v-card height="100%">
    <v-card-title class="text-h6">
      <v-icon start color="success">mdi-calendar-check</v-icon>
      Shopping Insights
    </v-card-title>
    <v-card-text>
      <v-row class="text-center">
        <v-col cols="6">
          <v-progress-circular
            :rotate="-90"
            :size="80"
            :width="8"
            :model-value="fridgeInventory"
            color="success"
            class="mb-2"
          >
            {{ fridgeInventory }}%
          </v-progress-circular>
          <div class="text-body-2 font-weight-medium">Fridge<br/>Inventory</div>
        </v-col>
        <v-col cols="6">
          <v-progress-circular
            :rotate="-90"
            :size="80"
            :width="8"
            :model-value="shoppingProgress"
            color="error"
            class="mb-2"
          >
            {{ shoppingProgress }}%
          </v-progress-circular>
          <div class="text-body-2 font-weight-medium">Shopping<br/>Progress</div>
        </v-col>
      </v-row>
      <div class="text-center mt-4">
        <v-btn color="primary" variant="text" size="small" to="/shopping">
          View Shopping List
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShoppingInsights',
  props: {
    fridgeInventory: {
      type: Number,
      default: 70
    },
    shoppingProgress: {
      type: Number,
      default: 25
    }
  }
});
</script>

<style scoped>
/* No specific styles needed for this component */
</style>