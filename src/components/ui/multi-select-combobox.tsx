'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

interface MultiSelectContextType {
  value: string[]
  onSelect: (val: string) => void
  onRemove: (val: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (search: string) => void
}

const MultiSelectContext = React.createContext<MultiSelectContextType | undefined>(undefined)

function useMultiSelect() {
  const context = React.useContext(MultiSelectContext)
  if (!context) throw new Error('useMultiSelect must be used within MultiSelect')
  return context
}

export function MultiSelect({ 
  children, 
  value = [], 
  onValueChange,
  searchTerm: managedSearch,
  onSearchTermChange
}: { 
  children: React.ReactNode, 
  value: string[], 
  onValueChange: (val: string[]) => void,
  searchTerm?: string,
  onSearchTermChange?: (search: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [internalSearch, setInternalSearch] = React.useState('')

  const searchTerm = managedSearch !== undefined ? managedSearch : internalSearch

  const setSearchTerm = React.useCallback((search: string) => {
    if (managedSearch === undefined) {
      setInternalSearch(search)
    }
    onSearchTermChange?.(search)
  }, [managedSearch, onSearchTermChange])

  const onSelect = React.useCallback((val: string) => {
    const newValue = value.includes(val) 
      ? value.filter(v => v !== val)
      : [...value, val]
    onValueChange(newValue)
  }, [value, onValueChange])

  const onRemove = React.useCallback((val: string) => {
    onValueChange(value.filter(v => v !== val))
  }, [value, onValueChange])

  return (
    <MultiSelectContext.Provider value={{ value, onSelect, onRemove, open, setOpen, searchTerm, setSearchTerm }}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-3">
          {children}
        </div>
      </Popover>
    </MultiSelectContext.Provider>
  )
}

export function MultiSelectTrigger({ placeholder, className, renderItem }: { placeholder?: string, className?: string, renderItem?: (val: string) => React.ReactNode }) {
  const { value, onRemove, open } = useMultiSelect()

  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn('w-full min-h-12 h-auto py-2 justify-between bg-zinc-950/60 border-white/10 text-white rounded-xl relative group flex-wrap gap-2', className)}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {value.length === 0 && <span className="text-zinc-500">{placeholder}</span>}
          {value.map((val) => (
             <Badge 
              key={val} 
              variant="secondary" 
              className="bg-zinc-800/80 text-white border-white/10 hover:bg-zinc-700 transition-colors py-1 pl-2 pr-1 gap-1"
             >
               <span className="max-w-[150px] truncate">{renderItem ? renderItem(val) : val}</span>
               <div
                 role="button"
                 onClick={(e) => {
                   e.preventDefault()
                   e.stopPropagation()
                   onRemove(val)
                 }}
                 className="hover:text-red-400 transition-colors p-0.5"
               >
                 <X size={10} />
               </div>
             </Badge>
          ))}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  )
}

export function MultiSelectContent({ children, isLoading, emptyMessage = "Nenhum resultado." }: { children: React.ReactNode, isLoading?: boolean, emptyMessage?: string }) {
  const { searchTerm, setSearchTerm } = useMultiSelect()

  return (
    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-950 border-white/10" align="start">
      <Command className="bg-transparent" shouldFilter={false}>
        <CommandInput 
          placeholder="Buscar..." 
          className="text-white" 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList className="max-h-64 overflow-y-auto no-scrollbar">
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && <CommandEmpty className="text-zinc-500 text-xs py-6">{emptyMessage}</CommandEmpty>}
          <CommandGroup>
            {children}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  )
}

export function MultiSelectItem({ value: itemValue, label }: { value: string, label: string }) {
  const { value, onSelect } = useMultiSelect()
  const isSelected = value.includes(itemValue)

  return (
    <CommandItem
      value={itemValue}
      onSelect={() => onSelect(itemValue)}
      className="text-zinc-300 hover:text-white data-selected:bg-white/10 data-selected:text-white"
    >
      <Check
        className={cn(
          'mr-2 h-4 w-4',
          isSelected ? 'opacity-100' : 'opacity-0'
        )}
      />
      {label}
    </CommandItem>
  )
}
