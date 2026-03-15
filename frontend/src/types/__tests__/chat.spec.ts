import { describe, it, expect } from 'vitest'
import type { Message, ChatSession, HolidayPlan, RouteOption, SeatOption } from '../chat'

describe('TypeScript Types', () => {
  describe('Message', () => {
    it('should create a valid user message object', () => {
      const message: Message = {
        id: 'msg-1',
        role: 'user',
        content: 'Hello',
        timestamp: new Date(),
      }

      expect(message.id).toBe('msg-1')
      expect(message.role).toBe('user')
      expect(message.content).toBe('Hello')
    })

    it('should create a valid assistant message object', () => {
      const message: Message = {
        id: 'msg-2',
        role: 'assistant',
        content: 'Hi there!',
        timestamp: new Date(),
      }

      expect(message.role).toBe('assistant')
    })
  })

  describe('ChatSession', () => {
    it('should create a valid chat session object', () => {
      const session: ChatSession = {
        id: 'session-1',
        title: 'My Holiday Plan',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(session.id).toBe('session-1')
      expect(session.title).toBe('My Holiday Plan')
      expect(Array.isArray(session.messages)).toBe(true)
    })
  })

  describe('HolidayPlan', () => {
    it('should create a valid holiday plan object', () => {
      const plan: HolidayPlan = {
        destination: 'Paris',
        dates: {
          start: '2024-06-01',
          end: '2024-06-10',
        },
        routes: [],
        budget: {
          total: 1500,
          currency: 'USD',
        },
      }

      expect(plan.destination).toBe('Paris')
      expect(plan.dates.start).toBe('2024-06-01')
      expect(plan.budget.total).toBe(1500)
    })

    it('should create a holiday plan with selected route', () => {
      const route: RouteOption = {
        id: 'route-1',
        type: 'flight',
        departure: 'NYC',
        arrival: 'PAR',
        duration: '7h',
        price: 500,
        seats: [],
      }

      const plan: HolidayPlan = {
        destination: 'Paris',
        dates: { start: '2024-06-01', end: '2024-06-10' },
        routes: [route],
        selectedRoute: route,
        budget: { total: 1500, currency: 'USD' },
      }

      expect(plan.selectedRoute).toBeDefined()
      expect(plan.selectedRoute?.type).toBe('flight')
    })
  })

  describe('RouteOption', () => {
    it('should create a valid route option', () => {
      const route: RouteOption = {
        id: 'route-1',
        type: 'train',
        departure: 'London',
        arrival: 'Paris',
        duration: '2h 15m',
        price: 150,
        seats: [],
      }

      expect(route.type).toBe('train')
      expect(route.price).toBe(150)
    })

    it('should support all route types', () => {
      const types: Array<RouteOption['type']> = ['flight', 'train', 'bus', 'car']

      types.forEach((type) => {
        const route: RouteOption = {
          id: 'route-1',
          type,
          departure: 'A',
          arrival: 'B',
          duration: '1h',
          price: 100,
          seats: [],
        }
        expect(route.type).toBe(type)
      })
    })
  })

  describe('SeatOption', () => {
    it('should create a valid seat option', () => {
      const seat: SeatOption = {
        id: 'seat-1',
        name: '12A',
        available: true,
        price: 50,
      }

      expect(seat.name).toBe('12A')
      expect(seat.available).toBe(true)
    })
  })
})
