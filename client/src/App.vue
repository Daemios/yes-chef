<template>
  <v-app :theme="themeStore.currentTheme">
    <!-- Use the AppBar component -->
    <app-bar />
    
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    
    <!-- Use the AppFooter component -->
    <app-footer />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppBar from './components/AppBar.vue';
import AppFooter from './components/AppFooter.vue';
import { useThemeStore } from './stores/theme';

export default defineComponent({
  name: 'App',
  components: {
    AppBar,
    AppFooter
  },
  setup() {
    const themeStore = useThemeStore();
    
    return {
      themeStore
    };
  }
});
</script>

<style>
/* Global styles */
.v-application {
  font-family: 'Poppins', sans-serif;
}
</style>
