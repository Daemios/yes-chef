<template>  <v-app :theme="theme">
    <v-app-bar app elevation="2" class="bg-primary">
      <v-toolbar-title class="text-h5 font-weight-bold text-white">
        <v-icon icon="mdi-chef-hat" class="mr-2"></v-icon>
        Yes Chef
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="text" class="text-white">
        <v-icon icon="mdi-home" class="mr-1"></v-icon>
        Home
      </v-btn>
      <v-btn to="/about" variant="text" class="text-white">
        <v-icon icon="mdi-information" class="mr-1"></v-icon>
        About
      </v-btn>    </v-app-bar>
    
    <v-main class="bg-background">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    
    <v-footer app class="bg-primary text-white">
      <div class="d-flex justify-space-between align-center w-100">
        <span>&copy; {{ new Date().getFullYear() }} Yes Chef</span>
        <div>
          <v-btn icon="mdi-instagram" variant="text" size="small" color="white" class="mx-1"></v-btn>
          <v-btn icon="mdi-twitter" variant="text" size="small" color="white" class="mx-1"></v-btn>
          <v-btn icon="mdi-facebook" variant="text" size="small" color="white" class="mx-1"></v-btn>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    const theme = ref('yesChefTheme');
    
    return {
      theme
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
