'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gamesService } from '@/services/games.service'
import { toast } from 'sonner'
import { Check, Clock, ExternalLink, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GAME_FALLBACK_IMAGE } from '@/constants/images'

export default function AdminReviewPage() {
  const queryClient = useQueryClient()

  const { data: pendingGames, isLoading } = useQuery({
    queryKey: ['pending-games'],
    queryFn: () => gamesService.getPendingGames(),
  })

  const { mutate: approve, isPending: isApproving } = useMutation({
    mutationFn: (id: string) => gamesService.approveGame(id),
    onSuccess: () => {
      toast.success('Franquia aprovada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['pending-games'] })
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao aprovar franquia.')
    },
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <main className="flex-1 container px-6 mx-auto py-12">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
            Painel Administrativo
          </Badge>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
             Revisão de <span className="text-primary not-italic">Lendas</span>
          </h1>
        </div>
        <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Pendente</p>
            <p className="text-2xl font-black italic text-primary">{pendingGames?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pendingGames?.map((game) => (
          <Card key={game.id} className="border-white/5 bg-zinc-950/40 backdrop-blur-xl overflow-hidden group">
            <div className="relative aspect-video">
              <Image
                src={game.imageUrl || GAME_FALLBACK_IMAGE}
                alt={game.title}
                fill
                className="object-cover transition-opacity group-hover:opacity-60"
              />
              <div className="absolute top-4 left-4">
                 <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 font-bold uppercase tracking-widest text-[9px]">
                    <Clock size={10} className="mr-1 inline" /> Pendente
                 </Badge>
              </div>
            </div>
            
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold text-white mb-2">{game.title}</CardTitle>
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono tracking-tighter">
                <span>Slug:</span>
                <span className="text-zinc-300">{game.slug}</span>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-0">
              <div className="flex gap-4">
                <Button 
                   onClick={() => approve(game.id)}
                   disabled={isApproving}
                   className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all"
                >
                   {isApproving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} className="mr-2" /> Aprovar</>}
                </Button>
                <Button 
                   variant="outline"
                   className="w-12 h-12 border-white/10 hover:border-primary/50 hover:bg-primary/10 rounded-xl flex items-center justify-center p-0 transition-all"
                >
                   <ExternalLink size={16} className="text-zinc-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!pendingGames || pendingGames.length === 0) && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-950/20">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-2xl text-zinc-700 opacity-20">
                🛡️
             </div>
             <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs">O reino está em ordem. Nenhuma lenda pendente.</p>
          </div>
        )}
      </div>
    </main>
  )
}
