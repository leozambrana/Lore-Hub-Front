import api from '@/lib/axios'
import { Theory, PaginationMeta } from '@/types'
import { useLoreStore } from '@/store/useLoreStore'

export const theoriesService = {
  async getTheoryById(id: string): Promise<Theory> {
    const { data } = await api.get<Theory>(`/theories/${id}`)
    useLoreStore.getState().setCurrentTheory(data)
    return data
  },

  async getTheoriesBySort(sort: string, limit: number = 15): Promise<Theory[]> {
    const { data } = await api.get(`/theories?sort=${sort}&limit=${limit}`)
    useLoreStore.getState().setTheories(data.data)
    return data.data
  },

  async getAllTheories(
    page: number = 1,
    limit: number = 10,
    gameId?: string,
    sort: string = 'recent',
    search: string = ''
  ): Promise<{ data: Theory[], meta: PaginationMeta }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort,
      search,
    })
    if (gameId) params.append('gameId', gameId)

    const { data } = await api.get(`/theories?${params.toString()}`)
    const { setTheories, setTheoryPagination } = useLoreStore.getState()
    setTheories(data.data)
    setTheoryPagination({
      page: data.meta.page,
      lastPage: data.meta.lastPage,
      total: data.meta.total
    })
    return data
  },

  async createTheory(payload: Partial<Theory>): Promise<Theory> {
    const { data } = await api.post<Theory>('/theories', payload)
    return data
  },

  async updateTheory(id: string, payload: Partial<Theory>): Promise<Theory> {
    const { data } = await api.patch<Theory>(`/theories/${id}`, payload)
    const state = useLoreStore.getState()
    if (state.currentTheory?.id === id) {
      state.setCurrentTheory(data)
    }
    return data
  },

  async deleteTheory(id: string): Promise<void> {
    await api.delete(`/theories/${id}`)
    const state = useLoreStore.getState()
    state.setTheories(state.theories.filter(t => t.id !== id))
  },

  async getSystemStats(): Promise<{ totalTheories: number; totalGames: number; topTheorists: { id: string; username: string; avatarUrl: string | null; _count: { theories: number } }[] }> {
    const { data } = await api.get('/theories/system-stats')
    return data
  },

  async toggleVote(theoryId: string, type: 'UP' | 'DOWN'): Promise<{ status: string, type: 'UP' | 'DOWN' | null }> {
    const { data } = await api.post(`/theories/${theoryId}/votes`, { type })
    
    // Sincroniza o voto no Store
    useLoreStore.getState().updateUserVote(theoryId, data.type)
    
    return data
  },

  async getMyVote(theoryId: string): Promise<{ type: 'UP' | 'DOWN' | null }> {
    const { data } = await api.get<{ type: 'UP' | 'DOWN' | null }>(`/theories/${theoryId}/votes/me`)
    
    // Alimenta o Store
    useLoreStore.getState().updateUserVote(theoryId, data.type)
    
    return data
  },

  async getMyVotesBatch(theoryIds: string[]): Promise<Record<string, 'UP' | 'DOWN'>> {
    if (theoryIds.length === 0) return {}
    const ids = theoryIds.join(',')
    const { data } = await api.get<Record<string, 'UP' | 'DOWN'>>(`/theories/my-votes?ids=${ids}`)
    
    // Mescla os votos em lote no Store
    const state = useLoreStore.getState()
    state.setUserVotes({ ...state.userVotes, ...data })
    
    return data
  },
}
