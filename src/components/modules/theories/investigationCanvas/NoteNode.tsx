import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { StickyNote } from 'lucide-react'
import { ColorPicker, NOTE_COLORS } from '@/components/ui/color-picker'
import { cn } from '@/lib/utils'

interface NoteNodeData {
  label: string
  color?: string
  onChange?: (label: string) => void
  onColorChange?: (color: string) => void
}

export const NoteNode = ({ data }: NodeProps<NoteNodeData>) => {
  const colorConfig = NOTE_COLORS.find(c => c.name === (data.color || 'yellow')) || NOTE_COLORS[0]

  return (
    <div className="group relative">
      {/* Brilho de fundo dinâmico (Neon Effect) */}
      <div className={cn(
        "absolute -inset-0.5 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000",
        colorConfig.pill
      )}></div>
      
      <div className={cn(
        "relative px-4 py-3 bg-[#09090b] border rounded-xl shadow-2xl min-w-[220px] min-h-[160px] flex flex-col gap-2 ring-1 transition-all duration-500",
        colorConfig.border,
        "ring-white/5"
      )}>
        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-1">
          <div className="flex items-center gap-2">
            <StickyNote size={14} className={colorConfig.text} />
            <span className={cn("text-[9px] font-black uppercase tracking-widest opacity-70", colorConfig.text)}>
              Insight Pessoal
            </span>
          </div>

          <div className="nodrag">
            <ColorPicker 
              value={data.color || 'yellow'} 
              onChange={(newColor) => data.onColorChange?.(newColor)} 
            />
          </div>
        </div>

        <textarea
          className="nodrag nowheel w-full flex-1 bg-transparent text-zinc-200 text-xs font-medium resize-none outline-none placeholder:text-zinc-700 leading-relaxed custom-scrollbar selection:bg-white/10"
          placeholder="Escreva sua hipótese aqui..."
          value={data.label}
          onChange={(e) => data.onChange?.(e.target.value)}
        />

        {/* Handles para conexões em todos os lados (Maiores para facilitar o clique) */}
        <Handle type="target" position={Position.Top} id="t-t" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -top-1.5" />
        <Handle type="source" position={Position.Top} id="s-t" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -top-1.5" />
        
        <Handle type="target" position={Position.Bottom} id="t-b" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -bottom-1.5" />
        <Handle type="source" position={Position.Bottom} id="s-b" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -bottom-1.5" />
        
        <Handle type="target" position={Position.Left} id="t-l" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -left-1.5" />
        <Handle type="source" position={Position.Left} id="s-l" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -left-1.5" />
        
        <Handle type="target" position={Position.Right} id="t-r" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -right-1.5" />
        <Handle type="source" position={Position.Right} id="s-r" className="w-3.5 h-3.5 !bg-white !border-2 !border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity z-10 -right-1.5" />
      </div>
    </div>
  )
}
