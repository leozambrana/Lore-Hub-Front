import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { User, Sword, Map, History, HelpCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface WikiNodeData {
  label: string
  category: string
  imageUrl?: string
}

const CATEGORY_CONFIG: Record<string, { border: string, glow: string, icon: any, color: string }> = {
  CHARACTER: { border: 'border-red-500', glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]', icon: User, color: 'text-red-500' },
  ITEM: { border: 'border-blue-500', glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]', icon: Sword, color: 'text-blue-500' },
  LOCATION: { border: 'border-purple-500', glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]', icon: Map, color: 'text-purple-500' },
  EVENT: { border: 'border-orange-500', glow: 'group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]', icon: History, color: 'text-orange-500' },
  OTHER: { border: 'border-zinc-400', glow: 'group-hover:shadow-[0_0_20px_rgba(161,161,170,0.5)]', icon: HelpCircle, color: 'text-zinc-400' },
}

export const WikiNode = ({ data }: NodeProps<WikiNodeData>) => {
  const config = CATEGORY_CONFIG[data.category as keyof typeof CATEGORY_CONFIG] || CATEGORY_CONFIG.OTHER
  const Icon = config.icon

  return (
    <div className="group relative w-32 h-32 hover:z-50">
      {/* Handles Universais (Maiores para facilitar o clique) */}
      <Handle type="target" position={Position.Top} id="t-t" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -top-1.5" />
      <Handle type="source" position={Position.Top} id="s-t" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -top-1.5" />
      
      <Handle type="target" position={Position.Bottom} id="t-b" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -bottom-1.5" />
      <Handle type="source" position={Position.Bottom} id="s-b" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -bottom-1.5" />
      
      <Handle type="target" position={Position.Left} id="t-l" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -left-1.5" />
      <Handle type="source" position={Position.Left} id="s-l" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -left-1.5" />
      
      <Handle type="target" position={Position.Right} id="t-r" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -right-1.5" />
      <Handle type="source" position={Position.Right} id="s-r" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -right-1.5" />

      {/* Container Principal do Token */}
      <div className={cn(
        "w-full h-full rounded-full transition-all duration-500 hover:scale-110 active:scale-95 cursor-grab active:cursor-grabbing",
        "border-4 bg-zinc-950 flex items-center justify-center overflow-hidden shadow-2xl relative",
        config.border,
        config.glow
      )}>
        {/* Imagem de Fundo */}
        {data.imageUrl ? (
          <Image 
            src={data.imageUrl} 
            alt={data.label}
            fill
            className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
            <Icon size={32} className={config.color} />
          </div>
        )}

        {/* Overlay de Nome Arredondado */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-2 px-2 text-center translate-y-4 group-hover:translate-y-0 transition-transform">
          <p className="text-[9px] font-black uppercase tracking-tight text-white truncate max-w-full">
            {data.label}
          </p>
        </div>
      </div>
    </div>
  )
}
