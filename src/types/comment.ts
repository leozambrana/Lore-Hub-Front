export interface Comment {
  id: string
  content: string
  theoryId: string
  userId: string
  parentId?: string | null
  createdAt: string
  user?: {
    id: string
    username: string
    avatarUrl: string | null
  }
  replies?: Comment[]
}
