import { WikiCreateForm } from '@/components/modules/wiki/WikiCreateForm'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/shared/BackButton'

export const metadata = {
  title: 'Catalogar Item | Wiki LoreHub',
}

export default function WikiCreatePage() {
  return (
    <main className="flex-1 container max-w-3xl px-6 mx-auto py-12">
      <div className="mb-12">
        <BackButton label="Registros da Wiki" />
        
        <div className="mt-8 space-y-4">
          <Badge className="bg-primary/20 text-primary border-primary/30 font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
             Novo Registro
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
             Catalogar Entidade
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
             Adicione novos personagens, itens ou locais aos registros oficiais para que possam ser usados em investigações.
          </p>
        </div>
      </div>

      <div className="p-8 md:p-12 bg-zinc-950/40 border border-white/5 rounded-[3rem] backdrop-blur-xl shadow-2xl">
        <WikiCreateForm />
      </div>
    </main>
  )
}
