import api from '@/lib/axios'
import { WikiItem, PaginatedResponse, WikiCategory } from '@/types'
import { useLoreStore } from '@/store/useLoreStore'

export const wikiService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    gameId?: string
    category?: WikiCategory
  }): Promise<PaginatedResponse<WikiItem>> {
    const { data } = await api.get<PaginatedResponse<WikiItem>>('/wiki', {
      params,
    })
    
    // Alimenta o store
    const { setWikiItems, setWikiPagination } = useLoreStore.getState()
    setWikiItems(data.data)
    setWikiPagination({
      page: data.page,
      lastPage: data.lastPage,
      total: data.total
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
    
    // Atualiza store local
    const state = useLoreStore.getState()
    state.setWikiItems(state.wikiItems.filter(item => item.id !== id))
  },

  async uploadImage(id: string, file: File): Promise<WikiItem> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<WikiItem>(`/wiki/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },
}
