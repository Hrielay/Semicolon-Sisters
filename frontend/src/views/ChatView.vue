<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  VMain,
  VCard,
  VCardText,
  VBtn,
  VIcon,
  VChip,
  VNavigationDrawer,
  VAppBar,
  VSpacer,
  VListSubheader,
  VMenu,
  VList,
  VListItem,
  VListItemTitle,
} from 'vuetify/components'
import {
  mdiMenu,
  mdiDownload,
  mdiDelete,
  mdiMessageTextOutline,
  mdiPlus,
  mdiWhiteBalanceSunny,
  mdiWeatherNight,
  mdiAirplane,
  mdiBed,
  mdiMapMarker,
  mdiDotsVertical,
} from '@mdi/js'
import { useChatStore } from '@/stores/chat'
import { downloadPDF } from '@/services/pdfExport'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ChatHistory from '@/components/chat/ChatHistory.vue'
import { useTheme } from 'vuetify'

const chatStore = useChatStore()
const messagesContainer = ref<HTMLElement | null>(null)
const theme = useTheme()
const showMenu = ref(false)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 100)
}

// Auto-detect system theme on mount
onMounted(() => {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme) {
    theme.global.name.value = savedTheme
  } else {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.global.name.value = prefersDark ? 'dark' : 'light'
  }

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      theme.global.name.value = e.matches ? 'dark' : 'light'
    }
  }
  mediaQuery.addEventListener('change', handleChange)

  scrollToBottom()
  if (!chatStore.currentSessionId) {
    chatStore.createSession()
  }
})

// Save theme preference when changed
const handleThemeToggle = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
}

const handleSendMessage = (content: string) => {
  chatStore.addMessage('user', content)
  scrollToBottom()

  // Simulate AI response (replace with actual AI integration)
  setTimeout(() => {
    const responses: string[] = [
      "I'd be happy to help you plan your holiday! 🌴 Could you tell me more about your preferred destination?",
      'Great choice! Let me search for the best routes and prices for you. ✈️',
      'I found several route options. Would you like me to show you the details?',
      "I've selected the best seats available for your journey. Would you like to proceed?",
    ]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]!
    chatStore.addMessage('assistant', randomResponse)
    scrollToBottom()
  }, 1000)
}

const handleExportPDF = () => {
  if (chatStore.holidayPlan) {
    downloadPDF(chatStore.holidayPlan, chatStore.messages)
  }
  showMenu.value = false
}

const handleNewChat = () => {
  chatStore.createSession()
  showMenu.value = false
}

const handleSelectSession = (sessionId: string) => {
  chatStore.selectSession(sessionId)
}

const handleDeleteSession = (sessionId: string) => {
  chatStore.deleteSession(sessionId)
}

const handleClearChat = () => {
  chatStore.clearCurrentSession()
  showMenu.value = false
}
</script>

