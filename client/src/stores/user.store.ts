import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginCredentials, RegistrationData } from '../types/user';

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => currentUser.value?.name || 'Guest');
  
  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;
    try {
      // This is a placeholder for actual API call
      // const response = await loginUser(credentials);
      // Simulate API response for now
      const response = {
        user: {
          id: 1,
          name: credentials.email.split('@')[0],
          email: credentials.email
        },
        token: 'mock_token_' + Math.random()
      };
      
      setUserData(response.user, response.token);
      return response.user;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to login';
      console.error('Login error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  async function register(userData: RegistrationData) {
    loading.value = true;
    error.value = null;
    try {
      // This is a placeholder for actual API call
      // const response = await registerUser(userData);
      // Simulate API response for now
      const response = {
        user: {
          id: 1,
          name: userData.name,
          email: userData.email
        },
        token: 'mock_token_' + Math.random()
      };
      
      setUserData(response.user, response.token);
      return response.user;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to register';
      console.error('Registration error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }
  
  function logout() {
    currentUser.value = null;
    token.value = null;
    localStorage.removeItem('auth_token');
  }
  
  function setUserData(user: User, authToken: string) {
    currentUser.value = user;
    token.value = authToken;
    localStorage.setItem('auth_token', authToken);
  }
  
  return {
    // State
    currentUser,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userName,
    
    // Actions
    login,
    register,
    logout,
    setUserData
  };
});
