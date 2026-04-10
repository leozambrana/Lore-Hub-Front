import api from '@/lib/axios'
import { User } from '@/types'

export const usersService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/users/me')
    return data
  }
}
