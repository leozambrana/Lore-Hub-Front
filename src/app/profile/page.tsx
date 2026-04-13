import { ProfileClient } from '@/components/modules/profile/ProfileClient'

export const metadata = {
  title: 'Meu Perfil | LoreHub',
  description: 'Gerencie sua conta e identidade no multiverso LoreHub.',
}

export default function ProfilePage() {
  return (
    <main className="container max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <ProfileClient />
    </main>
  )
}
