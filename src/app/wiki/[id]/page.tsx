import { wikiService } from '@/services/wiki.service'
import { WikiDetailClient } from '@/components/modules/wiki/WikiDetailClient'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import { PageProps } from '@/types'

type WikiDetailPageProps = PageProps<{ id: string }>

export async function generateMetadata({ params }: WikiDetailPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const item = await wikiService.getById(id)
    return {
      title: `${item.name} | Wiki LoreHub`,
      description: item.description?.substring(0, 160),
    }
  } catch {
    return { title: 'Item Wiki' }
  }
}

export default async function WikiDetailPage({ params }: WikiDetailPageProps) {
  const { id } = await params
  
  let item;
  try {
    item = await wikiService.getById(id)
  } catch (error) {
    console.error('Erro ao buscar item da wiki:', error)
    notFound()
  }

  // Agora renderizamos fora do try/catch conforme sugerido pelo lint
  return <WikiDetailClient item={item} />
}
