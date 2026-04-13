'use client'

import { WikiItem, Theory } from '@/types'
import { Badge } from '@/components/ui/badge'
import { TheoryCard } from '../theories/TheoryCard'
import { BackButton } from '@/components/shared/BackButton'
import { WIKI_FALLBACK_IMAGE } from '@/constants/images'
import Image from 'next/image'
import { Calendar, Library, MapPin, Package, User, Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'


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
  const Icon = CATEGORY_ICONS[item.category] || Library
  const relatedTheories = item.theories?.map((ref) => ref.theory) || []

  return (
    <main className="flex-1 bg-black">
      {/* Hero Banner Minimalist */}
      <section className="relative h-[30vh] md:h-[40vh] w-full overflow-hidden border-b border-white/5">
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
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none truncate">
                {item.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          
          {/* Coluna Principal: Lore */}
          <div className="lg:col-span-3 space-y-12">
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                <div className="h-px w-8 bg-zinc-800" /> Registros Históricos
              </h2>
              <article className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap font-medium italic opacity-90">
                  {item.description}
                </p>
              </article>
            </section>

            <Separator className="bg-white/5" />

            {/* Teorias Relacionadas */}
            <section className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
                  <div className="h-px w-8 bg-zinc-800" /> Teorias que mencionam este registro
                </h2>
                <Badge variant="outline" className="border-white/10 text-zinc-500 font-mono text-[10px]">
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
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-zinc-950/20">
                  <Library size={40} className="text-zinc-800 mb-4" />
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] text-center max-w-xs">
                    Nenhuma teoria forjada para este registro ainda. Seja o primeiro a investigar!
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Dados Rápidos */}
          <div className="lg:col-span-1 border-l border-white/5 pl-8 space-y-10">
             <div className="space-y-6">
                {item.imageUrl && (
                  <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
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

             <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Quadro de Investigação</p>
                <p className="text-xs text-zinc-400 leading-relaxed italic">
                  Este item pode ser vinculado às suas teorias para criar conexões em seu quadro de evidências.
                </p>
             </div>
          </div>
          
        </div>
      </div>
    </main>
  )
}
