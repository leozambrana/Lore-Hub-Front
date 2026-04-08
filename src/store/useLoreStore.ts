import { create } from 'zustand'
import { Game, User } from '@/types'

interface LoreStore {
  // Estado do Usuário
  user: User | null
  setUser: (user: User | null) => void

  // Cache Global de Franquias (Opcional, mas solicitado para armazenar retornos)
  games: Game[]
  setGames: (games: Game[]) => void

  // Franquias Pendentes (para admin)
  pendingGames: Game[]
  setPendingGames: (games: Game[]) => void

  // UI State (exemplo: abrir/fechar modais globais)
  isCreateModalOpen: boolean
  setCreateModalOpen: (open: boolean) => void

  // Reset do Store (Logout)
  logout: () => void
}

export const useLoreStore = create<LoreStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  games: [],
  setGames: (games) => set({ games }),

  pendingGames: [],
  setPendingGames: (pendingGames) => set({ pendingGames }),

  isCreateModalOpen: false,
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),

  logout: () => set({ user: null, pendingGames: [], isCreateModalOpen: false }),
}))
