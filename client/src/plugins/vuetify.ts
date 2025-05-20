import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
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
    defaultTheme: 'yesChefDarkTheme',
    themes: {
      yesChefDarkTheme: {
        dark: true,
        colors: {
          primary: '#64748B', // Slate blue (lighter in dark mode)
          secondary: '#94A3B8', // Light slate gray
          accent: '#7FB3A4', // Lighter sage/teal for dark mode
          error: '#EF9A9A', // Lighter red for dark mode
          warning: '#FFE082', // Lighter amber for dark mode
          info: '#90CAF9', // Lighter blue for dark mode
          success: '#A5D6A7', // Lighter green for dark mode
          background: '#0F172A', // Dark blue-gray
          surface: '#1E293B', // Slightly lighter surface
          'on-background': '#E2E8F0', // Light gray for text
          'on-surface': '#E2E8F0', // Light gray for text
        },
      },
    },
  },
});
