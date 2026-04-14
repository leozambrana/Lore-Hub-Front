'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { ListSkeleton } from './SkeletonTemplates'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
} from '@/components/ui/multi-select-combobox'

interface MultiAsyncComboboxProps<T> {
  queryKey: string
  fetchFn: (page: number, search: string) => Promise<any>
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  labelField?: keyof T
  valueField?: keyof T
}

export function MultiAsyncCombobox<T extends object>({
  queryKey,
  fetchFn,
  value = [],
  onChange,
  placeholder = 'Selecionar múltiplos...',
  emptyMessage = 'Nenhum resultado encontrado.',
  className,
  labelField = 'name' as keyof T,
  valueField = 'id' as keyof T,
}: MultiAsyncComboboxProps<T>) {
  const [internalSearch, setInternalSearch] = React.useState('')
  const debouncedSearch = useDebounce(internalSearch, 300)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [queryKey, debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetchFn(pageParam as number, debouncedSearch)
      
      // Normalização: lida com { data, meta: { totalPages, page } } ou { data, lastPage, page }
      const items = res.data || []
      const currentPage = res.page ?? res.meta?.page ?? 1
      const totalPages = res.lastPage ?? res.meta?.totalPages ?? 1
      
      return {
        data: items as T[],
        page: currentPage,
        lastPage: totalPages
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.lastPage ? lastPage.page + 1 : undefined),
  })

  const options = data?.pages.flatMap((page) => page.data) || []

  const getLabel = (val: string) => {
    return options.find(opt => String(opt[valueField]) === val)?.[labelField] as string || val
  }

  return (
    <MultiSelect 
      value={value} 
      onValueChange={onChange}
      searchTerm={internalSearch}
      onSearchTermChange={setInternalSearch}
    >
       <MultiSelectTrigger 
         placeholder={placeholder} 
         className={className} 
         renderItem={(val) => getLabel(val)}
       />
       
       <MultiSelectContent isLoading={isLoading && options.length === 0} emptyMessage={emptyMessage}>
          {isLoading && options.length === 0 && (
             <div className="p-2">
                <ListSkeleton count={4} />
             </div>
          )}
          
          {options.map((option) => (
             <MultiSelectItem 
               key={option[valueField] as string} 
               value={option[valueField] as string}
               label={option[labelField] as string}
             />
          ))}

          {hasNextPage && (
            <div className="p-2 pt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary hover:bg-primary/5 h-8"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  fetchNextPage()
                }}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : "Carregar Mais"}
              </Button>
            </div>
          )}
       </MultiSelectContent>
    </MultiSelect>
  )
}

