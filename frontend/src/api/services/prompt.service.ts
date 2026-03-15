import { http } from '../http'
import type { PromptRequest, PromptResponse, PromptHistoryItem } from '@/api/types/user.types'

export const promptService = {
  async send(data: PromptRequest): Promise<PromptResponse> {
    const response = await http.post<PromptResponse>('/prompt', data)
    return response.data
  },

  async getHistory(): Promise<PromptHistoryItem[]> {
    const response = await http.get<PromptHistoryItem[]>('/prompt/history')
    return response.data
  },
}
