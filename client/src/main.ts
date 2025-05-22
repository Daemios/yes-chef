import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify';
import { useThemeStore } from './stores/theme';

console.log('Initializing app with theme:', vuetify.theme);

// Initialize app
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Add console log to verify app initialization
console.log('Vue app initializing...');

// Initialize theme from saved preferences
const themeStore = useThemeStore();
themeStore.initTheme();

app.use(router);
app.use(vuetify);

// Add another console log to verify app mounting
console.log('Mounting Vue app to #app element');
app.mount('#app');
