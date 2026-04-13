'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import { ListSkeleton } from './SkeletonTemplates'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

interface AsyncComboboxProps<T> {
  queryKey: string
  fetchFn: (page: number, search: string) => Promise<any>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  labelField?: keyof T
  valueField?: keyof T
  showClear?: boolean
}

export function AsyncCombobox<T extends object>({
  queryKey,
  fetchFn,
  value,
  onChange,
  placeholder = 'Selecione...',
  emptyMessage = 'Nenhum resultado encontrado.',
  className,
  labelField = 'title' as keyof T,
  valueField = 'id' as keyof T,
  showClear = false,
}: AsyncComboboxProps<T>) {
  const [search, setSearch] = React.useState('')
  const debouncedSearch = useDebounce(search, 300)

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
  const selectedLabel = options.find((opt) => String(opt[valueField]) === value)?.[labelField] as string || value

  return (
    <Combobox 
      value={value} 
      onValueChange={onChange}
      searchTerm={search}
      onSearchTermChange={setSearch}
    >
      <ComboboxInput 
        value={value ? selectedLabel : undefined}
        placeholder={placeholder} 
        className={className} 
        showClear={showClear} 
      />
      <ComboboxContent>
        <ComboboxList>
          {isLoading && options.length === 0 && (
            <div className="p-2">
               <ListSkeleton count={4} />
            </div>
          )}
          {!isLoading && options.length === 0 && (
            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          )}
          
          {options.map((option) => (
            <ComboboxItem
              key={option[valueField] as string}
              value={option[valueField] as string}
            >
              {option[labelField] as string}
            </ComboboxItem>
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
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
