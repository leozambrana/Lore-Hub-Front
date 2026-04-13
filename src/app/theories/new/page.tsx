import { TheoryForm } from '@/components/modules/theories/TheoryForm'

export const metadata = {
  title: 'Nova Teoria | LoreHub',
}

export default async function NewTheoryPage({
  searchParams,
}: {
  searchParams: Promise<{ gameId?: string }>
}) {
  const resolvedParams = await searchParams;
  return (
    <main className="min-h-screen bg-zinc-950">
      <TheoryForm preselectedGameId={resolvedParams?.gameId} />
    </main>
  )
}
