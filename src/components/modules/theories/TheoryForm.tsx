'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import TextareaAutosize from 'react-textarea-autosize'
import { Theory } from '@/types'
import { useLoreStore } from '@/store/useLoreStore'
import axios from 'axios'
import { gamesService } from '@/services/games.service'
import { theoriesService } from '@/services/theories.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Check, ChevronsUpDown, Loader2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BackButton } from '@/components/shared/BackButton'

const formSchema = z.object({
  title: z.string().min(3, 'Sua teoria precisa de um título de respeito!'),
  content: z.string().min(10, 'O pergaminho está muito curto. Escreva mais!'),
  wikiUrl: z.union([z.literal(''), z.string().url('A URL inserida não é um formato de link válido.')]).optional(),
  gameId: z.string().min(1, 'Selecione de qual franquia vem essa lenda.'),
})

type FormValues = z.infer<typeof formSchema>

interface TheoryFormProps {
  initialData?: Theory
  preselectedGameId?: string
}

export function TheoryForm({ initialData, preselectedGameId }: TheoryFormProps) {
  const router = useRouter()
  const { user } = useLoreStore()
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!initialData

  const { data: gamesData } = useQuery({
    queryKey: ['games', 'approved'],
    queryFn: () => gamesService.getAllGames(1, 100),
  })
  const games = gamesData?.data || []

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      wikiUrl: initialData?.wikiUrl || '',
      gameId: initialData?.gameId || preselectedGameId || '',
    },
  })

  // Prevent leaving with unsaved changes on refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSaving) {
        e.preventDefault()
        e.returnValue = '' // Some browsers require this
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, isSaving])

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true)
    try {
      if (isEditing) {
        await theoriesService.updateTheory(initialData.id, values)
        toast.success('Alterações da sua teoria foram salvas com sucesso!')
      } else {
        await theoriesService.createTheory(values)
        toast.success('Teoria publicada eternamente na wiki!')
      }

      queryClient.invalidateQueries({ queryKey: ['theories'] })
      queryClient.invalidateQueries({ queryKey: ['game', values.gameId] })

      // Voltar para a frânquia com pre-reload
      router.push(`/games/${games.find(g => g.id === values.gameId)?.slug || ''}`)
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Erro ao publicar.')
      } else {
        toast.error('Erro inesperado.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (isEditing && initialData) {
      if (!user || (user.id !== initialData.userId && user.role !== 'ADMIN')) {
        toast.error('Você não tem permissão para editar esta teoria.')
        router.push('/')
      }
    }
  }, [user, isEditing, initialData, router])

  // Removed unused selectedGameId

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      {/* Top Navbar fixo */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <BackButton label="Voltar ou Cancelar" />
          
          <div className="flex items-center gap-4">
            {isDirty && <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Não salvo</span>}
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
              className="h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-[0_4px_20px_rgb(var(--primary)/0.3)] transition-all"
            >
              {isSaving ? <Loader2 className="animate-spin size-4 mr-2" /> : <Save className="size-4 mr-2" />}
              {isSaving ? 'Salvando...' : (isEditing ? 'Salvar Lenda' : 'Publicar Lenda')}
            </Button>
          </div>
        </div>
      </header>

      {/* Área de Escrita */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-8">
        
        {/* Informações Auxiliares: Game Selector e WikiUrl */}
        <div className="flex flex-col md:flex-row items-start gap-6 w-full mb-2">
           <div className="flex flex-col gap-2 w-full md:w-1/2">
             <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Franquia do Universo</Label>
             <Controller
               control={control}
               name="gameId"
               render={({ field }) => (
                 <Popover>
                   <PopoverTrigger asChild>
                     <Button
                       variant="outline"
                       role="combobox"
                       className={cn(
                         "w-full justify-between border-white/10 bg-white/5 hover:bg-white/10 rounded-xl",
                         !field.value && "text-muted-foreground"
                       )}
                     >
                       {field.value
                         ? games.find((g) => g.id === field.value)?.title
                         : "Selecione o Jogo..."}
                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-70 p-0 border-white/10 bg-zinc-950 rounded-xl">
                     <Command className="bg-transparent text-white">
                       <CommandInput placeholder="Buscar jogos..." />
                       <CommandList>
                         <CommandEmpty>Nenhum jogo encontrado.</CommandEmpty>
                         <CommandGroup>
                           {games.map((g) => (
                             <CommandItem
                               key={g.id}
                               value={g.title}
                               onSelect={() => {
                                 setValue('gameId', g.id, { shouldValidate: true, shouldDirty: true })
                               }}
                             >
                               <Check
                                 className={cn(
                                   "mr-2 h-4 w-4 text-primary",
                                   g.id === field.value ? "opacity-100" : "opacity-0"
                                 )}
                               />
                               {g.title}
                             </CommandItem>
                           ))}
                         </CommandGroup>
                       </CommandList>
                     </Command>
                   </PopoverContent>
                 </Popover>
               )}
             />
             {errors.gameId && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.gameId.message}</p>}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-1/2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Fonte da Wiki Oficial (Opcional)</Label>
            <Input
              {...register('wikiUrl')}
              placeholder="https://wiki.fandom.com/..."
              className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 text-white placeholder:text-zinc-600 h-9"
            />
            {errors.wikiUrl && <p className="text-[10px] text-destructive font-bold uppercase ml-1">{errors.wikiUrl.message}</p>}
          </div>
        </div>

        {/* Título */}
        <div className="flex flex-col gap-1 w-full">
           <TextareaAutosize
             {...register('title')}
             placeholder="Digite o título da sua teoria..."
             className="w-full resize-none bg-transparent border-none outline-none focus:ring-0 text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-white placeholder:text-zinc-800 p-0 m-0 leading-tight"
           />
           {errors.title && <p className="text-[10px] text-destructive font-bold uppercase ml-1 mt-2">{errors.title.message}</p>}
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col gap-1 w-full flex-1">
           <TextareaAutosize
             {...register('content')}
             minRows={10}
             placeholder="Escreva livremente sobre as origens, conexões obscuras e segredos esquecidos deste universo..."
             className="w-full resize-none bg-transparent border-none outline-none focus:ring-0 text-lg md:text-xl font-medium tracking-wide text-zinc-300 placeholder:text-zinc-700 p-0 m-0 leading-relaxed"
           />
           {errors.content && <p className="text-[10px] text-destructive font-bold uppercase ml-1 mt-4">{errors.content.message}</p>}
        </div>

      </main>
    </div>
  )
}