<template>
  <VNavigationDrawer
    v-model="chatStore.isSidebarOpen"
    :temporary="$vuetify.display.smAndDown"
    :permanent="$vuetify.display.mdAndUp"
    :scrim="$vuetify.display.smAndDown"
    class="chat-sidebar"
    width="280"
  >
    <!-- Sidebar Header with Title -->
    <div class="sidebar-header d-flex align-center pa-4 border-b">
      <span class="text-h6 font-weight-bold">Holiday AI</span>
    </div>

    <!-- New Chat Button -->
    <div class="pa-4">
      <VBtn color="primary" block variant="elevated" @click="handleNewChat">
        <VIcon :icon="mdiPlus" start />
        New Chat
      </VBtn>
    </div>

    <!-- Chat History Label -->
    <VListSubheader class="text-caption px-4">Recent Chats</VListSubheader>

    <!-- Chat History List -->
    <ChatHistory
      :sessions="chatStore.sessions"
      :current-session-id="chatStore.currentSessionId"
      @create="handleNewChat"
      @select="handleSelectSession"
      @delete="handleDeleteSession"
    />
  </VNavigationDrawer>

  <!-- Top App Bar - Clean with only menu button -->
  <VAppBar color="transparent" density="compact" height="56" class="top-app-bar">
    <VBtn v-if="$vuetify.display.smAndDown" icon variant="text" @click="chatStore.toggleSidebar">
      <VIcon :icon="mdiMenu" />
    </VBtn>

    <VSpacer />

    <!-- Three Dots Menu -->
    <VMenu v-model="showMenu" :close-on-content-click="false" location="bottom end">
      <template #activator="{ props }">
        <VBtn icon variant="text" v-bind="props">
          <VIcon :icon="mdiDotsVertical" />
        </VBtn>
      </template>

      <VList density="compact" min-width="200">
        <!-- Theme Toggle -->
        <VListItem @click="handleThemeToggle">
          <template #prepend>
            <VIcon :icon="theme.global.current.value.dark ? mdiWhiteBalanceSunny : mdiWeatherNight" />
          </template>
          <VListItemTitle>
            {{ theme.global.current.value.dark ? 'Light Theme' : 'Dark Theme' }}
          </VListItemTitle>
        </VListItem>

        <!-- Export PDF (only if holiday plan exists) -->
        <VListItem v-if="chatStore.holidayPlan" @click="handleExportPDF">
          <template #prepend>
            <VIcon :icon="mdiDownload" />
          </template>
          <VListItemTitle>Export PDF</VListItemTitle>
        </VListItem>

        <!-- Clear Chat -->
        <VListItem @click="handleClearChat">
          <template #prepend>
            <VIcon :icon="mdiDelete" color="error" />
          </template>
          <VListItemTitle class="text-error">Clear Chat</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VAppBar>

  <VMain class="chat-main">
    <div class="chat-layout">
      <!-- Hero Section with Gradient Background (only shown when no messages) -->
      <VSheet v-if="chatStore.messages.length === 0" class="hero-section">
        <div class="hero-content mx-auto pa-8 text-center">
          <h1 class="text-h4 text-md-h3 font-weight-bold mb-4 hero-title">
            Your Holiday Magic ✨
          </h1>
          <p class="text-body-1 mb-8 hero-subtitle">
            Plan your dream vacation in seconds with AI assistance
          </p>

          <div class="d-flex flex-wrap ga-3 justify-center mb-8">
            <VChip color="primary" variant="tonal" size="large" class="pa-4">
              <VIcon :icon="mdiAirplane" start />
              Find Routes
            </VChip>
            <VChip color="secondary" variant="tonal" size="large" class="pa-4">
              <VIcon :icon="mdiBed" start />
              Select Hotels
            </VChip>
            <VChip color="accent" variant="tonal" size="large" class="pa-4">
              <VIcon :icon="mdiMapMarker" start />
              Compare Prices
            </VChip>
          </div>

          <!-- Greeting Card -->
          <VCard class="greeting-card mx-auto" max-width="600" variant="elevated">
            <VCardText class="d-flex align-center ga-4 pa-6">
              <VIcon :icon="mdiMessageTextOutline" size="large" color="primary" />
              <div>
                <div class="text-h6 font-weight-bold">{{ greeting }}! 👋</div>
                <div class="text-medium-emphasis mt-1">
                  I'm your holiday planning assistant. Tell me where you'd like to go and I'll help
                  you plan everything.
                </div>
              </div>
            </VCardText>
          </VCard>
        </div>
      </VSheet>

      <!-- Messages Area -->
      <div class="messages-section">
        <div ref="messagesContainer" class="messages-container pa-4">
          <div class="messages-wrapper mx-auto" style="max-width: 800px; width: 100%">
            <ChatMessage v-for="message in chatStore.messages" :key="message.id" :message="message" />
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-section">
        <div class="input-wrapper mx-auto pa-4" style="max-width: 800px; width: 100%">
          <VCard class="input-card" variant="elevated">
            <ChatInput @send="handleSendMessage" />
          </VCard>
        </div>
      </div>
    </div>
  </VMain>
</template>

<style scoped>
.chat-main {
  overflow: hidden;
  height: 100dvh; /* Use dynamic viewport height for mobile */
}

.chat-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
}

/* When no messages, center the content vertically */
.chat-layout:not(:has(.messages-section)) {
  justify-content: space-between;
}

.chat-layout:not(:has(.messages-section)) .hero-section {
  flex-grow: 0;
}

.chat-layout:not(:has(.messages-section)) .input-section {
  margin-top: auto;
  margin-bottom: 2rem;
}

