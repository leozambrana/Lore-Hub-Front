import api from '@/lib/axios'
import { Game } from '@/types'
import { useLoreStore } from '@/store/useLoreStore'

export const gamesService = {
  async getAllGames(page: number = 1, limit: number = 10, search?: string): Promise<{ data: Game[]; total: number; page: number; lastPage: number }> {
    const { data } = await api.get('/games', {
      params: {
        page,
        limit,
        search: search || undefined
      },
    })
    
    // Alimenta o store
    useLoreStore.getState().setGames(data.data)
    
    return data
  },

  async getPendingGames(): Promise<Game[]> {
    const { data } = await api.get<Game[]>('/games/review/pending')
    
    // Alimenta o store de pendentes
    useLoreStore.getState().setPendingGames(data)
    
    return data
  },

  async approveGame(id: string): Promise<Game> {
    const { data } = await api.patch<Game>(`/games/${id}/approve`)
    return data
  },

  async createGame(payload: Partial<Game>): Promise<Game> {
    const { data } = await api.post<Game>('/games', payload)
    return data
  },

  async getGameBySlug(slug: string): Promise<Game> {
    const { data } = await api.get<Game>(`/games/${slug}`)
    
    // Alimenta o jogo atual no store
    useLoreStore.getState().setCurrentGame(data)
    
    return data
  },

  async updateGame(id: string, payload: Partial<Game>): Promise<Game> {
    const { data } = await api.patch<Game>(`/games/${id}`, payload)
    
    const state = useLoreStore.getState()
    if (state.currentGame?.id === id) {
      state.setCurrentGame(data)
    }
    
    return data
  },

  async deleteGame(id: string): Promise<void> {
    await api.delete(`/games/${id}`)
    
    // Atualiza store local
    const state = useLoreStore.getState()
    state.setGames(state.games.filter(g => g.id !== id))
  },

  async uploadCover(id: string, file: File): Promise<Game> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<Game>(`/games/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  }
}
