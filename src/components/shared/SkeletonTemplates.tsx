import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Grid de Cards (usado na Wiki, Explorar, etc.)
 */
export function CardGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4 bg-zinc-950/20 p-4 rounded-[2rem] border border-white/20 h-full">
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-1/4 rounded-full" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Feed Horizontal/Vertical (usado na HomeFeed e Perfil)
 */
export function FeedSkeleton({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-36 w-full rounded-[2rem] bg-zinc-950/20 border border-white/20" />
      ))}
    </div>
  )
}

/**
 * Lista Simples (usado em Comboboxes, menus suspensos, etc)
 */
export function ListSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-2 p-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-xl bg-muted/20" />
      ))}
    </div>
  )
}

/**
 * Skeleton para Página de Detalhes
 */
export function DetailSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto px-6 py-12 space-y-8 animate-pulse">
      <Skeleton className="h-[40vh] w-full rounded-[3rem] bg-zinc-950/60" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 rounded-2xl" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
      <div className="space-y-4 pt-8">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-2/3 rounded-full" />
      </div>
    </div>
  )
}

