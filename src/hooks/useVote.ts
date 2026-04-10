'use client'

import { useState, useEffect, useCallback } from 'react'
import { theoriesService } from '@/services/theories.service'
import { useLoreStore } from '@/store/useLoreStore'
import { toast } from 'sonner'

interface UseVoteOptions {
  theoryId: string
  initialUpvotes: number
  /**
   * Voto inicial pré-carregado (ex: vindo de um batch da tela de game).
   * Se fornecido, evita a request individual de GET /votes/me.
   * Use o símbolo `undefined` para indicar "não sei ainda" e `null` para "sei que não votou".
   */
  initialVote?: 'UP' | 'DOWN' | null
}

export function useVote({ theoryId, initialUpvotes, initialVote }: UseVoteOptions) {
  const { user } = useLoreStore()

  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null)
  const [optimisticUpvotes, setOptimisticUpvotes] = useState(initialUpvotes)
  const [isLoadingVote, setIsLoadingVote] = useState(false)

  // Sincroniza initialVote quando ele chega do batch (game page)
  useEffect(() => {
    if (initialVote !== undefined) {
      setUserVote(initialVote)
    }
  }, [initialVote])

  // Busca o voto individualmente APENAS quando não veio pré-carregado via batch
  useEffect(() => {
    // Se initialVote foi fornecido (inclusive null = "sem voto"), não precisa buscar
    if (initialVote !== undefined) return

    if (!user) {
      setUserVote(null)
      return
    }

    let cancelled = false
    setIsLoadingVote(true)

    theoriesService
      .getMyVote(theoryId)
      .then((res) => {
        if (!cancelled) setUserVote(res?.type ?? null)
      })
      .catch(() => {
        if (!cancelled) setUserVote(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingVote(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, theoryId, initialVote])

  const handleVote = useCallback(
    async (type: 'UP' | 'DOWN') => {
      if (!user) {
        toast.error('Você precisa estar logado para interagir!')
        return
      }

      const prevVote = userVote
      const prevUpvotes = optimisticUpvotes

      // Optimistic UI
      if (userVote === type) {
        setUserVote(null)
        setOptimisticUpvotes((prev) => (type === 'UP' ? prev - 1 : prev + 1))
      } else {
        setUserVote(type)
        if (prevVote === null) {
          setOptimisticUpvotes((prev) => (type === 'UP' ? prev + 1 : prev - 1))
        } else {
          // Troca de voto: sobe/desce 2 pontos
          setOptimisticUpvotes((prev) => (type === 'UP' ? prev + 2 : prev - 2))
        }
      }

      try {
        await theoriesService.toggleVote(theoryId, type)
      } catch {
        // Rollback em caso de erro
        setUserVote(prevVote)
        setOptimisticUpvotes(prevUpvotes)
        toast.error('Não foi possível salvar o seu voto.')
      }
    },
    [user, userVote, optimisticUpvotes, theoryId],
  )

  return { userVote, optimisticUpvotes, isLoadingVote, handleVote }
}
