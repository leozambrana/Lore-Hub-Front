'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedTheoryCard } from '../theories/FeedTheoryCard'
import { Skeleton } from "@/components/ui/skeleton"
import { theoriesService } from '@/services/theories.service'

export function HomeFeed() {
  const [activeTab, setActiveTab] = useState('popular')

  const { data, isLoading } = useQuery({
    queryKey: ['theories', 'feed', activeTab],
    queryFn: async () => {
      const theories = await theoriesService.getTheoriesBySort(activeTab, 15)
      return theories
    }
  })

  return (
    <div className="w-full">
      <Tabs defaultValue="popular" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="popular" className="text-xs uppercase tracking-widest font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            🔥 Populares
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs uppercase tracking-widest font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            ✨ Recentes
          </TabsTrigger>
          <TabsTrigger value="discussed" className="text-xs uppercase tracking-widest font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            💬 Mais Comentadas
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex flex-col gap-4">
           {Array.from({ length: 5 }).map((_, i) => (
             <Skeleton key={i} className="h-36 w-full rounded-xl bg-white/5 border border-white/5" />
           ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data?.map(theory => (
            <FeedTheoryCard key={theory.id} theory={theory} />
          ))}
          {(!data || data.length === 0) && (
            <p className="text-zinc-500 text-center py-10 uppercase text-xs tracking-widest font-bold">
              Nenhuma teoria encontrada
            </p>
          )}
        </div>
      )}
    </div>
  )
}
