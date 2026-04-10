import api from '@/lib/axios'
import { Comment } from '@/types'

interface CommentsResponse {
  data: (Comment & { user: { id: string; username: string; avatarUrl: string | null }; replies: (Comment & { user: { id: string; username: string; avatarUrl: string | null } })[] })[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export const commentsService = {
  async getByTheory(theoryId: string, page = 1, limit = 20): Promise<CommentsResponse> {
    const { data } = await api.get(`/theories/${theoryId}/comments?page=${page}&limit=${limit}`)
    return data
  },

  async create(theoryId: string, payload: { content: string; parentId?: string }): Promise<Comment> {
    const { data } = await api.post(`/theories/${theoryId}/comments`, payload)
    return data
  },

  async remove(theoryId: string, commentId: string): Promise<void> {
    await api.delete(`/theories/${theoryId}/comments/${commentId}`)
  },
}
