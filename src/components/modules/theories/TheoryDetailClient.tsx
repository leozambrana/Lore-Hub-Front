'use client'

import { useState } from 'react'
import { Theory } from '@/types'
import { useLoreStore } from '@/store/useLoreStore'
import { useVote } from '@/hooks/useVote'
import { theoriesService } from '@/services/theories.service'
import { CommentsSection } from './CommentsSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
} from '@/components/ui/alert-dialog'
import {
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  MessageSquare,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import { GAME_FALLBACK_IMAGE } from '@/constants/images'
import { BackButton } from '@/components/shared/BackButton'

interface TheoryDetailClientProps {
  theory: Theory
}

export function TheoryDetailClient({ theory }: TheoryDetailClientProps) {
  const { user } = useLoreStore()
  const router = useRouter()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwnerOrAdmin = user && (user.id === theory.userId || user.role === 'ADMIN')

  const { userVote, optimisticUpvotes, handleVote } = useVote({
    theoryId: theory.id,
    initialUpvotes: theory.upvotes,
  })

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      await theoriesService.deleteTheory(theory.id)
      toast.success('Teoria removida.')
      router.push(theory.game?.slug ? `/games/${theory.game.slug}` : '/')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Erro ao remover a teoria.')
      } else {
        toast.error('Erro inesperado.')
      }
    } finally {
      setIsDeleting(false)
      setIsAlertOpen(false)
    }
  }

  const gameImageUrl = theory.game?.imageUrl || GAME_FALLBACK_IMAGE

  return (
    <main className="flex-1 flex flex-col bg-black">

      {/* ── Hero Banner com imagem do game ── */}
      <section className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <Image
          src={gameImageUrl}
          alt={theory.game?.title || 'Game banner'}
          fill
          className="object-cover opacity-30 grayscale-[0.4]"
          priority
        />
        {/* Gradiente forte para preto na base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/10" />

        {/* Conteúdo do hero: breadcrumb no topo, título + autor na base */}
        <div className="container max-w-4xl mx-auto px-6 relative h-full flex flex-col justify-between py-8">

          {/* Topo: voltar + botões de ação */}
          <div className="flex items-center justify-between">
            <BackButton label={theory.game?.title || 'Explorar'} />

            {isOwnerOrAdmin && (
              <div className="flex items-center gap-2">
                <Link href={`/theories/edit/${theory.id}`} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-white/10 backdrop-blur-sm text-zinc-300 hover:text-primary hover:bg-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10"
                  >
                    <Edit2 size={11} className="mr-1.5" /> Editar
                  </Button>
                </Link>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 bg-red-500/20 backdrop-blur-sm text-red-400 hover:text-red-300 hover:bg-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20"
                    >
                      <Trash2 size={11} className="mr-1.5" /> Deletar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-950 border-white/10 text-white rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black italic uppercase text-destructive tracking-widest">
                        Apagar Teoria?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        Esta ação não pode ser desfeita. Sua teoria será apagada dos registros daquele universo para sempre.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                      <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-0 rounded-xl uppercase tracking-widest text-[10px] font-bold">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl uppercase tracking-widest text-[10px]"
                      >
                        {isDeleting ? 'Apagando...' : 'Sim, Excluir'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Base: data, título e autor sobre a imagem */}
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="border-white/20 text-zinc-400 text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-sm w-fit"
            >
              <Calendar size={9} className="mr-1.5" />
              {new Date(theory.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Badge>

            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white leading-tight drop-shadow-2xl">
              {theory.title}
            </h1>

            <div className="flex items-center gap-2.5">
              <Avatar className="h-7 w-7">
                <AvatarImage src={theory.user?.avatarUrl || ''} />
                <AvatarFallback className="bg-primary/30 text-primary text-[10px] font-bold">
                  {theory.user?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-bold text-zinc-300">{theory.user?.username}</span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-xs text-zinc-500 uppercase tracking-widest">Narrador</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conteúdo principal ── */}
      <div className="container max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Corpo da teoria */}
        <article className="prose prose-invert prose-sm max-w-none overflow-hidden">
          <div className="text-zinc-300 text-base leading-[1.9] font-medium whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {theory.content}
          </div>
        </article>

        {/* Evidências Externas / Wiki Ref */}
        {theory.wikiUrl && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">
              Evidências do Universo
            </h3>
            {theory.wikiMetadata ? (
              <a
                href={theory.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row bg-zinc-950/40 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/30 transition-all shadow-2xl"
              >
                {theory.wikiMetadata.image && (
                  <div className="md:w-48 h-32 relative shrink-0 overflow-hidden">
                    <Image
                      src={theory.wikiMetadata.image}
                      alt={theory.wikiMetadata.title || 'Preview'}
                      fill
                      className="object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink size={12} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                      Wiki Oficial
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1 truncate group-hover:text-primary transition-colors">
                    {theory.wikiMetadata.title || theory.wikiUrl}
                  </h4>
                  {theory.wikiMetadata.description && (
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 italic">
                      {theory.wikiMetadata.description}
                    </p>
                  )}
                  <p className="text-zinc-700 text-[10px] mt-2 truncate font-mono">
                    {theory.wikiUrl}
                  </p>
                </div>
              </a>
            ) : (
              <a
                href={theory.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/5 bg-zinc-950/60 hover:border-primary/30 hover:bg-primary/5 transition-all group w-fit"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ExternalLink size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-primary transition-colors">
                    Fonte Wiki
                  </p>
                  <p className="text-xs text-zinc-400 truncate max-w-xs">
                    {theory.wikiUrl}
                  </p>
                </div>
              </a>
            )}
          </div>
        )}

        {/* Barra de votos */}
        <div className="flex flex-wrap items-center gap-4 py-6 border-y border-white/5">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
            O que você acha?
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote('UP')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-sm ${
                userVote === 'UP'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-white/10 bg-white/5 text-zinc-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <ThumbsUp size={15} className={userVote === 'UP' ? 'fill-primary' : ''} />
              {optimisticUpvotes > 0 && <span>{optimisticUpvotes}</span>}
            </button>
            <button
              onClick={() => handleVote('DOWN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-sm ${
                userVote === 'DOWN'
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-white/10 bg-white/5 text-zinc-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5'
              }`}
            >
              <ThumbsDown size={15} className={userVote === 'DOWN' ? 'fill-red-500' : ''} />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2 text-zinc-600">
            <MessageSquare size={14} />
            <span className="text-xs font-bold">{theory._count?.comments || 0} comentários</span>
          </div>
        </div>

        {/* Seção de comentários */}
        <CommentsSection theoryId={theory.id} />
      </div>
    </main>
  )
}
