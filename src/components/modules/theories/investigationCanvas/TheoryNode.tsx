import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { FileSearch, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TheoryNodeData {
  label: string
  imageUrl?: string
}

export const TheoryNode = ({ data }: NodeProps<TheoryNodeData>) => (
  <div className="group relative w-52 h-64 transition-all duration-500 hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing">
    {/* Brilho Âmbar de "Nó Raiz" */}
    <div className="absolute -inset-1 bg-amber-500/20 rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000"></div>
    
    <div className={cn(
      "relative w-full h-full bg-zinc-950 border-4 border-amber-500/50 rounded-xl flex flex-col p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
      "group-hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-500"
    )}>
      
      {/* Área da Foto (Polaroid Style) */}
      <div className="relative w-full h-[70%] bg-zinc-900 rounded-sm overflow-hidden border border-white/5">
        {data.imageUrl ? (
          <Image 
            src={data.imageUrl} 
            alt={data.label}
            fill
            className="object-cover sepia-[0.2] contrast-[1.1] group-hover:sepia-0 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50">
            <FileSearch size={40} className="text-amber-500/40" />
          </div>
        )}
        
        {/* Badge "Principal" */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-black text-[8px] font-black uppercase tracking-tighter rounded-sm animate-pulse">
           Pista Mestra
        </div>
      </div>

      {/* Área do Título (Escrito à mão style) */}
      <div className="flex-1 flex flex-col justify-center px-2 py-3 overflow-hidden">
        <h3 className="text-zinc-100 text-sm font-bold leading-tight line-clamp-2 uppercase tracking-tight italic">
          {data.label}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 opacity-50">
          <Sparkles size={10} className="text-amber-500" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500">
            LoreHub Evidence
          </span>
        </div>
      </div>
    </div>

    {/* Handles Universais (Maiores para facilitar o clique) */}
    <Handle type="target" position={Position.Top} id="t-t" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -top-1.5" />
    <Handle type="source" position={Position.Top} id="s-t" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -top-1.5" />
    
    <Handle type="target" position={Position.Bottom} id="t-b" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -bottom-1.5" />
    <Handle type="source" position={Position.Bottom} id="s-b" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -bottom-1.5" />
    
    <Handle type="target" position={Position.Left} id="t-l" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -left-1.5" />
    <Handle type="source" position={Position.Left} id="s-l" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -left-1.5" />
    
    <Handle type="target" position={Position.Right} id="t-r" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -right-1.5" />
    <Handle type="source" position={Position.Right} id="s-r" className="w-3.5 h-3.5 !bg-white border-2! border-zinc-950! opacity-0 group-hover:opacity-100 transition-opacity z-10 -right-1.5" />
  </div>
)
