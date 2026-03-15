import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ChatView from '../views/ChatView.vue'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(savedPosition ?? { top: 0 })
      }, 100)
    })
  },
})

const setLoading = (loading: boolean) => {
  window.dispatchEvent(new CustomEvent('loading-change', { detail: { loading } }))
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn) {
      next({ name: 'login' })
      return
    }
  }
  if (to.path !== from.path) {
    setLoading(true)
  }
  next()
})

router.afterEach(() => {
  setTimeout(() => setLoading(false), 300)
})

export default router
