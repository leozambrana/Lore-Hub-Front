'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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

interface ComboboxProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  isLoading?: boolean
  onSearchChange?: (search: string) => void
  onLoadMore?: () => void
  hasNextPage?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhuma opção encontrada.',
  className,
  isLoading,
  onSearchChange,
  onLoadMore,
  hasNextPage,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between bg-zinc-950/60 border-white/10 text-white rounded-xl h-12', className)}
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.value === value)?.label || value
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10" align="start">
        <Command className="bg-transparent" shouldFilter={!onSearchChange}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="text-white" 
            onValueChange={onSearchChange}
          />
          <CommandList className="max-h-64 overflow-y-auto no-scrollbar">
            {isLoading && options.length === 0 && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            )}
            <CommandEmpty className="text-zinc-500 text-xs py-6">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                  className="text-zinc-300 hover:text-white data-selected:bg-white/10 data-selected:text-white"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            
            {hasNextPage && (
              <div className="p-2 pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary hover:bg-primary/5"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onLoadMore?.()
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                  Carregar Mais
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
