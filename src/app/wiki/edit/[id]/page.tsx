import { wikiService } from '@/services/wiki.service'
import { WikiForm } from '@/components/modules/wiki/WikiForm'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/shared/BackButton'

export const metadata = {
  title: 'Editar Registro | Wiki LoreHub',
}

export default async function WikiEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let item;
  try {
    item = await wikiService.getById(id)
  } catch (error) {
    console.error('Erro ao buscar item:', error)
    notFound()
  }

  return (
    <main className="flex-1 container max-w-3xl px-6 mx-auto py-12">
      <div className="mb-12">
        <BackButton label="Voltar ao Registro" />
        
        <div className="mt-8 space-y-4">
          <Badge className="bg-primary/20 text-primary border-primary/30 font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
             Modo Edição
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
             Ajustar Registro
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
             Refine as informações históricas deste registro para manter a base de dados precisa.
          </p>
        </div>
      </div>

      <div className="p-8 md:p-12 bg-zinc-950/40 border border-white/5 rounded-[3rem] backdrop-blur-xl shadow-2xl">
        <WikiForm initialData={item} isEdit />
      </div>
    </main>
  )
}
