import { Game } from './game'
import { User } from './auth'
import { WikiItem } from './wiki'
import { WikiMetadata, VoteType } from './shared'

export interface Theory {
  id: string
  title: string
  content: string
  wikiUrl?: string | null
  wikiMetadata?: WikiMetadata | null
  upvotes: number
  gameId: string
  userId: string
  game?: Game
  user?: User
  createdAt: string
  wikiReferences?: Array<{
    wikiItemId: string
    theoryId: string
    wikiItem: WikiItem
  }>
  _count?: {
    comments?: number
    votes?: number
  }
}

export interface Vote {
  id: string
  type: VoteType
  theoryId: string
  userId: string
}
