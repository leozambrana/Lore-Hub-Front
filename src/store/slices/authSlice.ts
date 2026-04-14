import { StateCreator } from 'zustand'
import { User } from '@/types'

export interface AuthSlice {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
})
