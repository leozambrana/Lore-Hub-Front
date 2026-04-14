'use client'

import { useVotesBatch } from '@/hooks/useVotesBatch'
import { TheoryCard } from '@/components/modules/theories/TheoryCard'
import { Theory } from '@/types'

interface TheoryListWithVotesProps {
  theories: Theory[]
}

/**
 * Client Component responsável por buscar os votos do usuário em batch
 * e distribuir para cada TheoryCard — 1 request no total, independente
 * de quantas teorias existam na lista.
 */
export function TheoryListWithVotes({ theories }: TheoryListWithVotesProps) {
  const theoryIds = theories.map((t) => t.id)
  const { votesMap, isLoading } = useVotesBatch(theoryIds)

  if (theories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/20 border border-white/20 rounded-3xl border-dashed">
        <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px] text-center px-4">
          Ainda não há teorias registradas para este jogo.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {theories.map((theory) => (
        <TheoryCard
          key={theory.id}
          theory={theory}
          // Se isLoading ainda não terminou, initialVote fica undefined
          // e o TheoryCard não faz request individual (aguarda o batch completar)
          initialVote={isLoading ? undefined : votesMap[theory.id]}
        />
      ))}
    </div>
  )
}

