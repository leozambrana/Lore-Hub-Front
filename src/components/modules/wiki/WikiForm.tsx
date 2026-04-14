'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { wikiService } from '@/services/wiki.service'
import { gamesService } from '@/services/games.service'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AsyncCombobox } from '@/components/shared/AsyncCombobox'
import { Combobox } from '@/components/shared/Combobox'
import { WikiItem } from '@/types'
import { ImageDragger } from '@/components/ui/image-dragger'

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'A descrição deve ser mais detalhada'),
  category: z.enum(['CHARACTER', 'ITEM', 'LOCATION', 'EVENT', 'OTHER']),
  gameId: z.string().uuid('Selecione um jogo válido'),
})

type FormValues = z.infer<typeof formSchema>

const CATEGORY_OPTIONS = [
  { value: 'CHARACTER', label: 'Personagem' },
  { value: 'ITEM', label: 'Item' },
  { value: 'LOCATION', label: 'Local' },
  { value: 'EVENT', label: 'Evento' },
  { value: 'OTHER', label: 'Outro' },
]

interface WikiFormProps {
  initialData?: WikiItem
  isEdit?: boolean
}

export function WikiForm({ initialData, isEdit = false }: WikiFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || 'CHARACTER',
      gameId: initialData?.gameId || '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      let savedItem: WikiItem;
      
      if (isEdit && initialData) {
        savedItem = await wikiService.update(initialData.id, data)
      } else {
        savedItem = await wikiService.create(data)
      }

      // Se tiver imagem selecionada, sobe ela
      if (selectedFile) {
        await wikiService.uploadImage(savedItem.id, selectedFile)
      }

      return savedItem
    },
    onSuccess: (savedItem) => {
      toast.success(isEdit ? 'Registro atualizado!' : 'Item catalogado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['wiki'] })
      queryClient.invalidateQueries({ queryKey: ['wiki', initialData?.id] })
      
      router.push(`/wiki/${savedItem.id || initialData?.id}`)
      router.refresh()
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erro ao processar registro.'
      toast.error(message)
    },
  })

  const onSubmit = (values: FormValues) => {
    mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Imagem (Destaque no topo) */}
        <div className="md:col-span-2 space-y-4">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Imagem da Entidade</Label>
          <ImageDragger 
            defaultValue={initialData?.imageUrl}
            onFileSelect={(file) => setSelectedFile(file)}
            onRemove={() => setSelectedFile(null)}
          />
        </div>

        {/* Nome */}
        <div className="md:col-span-2 space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome da Entidade</Label>
          <Input 
            placeholder="Ex: Malenia, Espada de Miquella" 
            className="h-14 bg-zinc-950/60 border-white/20 rounded-2xl focus:border-primary/50 text-white font-bold"
            {...register('name')} 
          />
          {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.name.message}</p>}
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Categoria</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Combobox
                options={CATEGORY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione a categoria"
              />
            )}
          />
          {errors.category && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.category.message}</p>}
        </div>

        {/* Jogo with AsyncCombobox */}
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Jogo / Universo</Label>
          <Controller
            control={control}
            name="gameId"
            render={({ field }) => (
              <AsyncCombobox
                queryKey="games"
                fetchFn={(page, search) => gamesService.getAllGames(page, 10, search)}
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione o jogo"
                emptyMessage="Nenhum jogo encontrado."
              />
            )}
          />
          {errors.gameId && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.gameId.message}</p>}
        </div>

        {/* Descrição */}
        <div className="md:col-span-2 space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Descrição / Lore</Label>
          <Textarea 
            placeholder="Descreva a importância desta entidade no universo..." 
            className="min-h-[200px] bg-zinc-950/60 border-white/20 rounded-3xl p-6 focus:border-primary/50 text-white leading-relaxed font-medium resize-none text-sm"
            {...register('description')} 
          />
          {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 h-14 bg-primary hover:bg-primary/80 text-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl shadow-primary/10 transition-all"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              {isEdit ? <RotateCcw size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
              {isEdit ? 'Salvar Alterações' : 'Catalogar Agora'}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-14 px-8 border-white/20 bg-zinc-950/60 text-zinc-400 hover:text-white rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all"
        >
          <X size={18} className="mr-2" /> Cancelar
        </Button>
      </div>
    </form>
  )
}

