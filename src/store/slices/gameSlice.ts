import { StateCreator } from 'zustand'
import { Game } from '@/types'

export interface GameSlice {
  games: Game[]
  setGames: (games: Game[]) => void
  pendingGames: Game[]
  setPendingGames: (games: Game[]) => void
  currentGame: Game | null
  setCurrentGame: (game: Game | null) => void
}

export const createGameSlice: StateCreator<GameSlice> = (set) => ({
  games: [],
  setGames: (games) => set({ games }),
  pendingGames: [],
  setPendingGames: (pendingGames) => set({ pendingGames }),
  currentGame: null,
  setCurrentGame: (currentGame) => set({ currentGame }),
})
