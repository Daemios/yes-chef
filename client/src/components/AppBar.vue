<template>
  <v-app-bar app elevation="1" border="b">
    <!-- Logo and brand -->
    <router-link to="/" class="text-decoration-none ml-4">
      <v-toolbar-title class="d-flex align-center text-white">
        <v-avatar size="36" color="accent" class="mr-2">
          <v-icon icon="mdi-chef-hat" color="white"></v-icon>
        </v-avatar>
        <span class="font-weight-medium">Yes</span><span class="text-accent font-weight-medium">.</span>
        <span class="font-weight-light">Chef</span>
      </v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>
    
    <!-- Desktop Navigation -->
    <div class="d-none d-md-flex align-center">
      <!-- For authenticated users -->
      <template v-if="authStore.isAuthenticated">
        <v-tabs v-model="activeTab" color="accent" align-tabs="center" height="64">
          <v-tab value="dashboard" to="/dashboard">
            <v-icon class="mr-1">mdi-view-dashboard</v-icon> Dashboard
          </v-tab>
          <v-tab value="shopping" to="/shopping">
            <v-icon class="mr-1">mdi-cart</v-icon> Shopping List
          </v-tab>
          <v-tab value="nutrition" to="/dietary">
            <v-icon class="mr-1">mdi-nutrition</v-icon> Nutrition
          </v-tab>
        </v-tabs>
          <v-divider vertical class="mx-4"></v-divider>
        
        <!-- Notification Button -->
        <v-btn icon variant="text" class="text-white mr-2" @click="showNotificationPanel = true">
          <v-badge color="accent" content="2" dot>
            <v-icon icon="mdi-bell"></v-icon>
          </v-badge>
        </v-btn>
        
        <!-- User Menu -->
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="ml-1" variant="text">
              <v-avatar size="32" color="accent" class="mr-2">
                <v-img src="https://randomuser.me/api/portraits/women/85.jpg" alt="User"></v-img>
              </v-avatar>
              <span class="text-white d-none d-lg-inline">My Account</span>
              <v-icon class="text-white ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>            <v-list width="220">
            <v-list-item prepend-icon="mdi-account" title="Profile" to="/account/profile"></v-list-item>
            <v-list-item prepend-icon="mdi-cog" title="Settings" to="/account/settings"></v-list-item>
            <v-divider></v-divider>
            <v-list-item prepend-icon="mdi-help-circle" title="Help & Support" to="/support"></v-list-item>
            <v-divider></v-divider>
            <v-list-item prepend-icon="mdi-logout" title="Logout" @click="authStore.toggleAuth"></v-list-item>
          </v-list>
        </v-menu>
      </template>
      
      <!-- For non-authenticated users -->
      <template v-else>
        <v-tabs v-model="publicTab" color="accent" align-tabs="center" height="64">
          <v-tab value="features" to="/features">
            <v-icon class="mr-1">mdi-star</v-icon> Features
          </v-tab>
          <v-tab value="pricing" to="/pricing">
            <v-icon class="mr-1">mdi-tag</v-icon> Pricing
          </v-tab>
          <v-tab value="about" to="/about">
            <v-icon class="mr-1">mdi-information</v-icon> About
          </v-tab>
        </v-tabs>
        
        <v-divider vertical class="mx-4"></v-divider>
        
        <v-btn @click="authStore.toggleAuth" variant="text" class="text-white font-weight-medium mr-2">
          <v-icon start>mdi-login</v-icon> Login
        </v-btn>
        
        <v-btn to="/subscribe" color="white" class="font-weight-bold" elevation="1">
          <v-icon start>mdi-diamond</v-icon> Try for Free
        </v-btn>
      </template>
    </div>
    
    <!-- Mobile Menu Button -->
    <v-app-bar-nav-icon 
      class="d-md-none text-white" 
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    width="280"
  >
    <v-list>
      <v-list-item
        :prepend-avatar="authStore.isAuthenticated ? authStore.user.avatar : undefined"
        :title="authStore.isAuthenticated ? authStore.fullName : 'Menu'"
        :subtitle="authStore.isAuthenticated ? authStore.user.role : ''"
      ></v-list-item>
    </v-list>
    
    <v-divider></v-divider>
    
    <!-- Authenticated User Mobile Menu -->
    <template v-if="authStore.isAuthenticated">      <v-list density="compact" nav>
        <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" to="/dashboard"></v-list-item>
        <v-list-item title="Shopping List" prepend-icon="mdi-cart" to="/shopping"></v-list-item>
        <v-list-item title="Nutrition" prepend-icon="mdi-nutrition" to="/dietary"></v-list-item>
        <v-list-item title="Meal History" prepend-icon="mdi-history" to="/history"></v-list-item>
        <v-list-item title="My Account" prepend-icon="mdi-account-circle" to="/account"></v-list-item>
        <v-list-item title="Notifications" prepend-icon="mdi-bell" @click="showNotificationPanel = true">
          <template v-slot:append>
            <v-badge color="accent" content="2" dot></v-badge>
          </template>
        </v-list-item>
      </v-list>
      
      <v-divider></v-divider>
      
      <v-list density="compact" nav>
        <v-list-item title="Settings" prepend-icon="mdi-cog" to="/settings"></v-list-item>
        <v-list-item title="Help & Support" prepend-icon="mdi-help-circle" to="/support"></v-list-item>
        <v-list-item title="Logout" prepend-icon="mdi-logout" @click="authStore.toggleAuth"></v-list-item>
      </v-list>
    </template>
    
    <!-- Non-Authenticated User Mobile Menu -->
    <template v-else>
      <v-list density="compact" nav>
        <v-list-item title="Home" prepend-icon="mdi-home" to="/"></v-list-item>
        <v-list-item title="Features" prepend-icon="mdi-star" to="/features"></v-list-item>
        <v-list-item title="Pricing" prepend-icon="mdi-tag" to="/pricing"></v-list-item>
        <v-list-item title="About" prepend-icon="mdi-information" to="/about"></v-list-item>
        <v-list-item title="API Docs" prepend-icon="mdi-api" to="/api"></v-list-item>
      </v-list>
      
      <v-divider></v-divider>
      
      <div class="pa-4">
        <v-btn @click="authStore.toggleAuth" block class="mb-3" variant="outlined" color="primary">
          <v-icon start>mdi-login</v-icon> Login
        </v-btn>
        <v-btn to="/subscribe" block color="accent">
          <v-icon start>mdi-diamond</v-icon> Try for Free
        </v-btn>
      </div>
    </template>

    <!-- Remove dark mode toggle from mobile drawer -->
    <v-divider></v-divider>
    <v-list>
      <!-- Theme toggle removed -->
    </v-list>
    
  </v-navigation-drawer>

  <!-- Notification Panel -->
  <v-navigation-drawer
    v-model="showNotificationPanel"
    location="right"
    temporary
    width="350"
  >
    <v-toolbar color="primary" dark>
      <v-toolbar-title>Notifications (2)</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="showNotificationPanel = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    
    <v-list class="pa-2">
      <!-- Recipe notification -->
      <v-card variant="outlined" class="mb-3">
        <v-card-item>
          <template v-slot:prepend>
            <v-avatar color="accent" size="40">
              <v-icon icon="mdi-food-variant" color="white"></v-icon>
            </v-avatar>
          </template>
          <v-card-title class="text-subtitle-1">This week's recipes just generated</v-card-title>
          <v-card-subtitle class="text-caption text-grey">5 minutes ago</v-card-subtitle>
        </v-card-item>
        <v-card-text>
          Your new meal plan is ready! Check out your delicious recipes for this week.
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" color="primary" density="comfortable" to="/dashboard">
            View Recipes
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      
      <!-- Billing notification -->
      <v-card variant="outlined" class="mb-3">
        <v-card-item>
          <template v-slot:prepend>
            <v-avatar color="warning" size="40">
              <v-icon icon="mdi-credit-card" color="white"></v-icon>
            </v-avatar>
          </template>
          <v-card-title class="text-subtitle-1">Billing alert: Subscription renews soon</v-card-title>
          <v-card-subtitle class="text-caption text-grey">1 day ago</v-card-subtitle>
        </v-card-item>
        <v-card-text>
          Your subscription will renew on May 25, 2025. Please ensure your payment details are up to date.
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" color="primary" density="comfortable" to="/account/billing">
            View Billing
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-list>
    
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block variant="tonal" color="primary" to="/notifications">
          View All Notifications
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';

export default defineComponent({
  name: 'AppBar',
  setup() {
    const drawer = ref(false);
    const activeTab = ref(null);
    const publicTab = ref(null);
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const showNotificationPanel = ref(false);
    
    return {
      drawer,
      activeTab,
      publicTab,
      authStore,
      themeStore,
      showNotificationPanel
    };
  }
});
</script>
