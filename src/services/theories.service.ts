import api from '@/lib/axios'
import { Theory } from '@/types'

export const theoriesService = {
  async getTheoryById(id: string): Promise<Theory> {
    const { data } = await api.get<Theory>(`/theories/${id}`)
    return data
  },

  async getTheoriesBySort(sort: string, limit: number = 15): Promise<Theory[]> {
    const { data } = await api.get(`/theories?sort=${sort}&limit=${limit}`)
    return data.data
  },

  async createTheory(payload: Partial<Theory>): Promise<Theory> {
    const { data } = await api.post<Theory>('/theories', payload)
    return data
  },

  async updateTheory(id: string, payload: Partial<Theory>): Promise<Theory> {
    const { data } = await api.patch<Theory>(`/theories/${id}`, payload)
    return data
  },

  async deleteTheory(id: string): Promise<void> {
    await api.delete(`/theories/${id}`)
  },

  async getSystemStats(): Promise<{ totalTheories: number; totalGames: number; topTheorists: { id: string; username: string; avatarUrl: string | null; _count: { theories: number } }[] }> {
    const { data } = await api.get('/theories/system-stats')
    return data
  },

  async toggleVote(theoryId: string, type: 'UP' | 'DOWN'): Promise<{ status: string, type: 'UP' | 'DOWN' | null }> {
    const { data } = await api.post(`/theories/${theoryId}/votes`, { type })
    return data
  },

  async getMyVote(theoryId: string): Promise<{ type: 'UP' | 'DOWN' | null }> {
    const { data } = await api.get(`/theories/${theoryId}/votes/me`)
    return data
  },

  /**
   * Busca os votos do usuário para múltiplas teorias em uma única request.
   * @returns Mapa { [theoryId]: 'UP' | 'DOWN' } — teorias sem voto são omitidas (= null)
   */
  async getMyVotesBatch(theoryIds: string[]): Promise<Record<string, 'UP' | 'DOWN'>> {
    if (theoryIds.length === 0) return {}
    const ids = theoryIds.join(',')
    const { data } = await api.get<Record<string, 'UP' | 'DOWN'>>(`/theories/my-votes?ids=${ids}`)
    return data
  },
}
