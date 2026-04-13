import { theoriesService } from '@/services/theories.service'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { TheoryDetailClient } from '@/components/modules/theories/TheoryDetailClient'

import { PageProps } from '@/types'

type TheoryPageProps = PageProps<{ id: string }>

export async function generateMetadata({ params }: TheoryPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const theory = await theoriesService.getTheoryById(id)
    return {
      title: `${theory.title} — LoreHub`,
      description: theory.content.substring(0, 160),
    }
  } catch {
    return { title: 'Teoria não encontrada — LoreHub' }
  }
}

export default async function TheoryPage({ params }: TheoryPageProps) {
  const { id } = await params

  let theory
  try {
    theory = await theoriesService.getTheoryById(id)
  } catch {
    notFound()
  }

  return <TheoryDetailClient theory={theory} />
}
