'use client'

import { useQuery } from '@tanstack/react-query'
import { gamesService } from '@/services/games.service'
import { GameCard } from './GameCard'
import { Game } from '@/types'
import { GameFormModal } from './GameFormModal'
import { useLoreStore } from '@/store/useLoreStore'

interface GameListProps {
  initialData: Game[]
}

export function GameList({ initialData }: GameListProps) {
  // Pega o usuário global do Zustand (alimentado pelo Header)
  const user = useLoreStore((state) => state.user)

  const { data: games } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const response = await gamesService.getAllGames(1, 100)
      return response.data
    },
    initialData,
  })

  return (
    <section className="w-full py-16 container px-6 mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div className="space-y-2">
          <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">Franquias em Destaque</h3>
          <div className="w-20 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        </div>
        
        {/* Modal sempre acessível (tratado internamente) */}
        <GameFormModal />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game: Game) => (
          <GameCard 
            key={game.id} 
            game={game} 
            isAdmin={user?.role === 'ADMIN'} 
          />
        ))}

        {games.length === 0 && (
          <div className="col-span-full py-28 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-950/20 backdrop-blur-sm">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <span className="text-4xl text-zinc-800">📖</span>
             </div>
             <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs text-center max-w-xs leading-relaxed">
               Nenhuma franquia carregada no momento. <br/> Forje o primeiro universo.
             </p>
          </div>
        )}
      </div>
    </section>
  )
}
