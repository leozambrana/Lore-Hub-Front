import api from '@/lib/axios'
import { Comment } from '@/types'
import { useLoreStore } from '@/store/useLoreStore'

interface CommentsResponse {
  data: (Comment & { user: { id: string; username: string; avatarUrl: string | null }; replies: (Comment & { user: { id: string; username: string; avatarUrl: string | null } })[] })[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export const commentsService = {
  async getByTheory(theoryId: string, page = 1, limit = 20): Promise<CommentsResponse> {
    const { data } = await api.get<CommentsResponse>(`/theories/${theoryId}/comments?page=${page}&limit=${limit}`)
    
    // Alimenta o store global
    useLoreStore.getState().setComments(data.data)
    
    return data
  },

  async create(theoryId: string, payload: { content: string; parentId?: string }): Promise<Comment> {
    const { data } = await api.post<Comment>(`/theories/${theoryId}/comments`, payload)
    
    // Opcional: Adicionar ao store local imediatamente para feedback instantâneo
    // Mas geralmente o componente faz um refetch ou o autor prefere ver a lista limpa
    
    return data
  },

  async remove(theoryId: string, commentId: string): Promise<void> {
    await api.delete(`/theories/${theoryId}/comments/${commentId}`)
    
    // Remove do store local
    const state = useLoreStore.getState()
    state.setComments(state.comments.filter(c => c.id !== commentId))
  },
}
