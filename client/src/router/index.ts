import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FeaturesView from '../views/FeaturesView.vue'
import PricingView from '../views/PricingView.vue'
import AboutView from '../views/AboutView.vue'
import ApiView from '../views/ApiView.vue'
import LoginView from '../views/LoginView.vue'
import SubscribeView from '../views/SubscribeView.vue'
import RecipesView from '../views/RecipesView.vue'
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
const routes: Array<RouteRecordRaw> = [  // Public routes
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home - Yes Chef',
      guestOnly: true
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
  },  {
    path: '/api',
    name: 'api',
    component: ApiView
  },  {
    path: '/meals',
    name: 'meals',
    component: RecipesView,
    meta: {
      title: 'Meal Planning - Yes Chef'
    }
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: RecipesView,
    meta: {
      title: 'Recipes - Yes Chef'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { 
      guestOnly: true,
      title: 'Login - Yes Chef'
    }
  },
  {
    path: '/subscribe',
    name: 'subscribe',
    component: SubscribeView,
    meta: { 
      guestOnly: true,
      title: 'Register - Yes Chef'
    }
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
  // Use base URL from Vite environment variables or fallback to root
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
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  
  // Get the auth store instance
  const authStore = useAuthStore()
  
  console.log(`Route guard for ${to.path}: Auth state is ${authStore.isAuthenticated ? 'authenticated' : 'not authenticated'}`)
  
  // Redirect to dashboard if user tries to access login/register/home while logged in
  if (guestOnly && authStore.isAuthenticated) {
    console.log(`Redirecting from ${to.path} to /dashboard (user is authenticated)`)
    next('/dashboard')
  }
  // Redirect to login if user tries to access protected route while logged out
  else if (requiresAuth && !authStore.isAuthenticated) {
    console.log(`Redirecting from ${to.path} to /login (auth required)`)
    next('/login')
  } else {
    next()
  }
})

export default router
