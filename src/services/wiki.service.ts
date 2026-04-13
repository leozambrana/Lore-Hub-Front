import api from '@/lib/axios'
import { WikiItem, PaginatedResponse, WikiCategory } from '@/types'

export const wikiService = {
  async getAll(params?: {
    page?: number
    limit?: number
    gameId?: string
    category?: WikiCategory
  }): Promise<PaginatedResponse<WikiItem>> {
    const { data } = await api.get<PaginatedResponse<WikiItem>>('/wiki', {
      params,
    })
    return data
  },

  async getById(id: string): Promise<WikiItem> {
    const { data } = await api.get<WikiItem>(`/wiki/${id}`)
    return data
  },

  async create(payload: Partial<WikiItem>): Promise<WikiItem> {
    const { data } = await api.post<WikiItem>('/wiki', payload)
    return data
  },

  async update(id: string, payload: Partial<WikiItem>): Promise<WikiItem> {
    const { data } = await api.patch<WikiItem>(`/wiki/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/wiki/${id}`)
  },
}
