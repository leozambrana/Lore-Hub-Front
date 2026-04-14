'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
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

interface ComboboxContextType {
  value: string
  setValue: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (search: string) => void
}

const ComboboxContext = React.createContext<ComboboxContextType | undefined>(undefined)

function useCombobox() {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error('useCombobox must be used within a Combobox')
  }
  return context
}

export interface ComboboxProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  searchTerm?: string
  onSearchTermChange?: (search: string) => void
}

export function Combobox({ 
  children, 
  value: managedValue, 
  onValueChange, 
  defaultValue,
  searchTerm: managedSearch,
  onSearchTermChange
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  const [internalSearch, setInternalSearch] = React.useState('')

  const value = managedValue !== undefined ? managedValue : internalValue
  const searchTerm = managedSearch !== undefined ? managedSearch : internalSearch
  
  const setSearchTerm = React.useCallback((search: string) => {
    if (managedSearch === undefined) {
      setInternalSearch(search)
    }
    onSearchTermChange?.(search)
  }, [managedSearch, onSearchTermChange])

  const setValue = React.useCallback((newValue: string) => {
    if (managedValue === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }, [managedValue, onValueChange])

  return (
    <ComboboxContext.Provider value={{ value, setValue, open, setOpen, searchTerm, setSearchTerm }}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  )
}

export function ComboboxInput({ placeholder, className, showClear = true, value: displayValue }: { placeholder?: string, className?: string, showClear?: boolean, value?: string }) {
  const { value: contextValue, setValue, open } = useCombobox()

  const label = displayValue || contextValue

  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn('w-full justify-between bg-zinc-950/60 border-white/20 text-white rounded-xl h-12 relative group', className)}
      >
        <span className="truncate">
          {label || placeholder}
        </span>
        <div className="flex items-center gap-2 pr-1">
          {showClear && contextValue && (
            <div 
              role="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setValue('')
              }}
              className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-500 hover:text-white"
            >
              <X className="h-3 w-3" />
            </div>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </Button>
    </PopoverTrigger>
  )
}

export function ComboboxContent({ children, className }: { children: React.ReactNode, className?: string }) {
  const { searchTerm, setSearchTerm } = useCombobox()

  return (
    <PopoverContent className={cn("w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-950 border-white/20", className)} align="start">
      <Command className="bg-transparent" shouldFilter={false}>
        <CommandInput 
          placeholder="Buscar..." 
          className="text-white" 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        {children}
      </Command>
    </PopoverContent>
  )
}

export function ComboboxList({ children }: { children: React.ReactNode }) {
  return <CommandList className="max-h-64 overflow-y-auto no-scrollbar">{children}</CommandList>
}

export function ComboboxEmpty({ children }: { children: React.ReactNode }) {
  return <CommandEmpty className="text-zinc-500 text-xs py-6">{children}</CommandEmpty>
}

export function ComboboxGroup({ children, heading }: { children: React.ReactNode, heading?: string }) {
  return <CommandGroup heading={heading}>{children}</CommandGroup>
}

export function ComboboxItem({ value: itemValue, children, className, onSelect }: { value: string, children: React.ReactNode, className?: string, onSelect?: (val: string) => void }) {
  const { value, setValue, setOpen } = useCombobox()

  return (
    <CommandItem
      value={itemValue}
      onSelect={(currentValue) => {
        if (onSelect) {
          onSelect(currentValue)
        } else {
          setValue(currentValue === value ? '' : currentValue)
        }
        setOpen(false)
      }}
      className={cn("text-zinc-300 hover:text-white data-selected:bg-white/10 data-selected:text-white", className)}
    >
      <Check
        className={cn(
          'mr-2 h-4 w-4',
          value === itemValue ? 'opacity-100' : 'opacity-0'
        )}
      />
      {children}
    </CommandItem>
  )
}

