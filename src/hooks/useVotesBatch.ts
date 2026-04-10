'use client'

import { useState, useEffect } from 'react'
import { theoriesService } from '@/services/theories.service'
import { useLoreStore } from '@/store/useLoreStore'

/**
 * Busca os votos do usuário para uma lista de teorias em UMA única request.
 *
 * Use na tela de listagem (ex: /games/:slug) onde múltiplos TheoryCards são
 * renderizados ao mesmo tempo — evita o problema de N requests paralelas.
 *
 * @param theoryIds - Lista de IDs das teorias visíveis na tela
 * @returns votesMap: { [theoryId]: 'UP' | 'DOWN' | null }
 */
export function useVotesBatch(theoryIds: string[]) {
  const { user } = useLoreStore()
  const [votesMap, setVotesMap] = useState<Record<string, 'UP' | 'DOWN' | null>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user || theoryIds.length === 0) {
      setVotesMap({})
      return
    }

    let cancelled = false
    setIsLoading(true)

    theoriesService
      .getMyVotesBatch(theoryIds)
      .then((data) => {
        if (cancelled) return
        // Normaliza: todos os IDs que não estão no mapa retornam null
        const normalized: Record<string, 'UP' | 'DOWN' | null> = {}
        for (const id of theoryIds) {
          normalized[id] = data[id] ?? null
        }
        setVotesMap(normalized)
      })
      .catch(() => {
        if (!cancelled) setVotesMap({})
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // Estabiliza a dependência convertendo o array em string para evitar re-renders infinitos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, theoryIds.join(',')])

  return { votesMap, isLoading }
}
