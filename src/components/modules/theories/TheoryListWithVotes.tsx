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
      <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
        <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-sm">
          Ainda não há lendas registradas para este mundo.
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
