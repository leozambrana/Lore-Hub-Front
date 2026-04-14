import React, { useState } from 'react'
import { Edge } from 'reactflow'
import { Link as LinkIcon, Trash2 } from 'lucide-react'
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EdgeEditFormProps {
  edge: Edge
  onSave: (label: string) => void
  onCancel: () => void
  onDelete: () => void
}

export function EdgeEditForm({ edge, onSave, onCancel, onDelete }: EdgeEditFormProps) {
  const [label, setLabel] = useState((edge.label as string) || '')

  return (
    <>
      <DialogHeader className="pt-2">
        <DialogTitle className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LinkIcon size={20} className="text-primary" />
          </div>
          Vínculo de Lógica
        </DialogTitle>
      </DialogHeader>
      
      <div className="py-8 space-y-6">
        <div className="space-y-3">
          <Label htmlFor="label" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
            Significado da Conexão
          </Label>
          <div className="relative group/input">
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: É suspeito de, Relacionado a..."
              className="bg-zinc-900/50 border-white/20 text-white h-14 rounded-2xl focus-visible:ring-primary/50 focus-visible:border-primary/50 outline-none transition-all px-6 text-sm font-medium placeholder:text-zinc-700 shadow-inner"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSave(label)
              }}
            />
            <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity blur-xl" />
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse" />
          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
            Esta descrição ajuda a organizar o raciocínio. Ela ficará visível para todos que acessarem este quadro de investigação.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4 sm:gap-y-0 mt-4 pt-6 border-t border-white/20">
        <Button 
          variant="ghost" 
          onClick={onDelete}
          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest h-10 px-3 rounded-xl w-full sm:w-auto"
        >
          <Trash2 size={14} className="mr-2" />
          Apagar Vínculo
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 sm:flex-none border-white/20 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-10 rounded-xl text-white px-4 transition-colors"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => onSave(label)}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-black text-[10px] font-black uppercase tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all font-bold"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </>
  )
}

