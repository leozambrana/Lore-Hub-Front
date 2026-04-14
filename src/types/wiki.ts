import { Theory } from './theory'
import { WikiCategory } from './shared'

export interface WikiItem {
  id: string
  name: string
  description: string
  category: WikiCategory
  imageUrl?: string | null
  gameId: string
  game?: {
    title: string
  }
  userId?: string
  user?: {
    id: string
    username: string
  }
  theories?: Array<{
    theoryId: string
    wikiItemId: string
    theory: Theory
  }>
  createdAt: string
  updatedAt: string
}
