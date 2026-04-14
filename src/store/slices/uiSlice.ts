import { StateCreator } from 'zustand'

export interface UISlice {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  isCreateModalOpen: boolean
  setCreateModalOpen: (open: boolean) => void
  clearCurrents: () => void
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  isCreateModalOpen: false,
  setCreateModalOpen: (isCreateModalOpen) => set({ isCreateModalOpen }),
  // O clearCurrents precisa ser tipado no agregador final para resetar outras slices
  clearCurrents: () => {}, 
})
