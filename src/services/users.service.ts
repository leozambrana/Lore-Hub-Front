import api from '@/lib/axios'
import { User } from '@/types'

export const usersService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/users/me')
    return data
  },

  async updateProfile(data: { username: string }): Promise<User> {
    const { data: updated } = await api.patch<User>('/users/me', data)
    return updated
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData()
    formData.append('file', file)
    const { data: updated } = await api.post<User>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return updated
  },
}
