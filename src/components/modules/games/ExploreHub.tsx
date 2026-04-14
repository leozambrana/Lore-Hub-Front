'use client'

import { useState } from 'react'
import { Game } from '@/types'
import { Input } from '@/components/ui/input'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useLoreStore } from '@/store/useLoreStore'
import { GameFormModal } from './GameFormModal'
import { useQuery } from '@tanstack/react-query'
import { gamesService } from '@/services/games.service'
import { useEffect } from 'react'
import { CardGridSkeleton } from '@/components/shared/SkeletonTemplates'

import { GAME_FALLBACK_IMAGE } from '@/constants/images'

interface ExploreHubProps {
  initialData: { data: Game[]; total: number; page: number; lastPage: number }
}

export function ExploreHub({ initialData }: ExploreHubProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const { user } = useLoreStore()

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { data: result, isLoading } = useQuery({
    queryKey: ['explore-games', page, debouncedSearch],
    queryFn: () => gamesService.getAllGames(page, 12, debouncedSearch),
    initialData: (page === 1 && !debouncedSearch) ? initialData : undefined,
  })

  const filteredGames = result?.data || []
  const lastPage = result?.lastPage || 1
  const isFetching = isLoading

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Top Header: Buscar & Admin Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-950/60 p-6 rounded-2xl border border-white/20 shadow-xl gap-4">
         <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
            <Input 
              placeholder="Buscar universo..."
              className="pl-12 bg-white/5 border-white/20 rounded-xl focus:border-primary/50 text-white placeholder:text-zinc-600 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         {user && (
            <div className="w-full sm:w-auto flex justify-end">
               <GameFormModal />
            </div>
         )}
      </div>

      {/* Grid de Franquias */}
      {isFetching ? (
        <CardGridSkeleton count={12} className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
      ) : filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map(game => (
             <div key={game.id} className="relative group">
                <Link href={`/games/${game.slug}`} className="block">
                   <div className="relative aspect-4/3 rounded-2xl overflow-hidden group border border-white/20 bg-zinc-900 cursor-pointer shadow-xl">
                      <Image 
                        src={game.imageUrl || GAME_FALLBACK_IMAGE} 
                        alt={game.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      
                      <div className="absolute top-3 right-3 z-10 pointer-events-none">
                         <Badge variant="outline" className="bg-zinc-950/80 backdrop-blur-md text-white border-white/20 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 whitespace-nowrap">
                            {game.stats?.theories || 0} Teorias
                         </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                         <h3 className="text-white font-black italic tracking-wide truncate drop-shadow-md text-lg">
                            {game.title}
                         </h3>
                      </div>
                   </div>
                </Link>

                {isAdmin && (
                   <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GameFormModal game={game} />
                   </div>
                )}
             </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
           <Search className="h-12 w-12 text-zinc-800 mb-4" />
           <p className="text-zinc-500 font-bold uppercase tracking-widest">Nenhum universo encontrado</p>
        </div>
      )}

      {/* Paginação */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
           <Button
             variant="outline"
             onClick={() => setPage(p => Math.max(1, p - 1))}
             disabled={page === 1 || isFetching}
             className="bg-transparent border-white/20 hover:bg-white/5 text-white"
           >
             <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
           </Button>
           <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
             Página {page} de {lastPage}
           </span>
           <Button
             variant="outline"
             onClick={() => setPage(p => Math.min(lastPage, p + 1))}
             disabled={page === lastPage || isFetching}
             className="bg-transparent border-white/20 hover:bg-white/5 text-white"
           >
             Próxima <ChevronRight className="h-4 w-4 ml-2" />
           </Button>
        </div>
      )}
    </div>
  )
}

