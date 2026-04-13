export type WikiCategory = "CHARACTER" | "ITEM" | "LOCATION" | "EVENT" | "OTHER"

export interface WikiMetadata {
  title: string | null
  image: string | null
  description: string | null
  url: string
}

export type VoteType = 'UP' | 'DOWN'