/* Dark theme gradient */
.v-theme--dark .chat-main {
  background: linear-gradient(135deg, #0F0A1F 0%, #1E1B4B 50%, #2D2560 100%);
}

/* Light theme gradient */
.v-theme--light .chat-main {
  background: linear-gradient(135deg, #FFF5F7 0%, #FFE4E8 30%, #FBCFE8 70%, #F9A8D4 100%);
}

.top-app-bar {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(124, 92, 255, 0.2);
  flex-shrink: 0;
}

/* Dark theme app bar */
.v-theme--dark .top-app-bar {
  background: rgba(15, 10, 31, 0.8) !important;
  border-bottom-color: rgba(124, 92, 255, 0.2);
}

/* Light theme app bar */
.v-theme--light .top-app-bar {
  background: rgba(255, 255, 255, 0.8) !important;
  border-bottom-color: rgba(244, 114, 182, 0.2);
}

.hero-section {
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(124, 92, 255, 0.15) 0%, transparent 100%);
  padding: 2rem 1rem 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Light theme hero section */
.v-theme--light .hero-section {
  background: linear-gradient(180deg, rgba(244, 114, 182, 0.2) 0%, transparent 100%);
}

.hero-content {
  width: 100%;
}

.hero-title {
  background: linear-gradient(90deg, #7C5CFF, #A78BFA, #C4B5FD);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem !important;
  line-height: 1.2;
}

/* Light theme hero title */
.v-theme--light .hero-title {
  background: linear-gradient(90deg, #F472B6, #FB923C, #FCA5A5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

/* Light theme subtitle */
.v-theme--light .hero-subtitle {
  color: rgba(31, 41, 55, 0.7);
}

.greeting-card {
  background: rgba(124, 92, 255, 0.1);
  border: 1px solid rgba(124, 92, 255, 0.3);
}

/* Light theme greeting card */
.v-theme--light .greeting-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(244, 114, 182, 0.3);
}

.messages-section {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0.5rem;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-section {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

/* Centered input (when no messages) - positioned below hero */
.input-centered {
  padding: 1rem 0 2rem 0;
  background: transparent;
  margin-top: auto; /* Push to center */
  margin-bottom: 2rem;
}

/* Fixed input at bottom (when chatting) */
.input-fixed {
  background: linear-gradient(transparent, rgba(15, 10, 31, 0.9) 30%);
  padding: 0.5rem 0;
}

/* Light theme input section */
.v-theme--light .input-fixed {
  background: linear-gradient(transparent, rgba(255, 245, 247, 0.9) 30%);
}

.input-card {
  background: rgba(30, 27, 75, 0.8);
  border: 1px solid rgba(124, 92, 255, 0.3);
}

/* Light theme input card */
.v-theme--light .input-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(244, 114, 182, 0.3);
}

.chat-sidebar {
  background: rgba(15, 10, 31, 0.95) !important;
  border-right: 1px solid rgba(124, 92, 255, 0.2);
}

/* Light theme sidebar */
.v-theme--light .chat-sidebar {
  background: rgba(255, 255, 255, 0.95) !important;
  border-right: 1px solid rgba(244, 114, 182, 0.2);
}

.border-b {
  border-bottom: 1px solid rgba(124, 92, 255, 0.2) !important;
}

/* Light theme border */
.v-theme--light .border-b {
  border-bottom: 1px solid rgba(244, 114, 182, 0.2) !important;
}

/* Custom scrollbar - Dark theme */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(124, 92, 255, 0.3);
  border-radius: 3px;
}

/* Light theme scrollbar */
.v-theme--light .messages-container::-webkit-scrollbar-thumb {
  background: rgba(244, 114, 182, 0.3);
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .chat-main {
    height: 100dvh;
    height: -webkit-fill-available; /* For iOS Safari */
  }

  .hero-section {
    padding: 0.75rem;
  }

  .hero-content {
    padding: 0 !important;
  }

  .hero-title {
    font-size: 1.25rem !important;
  }

  .hero-subtitle {
    font-size: 0.75rem;
  }

  /* Hide chips on mobile to save space */
  .hero-section .d-flex {
    display: none !important;
  }

  .greeting-card {
    margin-top: 0.5rem;
  }

  .greeting-card .v-card-text {
    padding: 0.75rem !important;
  }

  .input-section {
    padding: 0.25rem 0;
  }

  .input-wrapper {
    padding: 0.25rem !important;
  }

  .messages-container {
    padding: 0.25rem;
  }
}

/* iPhone safe area insets */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .input-section {
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
  }

  .top-app-bar {
    padding-top: env(safe-area-inset-top);
  }
}
</style>
