export interface User {
  id: string
  email: string
  username: string
  avatarUrl?: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
}
