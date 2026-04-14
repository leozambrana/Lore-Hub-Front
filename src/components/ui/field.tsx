'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldContextType {
  id: string
  error?: string
  descriptionId?: string
  errorId?: string
}

const FieldContext = React.createContext<FieldContextType | undefined>(undefined)

export function useField() {
  const context = React.useContext(FieldContext)
  if (!context) return {}
  return context
}

export interface FieldProps {
  children: React.ReactNode
  error?: string
  className?: string
}

export function Field({ children, error, className }: FieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const descriptionId = `${id}-description`

  return (
    <FieldContext.Provider value={{ id, error, errorId, descriptionId }}>
      <div className={cn("space-y-2", className)}>
        {children}
      </div>
    </FieldContext.Provider>
  )
}

export function FieldLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  const { id } = useField()
  return (
    <Label 
      htmlFor={id} 
      className={cn("text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1", className)}
    >
      {children}
    </Label>
  )
}

export function FieldControl({ children }: { children: React.ReactNode }) {
  const { id, error, errorId, descriptionId } = useField()

  return React.cloneElement(children as React.ReactElement, {
    id: (children as React.ReactElement).props.id || id,
    'aria-describedby': error ? errorId : descriptionId,
    'aria-invalid': !!error,
  })
}

export function FieldDescription({ children, className }: { children?: React.ReactNode, className?: string }) {
  const { descriptionId } = useField()
  if (!children) return null
  
  return (
    <p
      id={descriptionId}
      className={cn("text-[10px] text-zinc-500 font-medium ml-1 italic", className)}
    >
      {children}
    </p>
  )
}

export function FieldError({ children, className }: { children?: React.ReactNode, className?: string }) {
  const { error, errorId } = useField()
  const message = children || error

  if (!message) return null

  return (
    <p
      id={errorId}
      className={cn("text-red-500 text-[10px] font-bold uppercase ml-1", className)}
    >
      {message}
    </p>
  )
}

