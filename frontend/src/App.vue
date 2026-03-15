<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VApp } from 'vuetify/components'
import LoadingSpinner from './components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const isLoadingTimeout = ref<number | null>(null)
const currentComponent = shallowRef()

const showLoading = () => {
  if (isLoadingTimeout.value) {
    clearTimeout(isLoadingTimeout.value)
  }
  isLoading.value = true
}

const hideLoading = () => {
  if (isLoadingTimeout.value) {
    clearTimeout(isLoadingTimeout.value)
  }
  isLoadingTimeout.value = window.setTimeout(() => {
    isLoading.value = false
  }, 50)
}

const handleLoadingChange = (event: CustomEvent<{ loading: boolean }>) => {
  if (event.detail.loading) {
    showLoading()
  } else {
    hideLoading()
  }
}

// Force re-render on route change
watch(
  () => route.fullPath,
  async (to, from) => {
    // Wait for router to complete navigation
    await router.isReady()
    // Force component update
    currentComponent.value = undefined
    await new Promise(resolve => setTimeout(resolve, 0))
    currentComponent.value = route.matched[0]?.components?.default
    hideLoading()
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('loading-change', handleLoadingChange as EventListener)
  hideLoading()
})

onUnmounted(() => {
  window.removeEventListener('loading-change', handleLoadingChange as EventListener)
  if (isLoadingTimeout.value) {
    clearTimeout(isLoadingTimeout.value)
  }
})
</script>

<template>
  <VApp class="v-app-full">
    <LoadingSpinner :class="{ visible: isLoading }" />
    <RouterView v-slot="{ Component, route: currentRoute }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="currentRoute.fullPath" />
      </transition>
    </RouterView>
  </VApp>
</template>

<style>
.v-app-full {
  height: 100vh;
  width: 100%;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100%;
}

/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
