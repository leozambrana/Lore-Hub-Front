import { StateCreator } from 'zustand'
import { Theory, Comment } from '@/types'

export interface TheorySlice {
  theories: Theory[]
  setTheories: (theories: Theory[]) => void
  currentTheory: Theory | null
  setCurrentTheory: (theory: Theory | null) => void
  theoryPagination: { page: number; lastPage: number; total: number } | null
  setTheoryPagination: (pagination: { page: number; lastPage: number; total: number }) => void
  comments: Comment[]
  setComments: (comments: Comment[]) => void
  userVotes: Record<string, 'UP' | 'DOWN' | null>
  setUserVotes: (votes: Record<string, 'UP' | 'DOWN' | null>) => void
  updateUserVote: (theoryId: string, vote: 'UP' | 'DOWN' | null) => void
}

export const createTheorySlice: StateCreator<TheorySlice> = (set) => ({
  theories: [],
  setTheories: (theories) => set({ theories }),
  currentTheory: null,
  setCurrentTheory: (currentTheory) => set({ currentTheory }),
  theoryPagination: null,
  setTheoryPagination: (theoryPagination) => set({ theoryPagination }),
  comments: [],
  setComments: (comments) => set({ comments }),
  userVotes: {},
  setUserVotes: (userVotes) => set({ userVotes }),
  updateUserVote: (theoryId, vote) => set((state) => ({
    userVotes: { ...state.userVotes, [theoryId]: vote }
  })),
})

