import { StateCreator } from 'zustand'
import { WikiItem } from '@/types'

export interface WikiSlice {
  wikiItems: WikiItem[]
  setWikiItems: (items: WikiItem[]) => void
  wikiPagination: { page: number; lastPage: number; total: number } | null
  setWikiPagination: (pagination: { page: number; lastPage: number; total: number }) => void
}

export const createWikiSlice: StateCreator<WikiSlice> = (set) => ({
  wikiItems: [],
  setWikiItems: (wikiItems) => set({ wikiItems }),
  wikiPagination: null,
  setWikiPagination: (wikiPagination) => set({ wikiPagination }),
})
