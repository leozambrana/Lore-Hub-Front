import { notFound } from 'next/navigation'
import { TheoryForm } from '@/components/modules/theories/TheoryForm'
import { theoriesService } from '@/services/theories.service'

export default async function EditTheoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let theory
  try {
    theory = await theoriesService.getTheoryById(id)
  } catch {
    notFound()
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      <TheoryForm initialData={theory} />
    </main>
  )
}
