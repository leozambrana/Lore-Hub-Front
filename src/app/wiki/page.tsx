'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { wikiService } from '@/services/wiki.service'
import { gamesService } from '@/services/games.service'
import { WikiCard } from '@/components/modules/wiki/WikiCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/shared/Combobox'
import { AsyncCombobox } from '@/components/shared/AsyncCombobox'
import { CardGridSkeleton } from '@/components/shared/SkeletonTemplates'
import { ChevronLeft, ChevronRight, Plus, Library } from 'lucide-react'
import Link from 'next/link'
import { WikiCategory } from '@/types'

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'ALL', label: 'Todas as Categorias' },
  { value: 'CHARACTER', label: 'Personagens' },
  { value: 'ITEM', label: 'Itens' },
  { value: 'LOCATION', label: 'Locais' },
  { value: 'EVENT', label: 'Eventos' },
  { value: 'OTHER', label: 'Outros' },
]

export default function WikiListPage() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<string>('ALL')
  const [gameId, setGameId] = useState<string>('ALL')
  const limit = 12

  const { data, isLoading } = useQuery({
    queryKey: ['wiki', page, category, gameId],
    queryFn: () =>
      wikiService.getAll({
        page,
        limit,
        category: category === 'ALL' ? undefined : (category as WikiCategory),
        gameId: gameId === 'ALL' ? undefined : gameId,
      }),
  })

  return (
    <main className="flex-1 container px-6 mx-auto py-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <Badge className="bg-primary/20 text-primary border-primary/30 font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
            Arquivo de Itens
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
            Wiki do <span className="text-primary not-italic">Universo</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-sm font-medium">
            Explore personagens, itens e locais catalogados pelos investigadores da comunidade.
          </p>
        </div>

        <Link href="/wiki/create" passHref>
          <Button className="bg-primary hover:bg-primary/80 text-black font-black uppercase text-[11px] tracking-widest h-14 px-8 rounded-2xl shadow-xl shadow-primary/10 transition-all hover:scale-105 active:scale-95">
            <Plus size={18} className="mr-2" /> Catalogar Item
          </Button>
        </Link>
      </div>

      {/* Filters section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 p-6 bg-zinc-950/40 border border-white/5 rounded-3xl backdrop-blur-xl">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Categoria</label>
          <Combobox 
            options={CATEGORIES} 
            value={category} 
            onChange={(val) => {
              setCategory(val || 'ALL')
              setPage(1)
            }}
            placeholder="Filtrar por Categoria"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Jogo / Universo</label>
          <AsyncCombobox 
            queryKey="games"
            fetchFn={(page, search) => gamesService.getAllGames(page, 10, search)}
            value={gameId} 
            onChange={(val) => {
              setGameId(val || 'ALL')
              setPage(1)
            }}
            placeholder="Filtrar por Jogo"
            emptyMessage="Nenhum jogo encontrado."
          />
        </div>
      </div>

      {/* Content grid */}
      {isLoading ? (
        <CardGridSkeleton count={8} />
      ) : (
        <>
          {data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-zinc-950/20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <Library size={48} className="text-zinc-800 mb-6" />
              <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs">Nenhum item encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data?.data.map((item) => (
                <WikiCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-12 h-12 p-0 border-white/10 bg-zinc-950/40 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <ChevronLeft size={20} />
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    onClick={() => setPage(p)}
                    className={`w-12 h-12 text-sm font-black rounded-xl transition-all ${
                      p === page 
                        ? 'bg-primary text-black' 
                        : 'border-white/10 bg-zinc-950/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                disabled={page === data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-12 h-12 p-0 border-white/10 bg-zinc-950/40 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
