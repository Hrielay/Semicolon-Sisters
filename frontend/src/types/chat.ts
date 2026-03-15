export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface HolidayPlan {
  destination: string
  dates: {
    start: string
    end: string
  }
  routes: RouteOption[]
  selectedRoute?: RouteOption
  budget: {
    total: number
    currency: string
  }
}

export interface RouteOption {
  id: string
  type: 'flight' | 'train' | 'bus' | 'car'
  departure: string
  arrival: string
  duration: string
  price: number
  seats: SeatOption[]
}

export interface SeatOption {
  id: string
  name: string
  available: boolean
  price: number
}
