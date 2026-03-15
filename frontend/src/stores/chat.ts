import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message, ChatSession, HolidayPlan } from '@/types/chat'

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isSidebarOpen = ref(true)
  const holidayPlan = ref<HolidayPlan | null>(null)

  const currentSession = computed(() => {
    return sessions.value.find((s) => s.id === currentSessionId.value) || null
  })

  const messages = computed(() => {
    return currentSession.value?.messages || []
  })

  function createSession(): string {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Holiday Plan',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    sessions.value.unshift(newSession)
    currentSessionId.value = newSession.id
    return newSession.id
  }

  function addMessage(role: 'user' | 'assistant', content: string) {
    if (!currentSessionId.value) {
      createSession()
    }

    const session = sessions.value.find((s) => s.id === currentSessionId.value)
    if (session) {
      const message: Message = {
        id: generateId(),
        role,
        content,
        timestamp: new Date(),
      }
      session.messages.push(message)
      session.updatedAt = new Date()

      // Update title from first user message
      if (role === 'user' && session.messages.length === 1) {
        session.title = content.substring(0, 30) + (content.length > 30 ? '...' : '')
      }
    }
  }

  function selectSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  function deleteSession(sessionId: string) {
    sessions.value = sessions.value.filter((s) => s.id !== sessionId)
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = sessions.value.length > 0 ? (sessions.value[0]?.id ?? null) : null
    }
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function setHolidayPlan(plan: HolidayPlan) {
    holidayPlan.value = plan
  }

  function clearCurrentSession() {
    if (currentSessionId.value) {
      const session = sessions.value.find((s) => s.id === currentSessionId.value)
      if (session) {
        session.messages = []
        session.updatedAt = new Date()
      }
    }
    holidayPlan.value = null
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    messages,
    isSidebarOpen,
    holidayPlan,
    createSession,
    addMessage,
    selectSession,
    deleteSession,
    toggleSidebar,
    setHolidayPlan,
    clearCurrentSession,
  }
})
