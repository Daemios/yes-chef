import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify';
import { useThemeStore } from './stores/theme';
import { useAuthStore } from './stores/auth';

// Create async initialization function to ensure auth state is loaded before routing
async function initApp() {
  // Initialize app
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);
  
  // Initialize theme from saved preferences
  const themeStore = useThemeStore();
  themeStore.initTheme();
  
  // Initialize auth state from stored token and await completion
  const authStore = useAuthStore();
  await authStore.initializeAuth();
  
  // Now that auth is initialized, set up router and vuetify
  app.use(router);
  app.use(vuetify);
  
  // Mount the app after everything is initialized
  app.mount('#app');
}

// Start the application
initApp();
