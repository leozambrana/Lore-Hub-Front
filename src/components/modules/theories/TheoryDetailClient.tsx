'use client'

import { useEffect, useState, useMemo } from 'react'
import { Theory } from '@/types'
import { useLoreStore } from '@/store/useLoreStore'
import { useVote } from '@/hooks/useVote'
import { theoriesService } from '@/services/theories.service'
import { CommentsSection } from './CommentsSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InvestigationCanvas } from './investigationCanvas'
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
  Heart,
  Library,
  ScrollText,
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
  const { user, setCurrentTheory } = useLoreStore()
  const router = useRouter()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Sincroniza a teoria atual no store global
  useEffect(() => {
    setCurrentTheory(theory)
  }, [theory, setCurrentTheory])

  const isOwnerOrAdmin = user && (user.id === theory.userId || user.role === 'ADMIN')

  const { userVote, optimisticUpvotes, handleVote } = useVote({
    theoryId: theory.id,
    initialUpvotes: theory.upvotes,
  })

  const wikiItems = useMemo(() => 
    theory.wikiReferences?.map(ref => ref.wikiItem) || [], 
  [theory.wikiReferences])

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

      {/* ── Hero Banner ── */}
      <section className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <Image
          src={gameImageUrl}
          alt={theory.game?.title || 'Game banner'}
          fill
          className="object-cover opacity-30 grayscale-[0.4]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/10" />

        <div className="container max-w-4xl mx-auto px-6 relative h-full flex flex-col justify-between py-8">
          <div className="flex items-center justify-between">
            <BackButton label={theory.game?.title || 'Explorar'} />

            {isOwnerOrAdmin && (
              <div className="flex items-center gap-2">
                <Link href={`/theories/edit/${theory.id}`} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 bg-white/10 backdrop-blur-sm text-zinc-300 hover:text-primary hover:bg-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20"
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
                  <AlertDialogContent className="bg-zinc-950 border-white/20 text-white rounded-3xl">
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
        
        <Tabs defaultValue="read" className="w-full">
          <div className="flex items-center justify-between mb-8 border-b border-white/20 pb-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Fluxo de Análise</h2>
            <TabsList className="bg-zinc-950/60 border border-white/20 h-10 p-1 rounded-xl">
              <TabsTrigger 
                value="read" 
                className="rounded-lg px-4 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
              >
                <ScrollText size={12} className="mr-2" /> Narrativa
              </TabsTrigger>
              <TabsTrigger 
                value="canvas" 
                className="rounded-lg px-4 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
              >
                <Library size={12} className="mr-2" /> Conexões
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="read" className="mt-0 space-y-12 outline-none">
            <article className="prose prose-invert prose-sm max-w-none overflow-hidden">
              <div className="text-zinc-300 text-base leading-[1.9] font-medium whitespace-pre-wrap wrap-anywhere">
                {theory.content}
              </div>
            </article>

            {theory.wikiReferences && theory.wikiReferences.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Library size={12} className="text-primary" />
                  Entidades Mentions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {theory.wikiReferences.map((ref) => (
                    <Link 
                      key={ref.wikiItemId} 
                      href={`/wiki/${ref.wikiItemId}`}
                      className="flex items-center gap-3 p-3 bg-zinc-950/60 border border-white/20 rounded-2xl hover:border-primary/30 hover:bg-white/5 transition-all group"
                    >
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-white/20 bg-zinc-900">
                        <Image
                          src={ref.wikiItem.imageUrl || '/images/wiki-fallback.jpg'}
                          alt={ref.wikiItem.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                          {ref.wikiItem.name}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          {ref.wikiItem.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="canvas" className="mt-0 outline-none">
            <div className="space-y-6">
              <div className="flex flex-col gap-2 mb-4">
                <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Quadro de Investigação</h3>
                <p className="text-xs text-zinc-500 font-medium">Visualize como esta teoria se conecta aos elementos do universo.</p>
              </div>
              <InvestigationCanvas 
                theory={theory} 
                wikiItems={wikiItems} 
                isEditable={isOwnerOrAdmin}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Evidências Externas */}
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
                className="group flex flex-col md:flex-row bg-zinc-950/60 border border-white/20 rounded-3xl overflow-hidden hover:border-primary/30 transition-all shadow-2xl"
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
                </div>
              </a>
            ) : (
              <a
                href={theory.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/20 bg-zinc-950/60 hover:border-primary/30 hover:bg-primary/5 transition-all group w-fit"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ExternalLink size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-primary transition-colors">
                    Fonte Wiki
                  </p>
                  <p className="text-xs text-zinc-400 truncate max-w-xs">{theory.wikiUrl}</p>
                </div>
              </a>
            )}
          </div>
        )}

        {/* Barra de votos */}
        <div className="flex flex-wrap items-center gap-4 py-6 border-y border-white/20">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
            O que você acha?
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVote('UP')}
              className={`flex items-center justify-center w-12 h-10 rounded-xl border transition-all ${
                userVote === 'UP'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                  : 'border-white/20 bg-white/5 text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/5'
              }`}
            >
              <ThumbsUp size={16} className={userVote === 'UP' ? 'fill-emerald-500' : ''} />
            </button>
            <button
              onClick={() => handleVote('DOWN')}
              className={`flex items-center justify-center w-12 h-10 rounded-xl border transition-all ${
                userVote === 'DOWN'
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-white/20 bg-white/5 text-zinc-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5'
              }`}
            >
              <ThumbsDown size={16} className={userVote === 'DOWN' ? 'fill-red-500' : ''} />
            </button>
          </div>
          <div className="ml-auto flex items-center gap-6">
            <div className={`flex items-center gap-2 text-red-500 transition-colors`}>
              <Heart size={16} className="fill-red-500" />
              <span className="text-xs font-black">{optimisticUpvotes}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <MessageSquare size={16} />
              <span className="text-xs font-black">{theory._count?.comments || 0}</span>
            </div>
          </div>
        </div>

        {/* Seção de comentários */}
        <CommentsSection theoryId={theory.id} />
      </div>
    </main>
  )
}

