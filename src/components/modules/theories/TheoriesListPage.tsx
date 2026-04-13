'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { theoriesService } from '@/services/theories.service'
import { TheoryListCard } from './TheoryListCard'
import { Input } from '@/components/ui/input'
import { FeedSkeleton } from '@/components/shared/SkeletonTemplates'
import { useDebounce } from '@/hooks/useDebounce'
import { Search, Flame, Clock, MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { AsyncCombobox } from '@/components/shared/AsyncCombobox'
import { gamesService } from '@/services/games.service'

export function TheoriesListPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('recent')
  const [selectedGameId, setSelectedGameId] = useState<string>('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading } = useQuery({
    queryKey: ['theories', activeTab, debouncedSearch, selectedGameId, page],
    queryFn: () => theoriesService.getAllTheories(
      page, 
      12, 
      selectedGameId || undefined, 
      activeTab, 
      debouncedSearch
    ),
  })

  // Resetar página ao buscar ou trocar aba/jogo
  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, activeTab, selectedGameId])

  const theories = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  return (
    <main className="min-h-screen bg-black flex flex-col pt-12">
      {/* Header Seccional */}
      <section className="container max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-zinc-950/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
          {/* Luzes de fundo sutis */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-primary/10" />
          
          <div className="relative z-10 space-y-4">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
              Quadro de <span className="text-primary not-italic">Teorias</span>
            </h1>
            <p className="text-zinc-500 max-w-lg text-sm md:text-base font-medium leading-relaxed">
              Explore os mistérios forjados por narradores em todos os grandes universos catalogados no LoreHub.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
             <Link href="/theories/new">
                <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/80 text-black font-black uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-primary/10">
                  <Plus size={18} className="mr-2" /> Nova Teoria
                </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Barra de Filtros e Busca */}
      <section className="container max-w-7xl mx-auto px-6 mb-12 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:flex-1">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" size={18} />
              <Input 
                placeholder="Buscar por título ou conteúdo..." 
                className="h-14 pl-12 bg-zinc-950/60 border-white/5 rounded-2xl focus:border-primary/50 text-white placeholder:text-zinc-600 transition-all shadow-2xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full md:w-64 relative group">
              <AsyncCombobox
                queryKey="games"
                fetchFn={(page, search) => gamesService.getAllGames(page, 10, search)}
                value={selectedGameId}
                onChange={setSelectedGameId}
                placeholder="Filtrar por Jogo"
                className="h-14 border-white/5 bg-zinc-950/60 shadow-2xl"
                showClear
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-zinc-950/60 p-1.5 rounded-2xl border border-white/5 w-fit shrink-0">
          <TabsList className="bg-transparent h-11">
            <TabsTrigger value="recent" className="rounded-xl px-6 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
              <Clock size={12} /> Recentes
            </TabsTrigger>
            <TabsTrigger value="popular" className="rounded-xl px-6 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
              <Flame size={12} /> Populares
            </TabsTrigger>
            <TabsTrigger value="discussed" className="rounded-xl px-6 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
              <MessageSquare size={12} /> Discussas
            </TabsTrigger>
          </TabsList>
        </Tabs>
        </div>
      </section>

      {/* Grid de Resultados */}
      <section className="container max-w-7xl mx-auto px-6 pb-20">
        {isLoading ? (
          <FeedSkeleton count={8} />
        ) : theories.length > 0 ? (
          <div className="flex flex-col gap-6">
            {theories.map((theory) => (
              <TheoryListCard key={theory.id} theory={theory} />
            ))}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] bg-zinc-950/20">
            <Search size={48} className="text-zinc-800 mb-6" />
            <h3 className="text-xl font-bold text-zinc-100 mb-2">Nenhuma teoria encontrada</h3>
            <p className="text-zinc-500 text-sm max-w-xs text-center font-medium italic">
              Não encontramos investigações para o termo buscado. Tente mudar o filtro ou forje sua própria teoria!
            </p>
          </div>
        )}

        {/* Paginação Simples */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <Button 
              variant="outline" 
              disabled={page === 1}
              onClick={() => setPage(prev => prev - 1)}
              className="h-12 px-6 border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white rounded-xl uppercase font-black text-[10px] tracking-widest"
            >
              Anterior
            </Button>
            <span className="text-zinc-600 font-mono text-xs">PÁGINA {page} DE {totalPages}</span>
            <Button 
              variant="outline" 
              disabled={page === totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="h-12 px-6 border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white rounded-xl uppercase font-black text-[10px] tracking-widest"
            >
              Próximo
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}
