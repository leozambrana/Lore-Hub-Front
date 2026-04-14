'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Pencil, Trash2, Calendar, Library, MapPin, Package, User, Star, Loader2 } from 'lucide-react'
import { useLoreStore } from '@/store/useLoreStore'
import { wikiService } from '@/services/wiki.service'
import { Button } from '@/components/ui/button'
import { Theory, WikiItem } from '@/types'
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
import Image from 'next/image'
import { WIKI_FALLBACK_IMAGE } from '@/constants/images'
import { BackButton } from '@/components/shared/BackButton'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TheoryCard } from '../theories/TheoryCard'

interface WikiDetailClientProps {
  item: WikiItem & {
    theories: { theory: Theory }[]
  }
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  CHARACTER: User,
  ITEM: Package,
  LOCATION: MapPin,
  EVENT: Star,
  OTHER: Library,
}

const CATEGORY_LABELS: Record<string, string> = {
  CHARACTER: 'Personagem',
  ITEM: 'Item',
  LOCATION: 'Local',
  EVENT: 'Evento',
  OTHER: 'Outro',
}

export function WikiDetailClient({ item }: WikiDetailClientProps) {
  const router = useRouter()
  const { user } = useLoreStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const isOwnerOrAdmin = user && (user.id === item.userId || user.role === 'ADMIN')

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await wikiService.delete(item.id)
      toast.success('Item removido com sucesso!')
      router.push('/wiki')
    } catch {
       toast.error('Erro ao remover item da wiki.')
    } finally {
      setIsDeleting(false)
    }
  }

  const Icon = CATEGORY_ICONS[item.category] || Library
  const relatedTheories = item.theories?.map((ref) => ref.theory) || []

  return (
    <main className="flex-1 bg-black">
      {/* Hero Banner Minimalist */}
      <section className="relative h-[30vh] md:h-[40vh] w-full overflow-hidden border-b border-white/20">
        <Image
          src={item.imageUrl || WIKI_FALLBACK_IMAGE}
          alt={item.name}
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        
        <div className="container max-w-6xl mx-auto px-6 relative h-full flex flex-col justify-end pb-12">
          <BackButton label="Arquivo Wiki" className="mb-8" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
                <Icon size={10} className="mr-2" />
                {CATEGORY_LABELS[item.category] || item.category}
              </Badge>
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-tight">
                {item.name}
              </h1>
            </div>

            {isOwnerOrAdmin && (
              <div className="flex items-center gap-3">
                <Link href={`/wiki/edit/${item.id}`} passHref>
                  <Button variant="outline" size="sm" className="h-10 border-white/20 bg-white/5 text-white rounded-xl uppercase tracking-widest text-[10px] font-black hover:bg-primary/20 hover:text-white hover:border-primary transition-all">
                    <Pencil size={14} className="mr-2" /> Editar Registro
                  </Button>
                </Link>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="h-10 rounded-xl uppercase tracking-widest text-[10px] font-black shadow-xl shadow-red-500/10">
                      <Trash2 size={14} className="mr-2" /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-zinc-950 border-white/20 text-white rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black italic uppercase text-destructive tracking-[0.2em] mb-2">Eliminar Registro?</AlertDialogTitle>
                      <AlertDialogDescription className="text-zinc-400">
                        Esta ação é irreversível. O arquivo de {item.name} será removido permanentemente dos registros da LoreHub.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                      <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border-0 rounded-xl font-bold uppercase tracking-widest text-[10px]">Pensei melhor</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white font-black rounded-xl uppercase tracking-widest text-[10px]" disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Sim, Confirmar Exclusão"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          
          {/* Coluna Principal: Lore */}
          <div className="lg:col-span-3 space-y-12">
            <section className="space-y-6 p-8 md:p-12 bg-zinc-900/20 border border-white/20 rounded-[3rem] backdrop-blur-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                <div className="h-px w-8 bg-zinc-800" /> Registros Históricos
              </h2>
              <article className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap font-medium italic opacity-90">
                  {item.description}
                </p>
              </article>
            </section>

            <Separator className="bg-white/10" />

            {/* Teorias Relacionadas */}
            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                  <div className="h-px w-8 bg-zinc-800" /> Teorias que mencionam este registro
                </h2>
                <Badge variant="outline" className="border-white/20 text-zinc-400 font-mono text-[10px] bg-white/5">
                  {relatedTheories.length} {relatedTheories.length === 1 ? 'TEORIA' : 'TEORIAS'}
                </Badge>
              </div>

              {relatedTheories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedTheories.map((theory) => (
                    <TheoryCard key={theory.id} theory={theory} />
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-[3rem] bg-zinc-950/60">
                  <Library size={40} className="text-zinc-800 mb-4" />
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] text-center max-w-xs">
                    Nenhuma teoria forjada para este registro ainda. Seja o primeiro a investigar!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Dados Rápidos */}
          <div className="lg:col-span-1 border-l border-white/20 pl-8 space-y-10">
             <div className="space-y-6">
                {item.imageUrl && (
                  <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl shadow-primary/5">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-6 pt-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Universo / Jogo</p>
                    <p className="text-sm font-bold text-white uppercase italic">{item.game?.title}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Catalogado em</p>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                      <Calendar size={12} className="text-primary" />
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
             </div>

             <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] space-y-4 shadow-inner shadow-primary/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Quadro de Investigação</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed italic font-medium">
                  Este item pode ser vinculado às suas teorias para criar conexões em seu quadro de evidências.
                </p>
             </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}

