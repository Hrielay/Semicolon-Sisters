import { describe, it, expect } from 'vitest'
import { generatePDFContent, downloadPDF, printPDF } from '../pdfExport'
import type { HolidayPlan, Message } from '@/types/chat'

describe('PDF Export Service', () => {
  const mockPlan: HolidayPlan = {
    destination: 'Paris, France',
    dates: {
      start: '2024-06-01',
      end: '2024-06-10',
    },
    routes: [
      {
        id: 'route-1',
        type: 'flight',
        departure: 'New York (JFK)',
        arrival: 'Paris (CDG)',
        duration: '7h 30m',
        price: 650,
        seats: [
          { id: 'seat-1', name: '12A', available: true, price: 50 },
          { id: 'seat-2', name: '12B', available: false, price: 50 },
        ],
      },
      {
        id: 'route-2',
        type: 'train',
        departure: 'London',
        arrival: 'Paris',
        duration: '2h 15m',
        price: 150,
        seats: [],
      },
    ],
    selectedRoute: {
      id: 'route-1',
      type: 'flight',
      departure: 'New York (JFK)',
      arrival: 'Paris (CDG)',
      duration: '7h 30m',
      price: 650,
      seats: [],
    },
    budget: {
      total: 1500,
      currency: 'USD',
    },
  }

  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      role: 'user',
      content: 'I want to plan a trip to Paris',
      timestamp: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'Great choice! Paris is wonderful in June.',
      timestamp: new Date('2024-01-01T10:01:00Z'),
    },
  ]

  describe('generatePDFContent', () => {
    it('should generate HTML content with plan details', () => {
      const html = generatePDFContent(mockPlan, mockMessages)

      expect(html).toContain('Paris, France')
      expect(html).toContain('2024-06-01')
      expect(html).toContain('2024-06-10')
      expect(html).toContain('1500 USD')
      expect(html).toContain('flight')
      expect(html).toContain('New York (JFK)')
      expect(html).toContain('Paris (CDG)')
    })

    it('should include route information', () => {
      const html = generatePDFContent(mockPlan, mockMessages)

      expect(html).toContain('7h 30m')
      expect(html).toContain('650')
      expect(html).toContain('Available seats: 1')
    })

    it('should include chat history', () => {
      const html = generatePDFContent(mockPlan, mockMessages)

      expect(html).toContain('I want to plan a trip to Paris')
      expect(html).toContain('Great choice! Paris is wonderful in June.')
      expect(html).toContain('👤 You')
      expect(html).toContain('🤖 AI Assistant')
    })

    it('should mark selected route', () => {
      const html = generatePDFContent(mockPlan, mockMessages)

      expect(html).toContain('route-card selected')
      expect(html).toContain('✓ Selected')
    })

    it('should include proper HTML structure', () => {
      const html = generatePDFContent(mockPlan, mockMessages)

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html>')
      expect(html).toContain('</html>')
      expect(html).toContain('<style>')
    })
  })

  describe('downloadPDF', () => {
    it('should be a function', () => {
      expect(typeof downloadPDF).toBe('function')
    })
  })

  describe('printPDF', () => {
    it('should be a function', () => {
      expect(typeof printPDF).toBe('function')
    })
  })
})
