'use client'

import { useState, useEffect } from 'react'
import { X, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageDraggerProps {
  onFileSelect: (file: File) => void
  onRemove: () => void
  defaultValue?: string | null
  error?: string
  className?: string
  inputId?: string // <-- prop adicionada para evitar conflito de id entre modais
}

export function ImageDragger({ 
  onFileSelect, 
  onRemove, 
  defaultValue, 
  error, 
  className,
  inputId = 'image-dragger-input', // <-- valor padrão
}: ImageDraggerProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(defaultValue || null)

  // Sincroniza o preview quando o defaultValue mudar (ex: ao abrir modal de edição)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(defaultValue || null)
  }, [defaultValue])

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    onFileSelect(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPreview(null)
    onRemove()
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div 
        className={cn(
          'relative h-48 w-full border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden',
          dragActive ? 'border-primary bg-primary/5 scale-[0.98]' : 'border-white/20 bg-white/5 hover:border-white/20',
          preview ? 'border-solid border-white/20' : '',
          error ? 'border-destructive animate-shake' : ''
        )}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {/* inputId único evita conflito quando há múltiplos modais na página */}
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        
        {preview ? (
          <div className="relative w-full h-full group rounded-[inherit] overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] rounded-[inherit] z-20">
               <Button 
                 type="button" 
                 variant="destructive" 
                 size="sm" 
                 className="rounded-full h-10 w-10 p-0 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
                 onClick={handleRemove}
               >
                 <X size={18} />
               </Button>
            </div>
          </div>
        ) : (
          <label 
            htmlFor={inputId} // <-- usa o inputId único
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-zinc-500 transition-transform group-hover:scale-110">
              <ImageIcon size={28} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center balance">
               Arraste a arte do universo ou clique
            </span>
            <span className="text-[9px] text-zinc-600 mt-3 font-mono opacity-60">PNG, JPG ou WebP recomendados</span>
          </label>
        )}
      </div>
      {error && <p className="text-[10px] text-destructive font-black uppercase tracking-wider pl-1">{error}</p>}
    </div>
  )
}
