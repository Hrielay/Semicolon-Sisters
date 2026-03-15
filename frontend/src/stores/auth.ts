import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const email = ref(localStorage.getItem('auth_email') ?? '')
  const password = ref(localStorage.getItem('auth_password') ?? '')
  const username = ref(localStorage.getItem('auth_username') ?? '')

  const isLoggedIn = computed(() => !!email.value && !!password.value)

  const basicAuthHeader = computed(() =>
    isLoggedIn.value ? 'Basic ' + btoa(`${email.value}:${password.value}`) : null,
  )

  function setCredentials(emailVal: string, passwordVal: string, usernameVal: string) {
    email.value = emailVal
    password.value = passwordVal
    username.value = usernameVal
    localStorage.setItem('auth_email', emailVal)
    localStorage.setItem('auth_password', passwordVal)
    localStorage.setItem('auth_username', usernameVal)
  }

  function clearCredentials() {
    email.value = ''
    password.value = ''
    username.value = ''
    localStorage.removeItem('auth_email')
    localStorage.removeItem('auth_password')
    localStorage.removeItem('auth_username')
  }

  return { email, username, isLoggedIn, basicAuthHeader, setCredentials, clearCredentials }
})
