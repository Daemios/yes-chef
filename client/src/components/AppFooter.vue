<template>
  <v-footer
    app
    fixed
    class="text-white"
    elevation="1"
    border="t"
  >
    <div class="d-flex justify-space-between align-center w-100">
      <span class="font-weight-light">© {{ new Date().getFullYear() }} <span class="text-accent">Yes Chef</span> | Smart Meal Planning</span>
      <div>
        <v-btn
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          icon="mdi-instagram"
          variant="text"
          size="small"
          color="accent"
          class="mx-1 social-btn"
        />
        <v-btn
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          icon="mdi-twitter"
          variant="text"
          size="small"
          color="accent"
          class="mx-1 social-btn"
        />
        <v-btn
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          icon="mdi-facebook"
          variant="text"
          size="small"
          color="accent"
          class="mx-1 social-btn"
        />
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
.social-btn {
  transition: transform 0.2s ease;
}

.social-btn:hover {
  transform: translateY(-3px);
  opacity: 0.9;
}
</style>
