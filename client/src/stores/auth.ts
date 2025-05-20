import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: {
      id: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/85.jpg',
      role: 'premium',
      memberSince: 'March 15, 2023',
      plan: 'Premium',
      nextBilling: 'June 15, 2023'
    }
  }),
  
  actions: {
    login() {
      // In a real app, this would handle actual authentication
      this.isAuthenticated = true;
      // Would normally fetch user data from API
      console.log('User logged in');
    },
    
    logout() {
      this.isAuthenticated = false;
      console.log('User logged out');
    },
    
    // For debugging - toggle authentication state
    toggleAuth() {
      this.isAuthenticated = !this.isAuthenticated;
      console.log(`Auth toggled: ${this.isAuthenticated ? 'Logged in' : 'Logged out'}`);
    }
  },
  
  getters: {
    fullName: (state) => `${state.user.firstName} ${state.user.lastName}`,
    userRole: (state) => state.user.role
  }
});
