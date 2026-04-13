import { Metadata } from 'next'
import { TheoriesListPage } from '@/components/modules/theories/TheoriesListPage'

export const metadata: Metadata = {
  title: 'Quadro de Teorias | LoreHub',
  description: 'Explore as discussões e mistérios da comunidade em todos os universos.',
}

export default function TheoriesPage() {
  return <TheoriesListPage />
}
