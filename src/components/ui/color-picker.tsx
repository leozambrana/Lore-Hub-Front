'use client'

import * as React from 'react'
import { Check, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export const NOTE_COLORS = [
  { name: 'yellow', label: 'Amarelo', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-500', pill: 'bg-yellow-500' },
  { name: 'red', label: 'Vermelho', bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-500', pill: 'bg-red-500' },
  { name: 'emerald', label: 'Verde', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-500', pill: 'bg-emerald-500' },
  { name: 'blue', label: 'Azul', bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-500', pill: 'bg-blue-500' },
  { name: 'purple', label: 'Roxo', bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-500', pill: 'bg-purple-500' },
  { name: 'slate', label: 'Cinza', bg: 'bg-zinc-500/20', border: 'border-zinc-500/50', text: 'text-zinc-400', pill: 'bg-zinc-500' },
]

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
  disabled?: boolean
}

export function ColorPicker({ value = 'yellow', onChange, disabled }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(
            "h-6 w-6 rounded-full border border-white/10 hover:bg-white/5",
            NOTE_COLORS.find(c => c.name === value)?.text || "text-zinc-500"
          )}
        >
          <Palette size={12} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2 bg-zinc-950 border-white/20 rounded-2xl shadow-2xl" side="top" align="center">
        <div className="flex items-center gap-1.5">
          {NOTE_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                onChange(color.name)
                setOpen(false)
              }}
              className={cn(
                "h-6 w-6 rounded-full ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-110 flex items-center justify-center",
                color.pill,
                value === color.name ? "ring-2 ring-white" : "ring-0"
              )}
              title={color.label}
            >
              {value === color.name && <Check size={10} className="text-black font-bold" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
