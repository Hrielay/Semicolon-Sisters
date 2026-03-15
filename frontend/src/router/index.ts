import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/ChatView.vue'
import LandingView from '../views/LandingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Always wait for the transition to complete
    return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        } else {
          resolve({ top: 0 })
        }
      }, 100)
    })
  },
})

// Loading state management
const setLoading = (loading: boolean) => {
  window.dispatchEvent(new CustomEvent('loading-change', { detail: { loading } }))
}

router.beforeEach((to, from, next) => {
  // Only show loader for actual route changes (not hash changes)
  if (to.path !== from.path) {
    setLoading(true)
    next()
  } else {
    next()
  }
})

router.afterEach(() => {
  // Delay hiding loader to ensure component is rendered
  setTimeout(() => {
    setLoading(false)
  }, 300)
})

export default router
