import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

/**
 * Route definitions
 * Each route maps a URL path to a component
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'Home - Yes Chef'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'About - Yes Chef'
    }
  },
  {
    path: '/recipes/:id',
    name: 'recipe-detail',
    component: () => import('../views/RecipeDetailView.vue'),
    meta: {
      title: 'Recipe Details - Yes Chef'
    }
  },  // 404 route - always keep this last
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found'
    }
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
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

export default router;
