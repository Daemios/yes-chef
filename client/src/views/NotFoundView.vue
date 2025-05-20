<template>
  <div class="not-found">
    <v-container class="d-flex align-center justify-center" style="min-height: 70vh;">
      <v-card class="text-center pa-6" max-width="600" elevation="3" rounded="lg">
        <v-icon icon="mdi-alert-circle" color="error" size="64" class="mb-4"></v-icon>
        <v-card-title class="text-h3 font-weight-bold mb-2">
          404
        </v-card-title>
        <v-card-subtitle class="text-h5 mb-6">
          Page Not Found
        </v-card-subtitle>
        <v-card-text>
          <p class="mb-6">Sorry, we couldn't find this page. It might have been moved or doesn't exist.</p>
          <v-btn
            color="accent"
            size="large"
            variant="elevated"
            to="/"
            class="mt-4 text-primary"
          >
            <v-icon icon="mdi-food" class="mr-2"></v-icon>
            Back to Meal Plans
          </v-btn>
        </v-card-text>
        <div class="chef-icon">
          <v-icon icon="mdi-chef-hat" size="120" color="grey-lighten-3"></v-icon>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFoundView'
});
</script>

<style scoped>
.chef-icon {
  position: absolute;
  bottom: -30px;
  right: -30px;
  opacity: 0.2;
  transform: rotate(15deg);
  z-index: 0;
}
</style>
