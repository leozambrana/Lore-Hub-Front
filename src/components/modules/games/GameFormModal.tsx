'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, Plus, Pencil } from 'lucide-react'
import { Game } from '@/types'
import { gamesService } from '@/services/games.service'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageDragger } from '@/components/ui/image-dragger'

const formSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  slug: z.string().min(3, 'Mínimo 3 caracteres'),
  image: z.unknown().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface GameFormModalProps {
  game?: Game
}

export function GameFormModal({ game }: GameFormModalProps) {
  const isEdit = !!game
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: game?.title || '',
      slug: game?.slug || '',
    }
  })

  // Sincroniza quando o modal abre ou o game muda
  useEffect(() => {
    if (open) {
      reset({
        title: game?.title || '',
        slug: game?.slug || '',
      })
      setSelectedFile(null)
    }
  }, [open, game, reset])

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }

  async function onSubmit(values: FormValues) {
    console.log('submit')
    if (!isEdit && !selectedFile) {
      toast.error('A imagem é obrigatória!')
      return
    }

    setLoading(true)
    try {
      let imageUrl = game?.imageUrl || ''

      if (selectedFile) {
        const filePath = `games/${Date.now()}-${selectedFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('game-images')
          .upload(filePath, selectedFile)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage
          .from('game-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      }

      const payload = {
        title: values.title,
        slug: values.slug,
        imageUrl,
      }

      if (isEdit) {
        await gamesService.updateGame(game.id, payload)
        toast.success('Franquia atualizada!')
      } else {
        await gamesService.createGame(payload)
        toast.success('Franquia criada!')
      }

      queryClient.invalidateQueries({ queryKey: ['games'] })
      setOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Erro ao salvar franquia')
      } else {
        toast.error('Erro inesperado.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white">
            <Pencil size={14} />
          </Button>
        ) : (
          <Button className="h-10 bg-primary px-6 text-[10px] font-black uppercase tracking-widest shadow-lg">
            <Plus size={14} className="mr-2" /> Nova Franquia
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase italic">
            {isEdit ? 'Editar Franquia' : 'Nova Franquia'}
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Preencha os dados do universo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Título</Label>
            <Input 
              {...register('title')} 
              onChange={(e) => {
                register('title').onChange(e)
                const val = e.target.value
                setValue('slug', generateSlug(val))
              }}
              className="bg-white/5 border-white/10 rounded-xl"
            />
            {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Slug</Label>
            <Input {...register('slug')} className="bg-white/5 border-white/10 rounded-xl opacity-50" />
            {errors.slug && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Capa</Label>
            <ImageDragger 
              key={open ? (game?.id || 'new') : 'closed'}
              // Id único por modal: evita conflito de <label htmlFor> quando ambos os modais estão na página
              inputId={isEdit ? `image-dragger-${game.id}` : 'image-dragger-new'}
              onFileSelect={(file) => setSelectedFile(file)}
              onRemove={() => setSelectedFile(null)}
              defaultValue={game?.imageUrl}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary font-black uppercase tracking-widest rounded-xl">
              {loading ? <Loader2 className="animate-spin" /> : (isEdit ? 'Salvar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}