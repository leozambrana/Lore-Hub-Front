'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Game } from '@/types'
import { Trash2 } from 'lucide-react'
import { GameFormModal } from './GameFormModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { gamesService } from '@/services/games.service'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'

interface GameCardProps {
  game: Game
  isAdmin?: boolean
}

export function GameCard({ game, isAdmin }: GameCardProps) {
  const queryClient = useQueryClient()

  const { mutate: deleteGame } = useMutation({
    mutationFn: (id: string) => gamesService.deleteGame(id),
    onSuccess: () => {
      toast.success('Franquia removida com sucesso.')
      queryClient.invalidateQueries({ queryKey: ['games'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover franquia. Verifique se existem teorias vinculadas.')
    }
  })

  return (
    <div className="relative group block h-full">
      {/* Admin Actions Overlay */}
      {isAdmin && (
        <div 
           className="absolute top-3 right-3 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all"
           onClick={(e) => e.preventDefault()} // Evita trigger do Link se houver wrap
        >
          {/* Edit Modal Component */}
          <GameFormModal game={game} />
          
          {/* Delete Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon-sm"
                className="h-8 w-8 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white transition-all"
              >
                <Trash2 size={14} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-950 border-white/10 rounded-[2rem]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-white">Tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-500">
                  Isso removerá permanentemente a franquia <span className="text-white font-bold">{game.title}</span>. 
                  A ação será bloqueada se houver teorias vinculadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="pt-4">
                <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 transition-all">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                   onClick={() => deleteGame(game.id)}
                   className="bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                >
                   Remover Universo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Link href={`/games/${game.slug}`} className="h-full">
        <Card className="h-full border-border/40 bg-zinc-950/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] hover:-translate-y-1">
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={game.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'}
                alt={game.title}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg font-bold truncate text-white/90 group-hover:text-primary transition-colors">
              {game.title}
            </CardTitle>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Narrado desde {new Date(game.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </CardFooter>
        </Card>
      </Link>
    </div>
  )
}
