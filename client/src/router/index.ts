import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FeaturesView from '../views/FeaturesView.vue'
import PricingView from '../views/PricingView.vue'
import AboutView from '../views/AboutView.vue'
import ApiView from '../views/ApiView.vue'
import LoginView from '../views/LoginView.vue'
import SubscribeView from '../views/SubscribeView.vue'
import DashboardView from '../views/DashboardView.vue'
import ShoppingView from '../views/ShoppingView.vue'
import DietaryView from '../views/DietaryView.vue'
import AccountView from '../views/AccountView.vue'
import SupportView from '../views/SupportView.vue'
import { useAuthStore } from '../stores/auth'

/**
 * Route definitions
 * Each route maps a URL path to a component
 */
const routes: Array<RouteRecordRaw> = [
  // Public routes
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home - Yes Chef'
    }
  },
  {
    path: '/features',
    name: 'features',
    component: FeaturesView
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: PricingView,
    meta: {
      title: 'Pricing - Yes Chef'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: {
      title: 'About - Yes Chef'
    }
  },
  {
    path: '/api',
    name: 'api',
    component: ApiView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/subscribe',
    name: 'subscribe',
    component: SubscribeView
  },
  
  // Authenticated routes
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/shopping',
    name: 'shopping',
    component: ShoppingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dietary',
    name: 'dietary',
    component: DietaryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView,
    meta: { requiresAuth: true }
  },
  {
    path: '/support',
    name: 'support',
    component: SupportView
  },
  
  // Catch all route - redirect to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards - update document title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'Yes Chef';
  next();
});

// Update route guard to use the Pinia store
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // For debugging - create the store instance
  const authStore = useAuthStore()
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
