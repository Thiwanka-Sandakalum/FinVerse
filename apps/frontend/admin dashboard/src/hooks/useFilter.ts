import { useState, useCallback, useMemo } from 'react'
import { useDebounce } from './index'

interface FilterConfig {
    [key: string]: any
}

interface UseFilterReturn<T> {
    filteredData: T[]
    searchQuery: string
    filters: FilterConfig
    setSearchQuery: (query: string) => void
    setFilter: (key: string, value: any) => void
    clearFilters: () => void
    clearFilter: (key: string) => void
}

interface UseFilterOptions<T> {
    searchFields?: (keyof T)[]
    debounceMs?: number
}

export const useFilter = <T extends Record<string, any>>(
    data: T[],
    options: UseFilterOptions<T> = {}
): UseFilterReturn<T> => {
    const { searchFields = [], debounceMs = 300 } = options

    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState<FilterConfig>({})

    const debouncedSearchQuery = useDebounce(searchQuery, debounceMs)

    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Apply search filter
            if (debouncedSearchQuery && searchFields.length > 0) {
                const query = debouncedSearchQuery.toLowerCase()
                const matchesSearch = searchFields.some(field => {
                    const value = item[field]
                    return value?.toString().toLowerCase().includes(query)
                })
                if (!matchesSearch) return false
            }

            // Apply other filters
            for (const [key, filterValue] of Object.entries(filters)) {
                if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
                    const itemValue = item[key]

                    // Handle array filters (multiple selection)
                    if (Array.isArray(filterValue)) {
                        if (filterValue.length > 0 && !filterValue.includes(itemValue)) {
                            return false
                        }
                    }
                    // Handle string/number filters
                    else if (itemValue !== filterValue) {
                        return false
                    }
                }
            }

            return true
        })
    }, [data, debouncedSearchQuery, searchFields, filters])

    const setFilter = useCallback((key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }, [])

    const clearFilter = useCallback((key: string) => {
        setFilters(prev => {
            const newFilters = { ...prev }
            delete newFilters[key]
            return newFilters
        })
    }, [])

    const clearFilters = useCallback(() => {
        setFilters({})
        setSearchQuery('')
    }, [])

    return {
        filteredData,
        searchQuery,
        filters,
        setSearchQuery,
        setFilter,
        clearFilters,
        clearFilter
    }
}