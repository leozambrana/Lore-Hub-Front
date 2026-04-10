export type VoteType = 'UP' | 'DOWN';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  status: 'PENDING' | 'APPROVED';
  theories?: Theory[];
  createdAt: string;
  stats?: {
    theories: number;
  };
}

export interface Theory {
  id: string;
  title: string;
  content: string;
  wikiUrl?: string | null;
  wikiMetadata?: unknown | null;
  upvotes: number;
  gameId: string;
  userId: string;
  game?: Game;
  user?: User;
  createdAt: string;
  _count?: {
    comments?: number;
    votes?: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  theoryId: string;
  userId: string;
  parentId?: string | null;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  replies?: Comment[];
}
