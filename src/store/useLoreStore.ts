import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthSlice, createAuthSlice } from './slices/authSlice'
import { GameSlice, createGameSlice } from './slices/gameSlice'
import { TheorySlice, createTheorySlice } from './slices/theorySlice'
import { WikiSlice, createWikiSlice } from './slices/wikiSlice'
import { UISlice, createUISlice } from './slices/uiSlice'

// Tipo combinado de todas as fatias
export type LoreStore = AuthSlice & GameSlice & TheorySlice & WikiSlice & UISlice

export const useLoreStore = create<LoreStore>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createGameSlice(...a),
      ...createTheorySlice(...a),
      ...createWikiSlice(...a),
      ...createUISlice(...a),

      // Ações globais (cross-slice)
      clearCurrents: () => {
        const [set] = a
        set({ currentTheory: null, currentGame: null, comments: [] })
      },

      logout: () => {
        const [set] = a
        set({ 
          user: null, 
          pendingGames: [], 
          isCreateModalOpen: false, 
          isLoading: false,
          theories: [],
          currentTheory: null,
          games: [],
          wikiItems: []
        })
      }
    }),
    {
      name: 'lore-hub-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
      // Opcional: Persistir apenas o usuário e talvez algumas configurações
      partialize: (state) => ({ 
        user: state.user 
      }),
    }
  )
)
