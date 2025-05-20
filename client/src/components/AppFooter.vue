<template>
  <v-footer app color="primary" class="text-white" elevation="0">
    <div class="d-flex justify-space-between align-center w-100">
      <span class="font-weight-light">© {{ new Date().getFullYear() }} <span class="text-accent">Yes Chef</span> | Smart Meal Planning</span>
      <div>
        <v-btn icon="mdi-instagram" variant="text" size="small" color="accent" class="mx-1"></v-btn>
        <v-btn icon="mdi-twitter" variant="text" size="small" color="accent" class="mx-1"></v-btn>
        <v-btn icon="mdi-facebook" variant="text" size="small" color="accent" class="mx-1"></v-btn>
      </div>
    </div>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppFooter'
});
</script>

<style scoped>
.v-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: var(--v-primary-base) !important;
}
</style>
