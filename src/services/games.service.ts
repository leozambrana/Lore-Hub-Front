import api from '@/lib/axios'
import { Game } from '@/types'

export const gamesService = {
  async getAllGames(page: number = 1, limit: number = 10): Promise<{ data: Game[]; total: number }> {
    const { data } = await api.get<{ data: Game[]; total: number }>('/games', {
      params: {
        page,
        limit,
      },
    })
    return data
  },

  async getPendingGames(): Promise<Game[]> {
    const { data } = await api.get<Game[]>('/games/review/pending')
    return data
  },

  async approveGame(id: string): Promise<Game> {
    const { data } = await api.patch<Game>(`/games/${id}/approve`)
    return data
  },

  async getGameBySlug(slug: string): Promise<Game> {
    const { data } = await api.get<Game>(`/games/${slug}`)
    return data
  },

  async updateGame(id: string, payload: Partial<Game>): Promise<Game> {
    const { data } = await api.patch<Game>(`/games/${id}`, payload)
    return data
  },

  async deleteGame(id: string): Promise<void> {
    await api.delete(`/games/${id}`)
  }
}
