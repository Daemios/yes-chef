import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // We'll keep this for compatibility but it will always be true
  const isDark = ref(true);
  
  const currentTheme = computed(() => 'yesChefDarkTheme');
  
  function initTheme() {
    // Always use dark theme
    isDark.value = true;
  }
  
  function toggleTheme() {
    // This function now does nothing since we only have one theme
    console.log('Theme toggle disabled - always using dark theme');
  }
  
  return {
    isDark,
    currentTheme,
    initTheme,
    toggleTheme
  };
});
