'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Theory, TheoryFormProps } from '@/types'
import axios from 'axios'
import { gamesService } from '@/services/games.service'
import { theoriesService } from '@/services/theories.service'
import { wikiService } from '@/services/wiki.service'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldControl, FieldError } from '@/components/ui/field'

import { Loader2, Save, Library, X, Info } from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'
import { MultiAsyncCombobox } from '@/components/shared/MultiAsyncCombobox'
import { AsyncCombobox } from '@/components/shared/AsyncCombobox'

const formSchema = z.object({
  title: z.string().min(3, 'Especifique um título para sua teoria.'),
  content: z.string().min(10, 'A teoria está muito curta. Escreva mais!'),
  wikiUrl: z.union([z.literal(''), z.string().url('A URL inserida não é um formato de link válido.')]).optional().or(z.literal('')),
  gameId: z.string().uuid('Selecione a que jogo pertence esta teoria.'),
  wikiItemIds: z.array(z.string()).optional().default([]),
})

type FormValues = z.infer<typeof formSchema>

export function TheoryForm({ initialData, preselectedGameId }: TheoryFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      wikiUrl: initialData?.wikiUrl || '',
      gameId: initialData?.gameId || preselectedGameId || '',
      wikiItemIds: initialData?.wikiReferences?.map(ref => ref.wikiItemId) || [],
    },
  })

  const selectedGameId = watch('gameId')

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSaving) {
        e.preventDefault()
        e.returnValue = ''
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
        toast.success('Alterações salvas com sucesso!')
      } else {
        await theoriesService.createTheory(values)
        toast.success('Teoria publicada com sucesso!')
      }

      queryClient.invalidateQueries({ queryKey: ['theories'] })
      router.push(`/theories`) 
      router.refresh()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Erro ao publicar.')
      } else {
        toast.error('Erro inesperado.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex-1 container max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <BackButton label="Cancelar" className="mb-4" />
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
            {isEditing ? 'Editar' : 'Criar'}
            {' '}
            <span className="text-primary not-italic">Teoria</span>
          </h1>
          <p className="text-zinc-500 max-w-xl text-sm font-medium">
            Conecte os pontos e compartilhe suas descobertas com a comunidade.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-950/40 p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-xl transition-all hover:bg-zinc-950/50">
          
          <Field error={errors.title?.message} className="md:col-span-2">
            <FieldLabel>Título da Investigação</FieldLabel>
            <FieldControl>
              <Input 
                placeholder="Ex: A verdadeira identidade de Melina..." 
                className="h-16 bg-zinc-950/60 border-white/10 rounded-2xl focus:border-primary/50 text-white font-bold text-xl px-6"
                {...register('title')} 
              />
            </FieldControl>
            <FieldError />
          </Field>

          <Field error={errors.gameId?.message}>
            <FieldLabel>Universo / Franquia</FieldLabel>
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
                  showClear
                />
              )}
            />
            <FieldError />
          </Field>

          <Field error={errors.wikiUrl?.message}>
            <FieldLabel>Fonte Wiki (Opcional)</FieldLabel>
            <FieldControl>
              <Input 
                placeholder="https://wiki.fextralife.com/..." 
                className="h-14 bg-zinc-950/60 border-white/10 rounded-2xl focus:border-primary/50 text-white text-sm px-6"
                {...register('wikiUrl')} 
              />
            </FieldControl>
            <FieldError />
          </Field>

          <Field className="md:col-span-2">
            <div className="flex items-center gap-2 ml-1 mb-1">
              <Library size={12} className="text-primary" />
              <FieldLabel className="ml-0">Mencionar Entidades do Hub</FieldLabel>
            </div>
            <Controller
              control={control}
              name="wikiItemIds"
              render={({ field }) => (
                <MultiAsyncCombobox
                  queryKey={`wiki-items-${selectedGameId}`}
                  fetchFn={(page, search) => wikiService.getAll({ 
                    page, 
                    limit: 10, 
                    gameId: selectedGameId || undefined, 
                    search 
                  })}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={selectedGameId ? "Mencione personagens, itens ou locais catalogados..." : "Selecione um jogo primeiro..."}
                />
              )}
            />
            {!selectedGameId && (
              <div className="flex items-center gap-2 p-4 bg-primary/5 border border-primary/10 rounded-2xl text-[10px] text-primary/80 uppercase font-black tracking-widest mt-2">
                <Info size={12} /> Selecione um jogo acima para habilitar as menções
              </div>
            )}
            <FieldError />
          </Field>

          <Field error={errors.content?.message} className="md:col-span-2">
            <FieldLabel>Manuscrito da Teoria</FieldLabel>
            <FieldControl>
              <Textarea 
                placeholder="Descreva suas conexões, evidências e conclusões..." 
                className="min-h-[450px] bg-zinc-950/60 border-white/10 rounded-[2.5rem] p-8 focus:border-primary/50 text-white leading-relaxed font-medium resize-none text-lg shadow-inner"
                {...register('content')} 
              />
            </FieldControl>
            <FieldError />
          </Field>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1 h-16 bg-primary hover:bg-primary/80 text-black font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/20 transition-all font-sans"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} className="mr-2" /> {isEditing ? 'Salvar Mudanças' : 'Publicar no Hub'}</>}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-16 px-10 border-white/10 bg-zinc-950/40 text-zinc-400 hover:text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] transition-all"
          >
            <X size={20} className="mr-2" /> Descartar
          </Button>
        </div>
      </form>
    </div>
  )
}
