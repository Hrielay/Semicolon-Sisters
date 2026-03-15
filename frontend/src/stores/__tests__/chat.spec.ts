import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from '../chat'

describe('Chat Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty sessions', () => {
    const store = useChatStore()
    expect(store.sessions).toEqual([])
    expect(store.currentSessionId).toBeNull()
    expect(store.isSidebarOpen).toBe(true)
  })

  it('should create a new session', () => {
    const store = useChatStore()
    const sessionId = store.createSession()

    expect(sessionId).toBeDefined()
    expect(store.sessions).toHaveLength(1)
    expect(store.currentSessionId).toBe(sessionId)
    expect(store.currentSession).toBeDefined()
    expect(store.currentSession?.title).toBe('New Holiday Plan')
  })

  it('should add a message to the current session', () => {
    const store = useChatStore()
    store.createSession()

    store.addMessage('user', 'Hello, I want to plan a holiday')

    expect(store.messages).toHaveLength(1)
    expect(store.messages[0]?.role).toBe('user')
    expect(store.messages[0]?.content).toBe('Hello, I want to plan a holiday')
  })

  it('should update session title from first user message', () => {
    const store = useChatStore()
    store.createSession()
    
    store.addMessage('user', 'Plan a trip to Paris for summer')
    
    expect(store.currentSession?.title).toBe('Plan a trip to Paris for summe...')
  })

  it('should select a session', () => {
    const store = useChatStore()
    const sessionId1 = store.createSession()
    const sessionId2 = store.createSession()

    store.selectSession(sessionId1)
    expect(store.currentSessionId).toBe(sessionId1)

    store.selectSession(sessionId2)
    expect(store.currentSessionId).toBe(sessionId2)
  })

  it('should delete a session', () => {
    const store = useChatStore()
    const sessionId1 = store.createSession()
    const sessionId2 = store.createSession()

    store.deleteSession(sessionId1)

    expect(store.sessions).toHaveLength(1)
    expect(store.sessions[0]?.id).toBe(sessionId2)
  })

  it('should toggle sidebar', () => {
    const store = useChatStore()
    expect(store.isSidebarOpen).toBe(true)

    store.toggleSidebar()
    expect(store.isSidebarOpen).toBe(false)

    store.toggleSidebar()
    expect(store.isSidebarOpen).toBe(true)
  })

  it('should clear current session messages', () => {
    const store = useChatStore()
    store.createSession()
    store.addMessage('user', 'Test message')

    expect(store.messages).toHaveLength(1)

    store.clearCurrentSession()

    expect(store.messages).toHaveLength(0)
    expect(store.holidayPlan).toBeNull()
  })

  it('should set holiday plan', () => {
    const store = useChatStore()
    const plan = {
      destination: 'Paris',
      dates: { start: '2024-06-01', end: '2024-06-10' },
      routes: [],
      budget: { total: 1000, currency: 'USD' },
    }

    store.setHolidayPlan(plan)

    expect(store.holidayPlan).toEqual(plan)
  })
})
