'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  label?: string
  className?: string
}

/**
 * Botão de voltar universal — usa router.back() para retornar à rota anterior
 * sem hardcodar nenhum caminho específico.
 */
export function BackButton({ label = 'Voltar', className }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        'flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group',
        className,
      )}
    >
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
        <ArrowLeft size={15} />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  )
}
