import api from '@/lib/axios'
import { Theory } from '@/types'

export const theoriesService = {
  async getTheoryById(id: string): Promise<Theory> {
    const { data } = await api.get<Theory>(`/theories/${id}`)
    return data
  },
}
