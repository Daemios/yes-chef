import { defineStore } from 'pinia';
import { loginUser, registerUser, getCurrentUser, type LoginRequest, type RegisterRequest } from '../services/api.service';

interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null as User | null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    /**
     * Login with email and password
     */
    async login(credentials: LoginRequest) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await loginUser(credentials);
        
        // Store token and user data
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        
        // Persist token to localStorage
        localStorage.setItem('auth_token', response.token);
        
        return response.user;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed';
        console.error('Login error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Register new user
     */
    async register(userData: RegisterRequest) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await registerUser(userData);
        
        // Store token and user data
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;
        
        // Persist token to localStorage
        localStorage.setItem('auth_token', response.token);
        
        return response.user;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Registration failed';
        console.error('Registration error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout user
     */
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      this.error = null;
      
      // Remove token from localStorage
      localStorage.removeItem('auth_token');
      
      console.log('User logged out');
    },

    /**
     * Initialize auth state from stored token
     */
    async initializeAuth() {
      if (this.token) {
        try {
          const response = await getCurrentUser(this.token);
          this.user = response.user;
          this.isAuthenticated = true;
        } catch (error) {
          // Token is invalid, clear it
          this.logout();
        }
      }
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    }
  },
  
  getters: {
    fullName: (state) => {
      if (!state.user) return 'Guest';
      return state.user.name || state.user.email;
    },
    userEmail: (state) => state.user?.email || '',
    isLoggedIn: (state) => state.isAuthenticated && !!state.user
  }
});
