import { Theory } from './theory'

export interface Game {
  id: string
  title: string
  slug: string
  imageUrl?: string | null
  status: 'PENDING' | 'APPROVED'
  theories?: Theory[]
  createdAt: string
  stats?: {
    theories: number
  }
  _count?: {
    theories?: number
  }
}
