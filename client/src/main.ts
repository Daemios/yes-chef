import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'yesChefTheme',
    themes: {
      yesChefTheme: {
        dark: false,
        colors: {
          primary: '#8E2442', // Rich burgundy/wine color
          secondary: '#606C38', // Warm olive green
          accent: '#FF6B35', // Warm orange
          error: '#FF3B30', // Bright red
          warning: '#FFCC00', // Golden yellow
          info: '#3A86FF', // Clear blue
          success: '#28A745', // Emerald green
          background: '#FFFDF6', // Light cream
          surface: '#FFFFFF', // Pure white
          'on-background': '#333333', // Dark gray text on background
          'on-surface': '#333333', // Dark gray text on surface
        },
      },
    },
  },
});

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(pinia);

app.mount('#app');
