<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  VSheet,
  VCard,
  VCardText,
  VCardTitle,
  VTabs,
  VTab,
  VTabsWindow,
  VTabsWindowItem,
  VTextField,
  VBtn,
  VAlert,
  VAvatar,
  VIcon,
} from 'vuetify/components'
import { mdiBrain } from '@mdi/js'
import { authService } from '@/api/services/auth.service'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const tab = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')

// Login form
const loginEmail = ref('')
const loginPassword = ref('')

// Register form
const regUsername = ref('')
const regFirstName = ref('')
const regLastName = ref('')
const regEmail = ref('')
const regPassword = ref('')

async function handleLogin() {
  if (!loginEmail.value || !loginPassword.value) return
  loading.value = true
  error.value = ''
  try {
    const data = await authService.login({ email: loginEmail.value, password: loginPassword.value })
    authStore.setCredentials(loginEmail.value, loginPassword.value, data.username)
    router.push('/chat')
  } catch {
    error.value = 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  if (!regUsername.value || !regEmail.value || !regPassword.value || !regFirstName.value || !regLastName.value) return
  loading.value = true
  error.value = ''
  try {
    await authService.register({
      username: regUsername.value,
      email: regEmail.value,
      password: regPassword.value,
      firstName: regFirstName.value,
      lastName: regLastName.value,
    })
    // Log in automatically after register
    authStore.setCredentials(regEmail.value, regPassword.value, regUsername.value)
    router.push('/chat')
  } catch {
    error.value = 'Ошибка регистрации. Попробуйте другой email или имя пользователя.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <VSheet class="login-page d-flex align-center justify-center" min-height="100vh">
    <VCard class="login-card" width="420" elevation="8">
      <VCardText class="pa-8">
        <!-- Logo -->
        <div class="d-flex align-center justify-center ga-2 mb-6">
          <VAvatar color="primary" size="48">
            <VIcon :icon="mdiBrain" color="white" size="28" />
          </VAvatar>
          <span class="text-h5 font-weight-bold">PlanAI</span>
        </div>

        <VTabs v-model="tab" color="primary" align-tabs="center" class="mb-6">
          <VTab value="login">Войти</VTab>
          <VTab value="register">Регистрация</VTab>
        </VTabs>

        <VAlert v-if="error" type="error" variant="tonal" class="mb-4" density="compact">
          {{ error }}
        </VAlert>

        <VTabsWindow v-model="tab">
          <!-- Login -->
          <VTabsWindowItem value="login">
            <VCardTitle class="text-center text-h6 mb-4 px-0">Добро пожаловать</VCardTitle>
            <form @submit.prevent="handleLogin">
              <VTextField
                v-model="loginEmail"
                label="Email"
                type="email"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                autocomplete="email"
                required
              />
              <VTextField
                v-model="loginPassword"
                label="Пароль"
                type="password"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                autocomplete="current-password"
                required
              />
              <VBtn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!loginEmail || !loginPassword"
              >
                Войти
              </VBtn>
            </form>
          </VTabsWindowItem>

          <!-- Register -->
          <VTabsWindowItem value="register">
            <VCardTitle class="text-center text-h6 mb-4 px-0">Создать аккаунт</VCardTitle>
            <form @submit.prevent="handleRegister">
              <VTextField
                v-model="regUsername"
                label="Имя пользователя"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                autocomplete="username"
                required
              />
              <VTextField
                v-model="regFirstName"
                label="Имя"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                required
              />
              <VTextField
                v-model="regLastName"
                label="Фамилия"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                required
              />
              <VTextField
                v-model="regEmail"
                label="Email"
                type="email"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                autocomplete="email"
                required
              />
              <VTextField
                v-model="regPassword"
                label="Пароль"
                type="password"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                autocomplete="new-password"
                required
              />
              <VBtn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!regUsername || !regEmail || !regPassword || !regFirstName || !regLastName"
              >
                Зарегистрироваться
              </VBtn>
            </form>
          </VTabsWindowItem>
        </VTabsWindow>
      </VCardText>
    </VCard>
  </VSheet>
</template>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #0f0a1f 0%, #1e1b4b 50%, #2d2560 100%);
}

.v-theme--light .login-page {
  background: linear-gradient(135deg, #fff5f7 0%, #ffe4e8 50%, #fbcfe8 100%);
}
</style>
