import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify';
import { useThemeStore } from './stores/theme';
import { useAuthStore } from './stores/auth';

// Initialize app
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Initialize theme from saved preferences
const themeStore = useThemeStore();
themeStore.initTheme();

// Initialize auth state from stored token
const authStore = useAuthStore();
authStore.initializeAuth();

app.use(router);
app.use(vuetify);

app.mount('#app');
