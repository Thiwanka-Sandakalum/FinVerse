import { useState, useCallback, useMemo } from 'react'

interface SortConfig {
    key: string
    direction: 'asc' | 'desc'
}

interface UseSortableReturn<T> {
    sortedData: T[]
    sortConfig: SortConfig | null
    requestSort: (key: string) => void
    getSortIcon: (key: string) => '↑' | '↓' | ''
}

export const useSortable = <T extends Record<string, any>>(
    data: T[],
    initialSortConfig?: SortConfig
): UseSortableReturn<T> => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(
        initialSortConfig || null
    )

    const sortedData = useMemo(() => {
        if (!sortConfig) return data

        const sortableData = [...data]

        sortableData.sort((a, b) => {
            const aValue = a[sortConfig.key]
            const bValue = b[sortConfig.key]

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0
            if (aValue == null) return 1
            if (bValue == null) return -1

            // Handle different data types
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
                return sortConfig.direction === 'asc' ? comparison : -comparison
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                const comparison = aValue - bValue
                return sortConfig.direction === 'asc' ? comparison : -comparison
            }

            // Handle dates
            if (aValue instanceof Date && bValue instanceof Date) {
                const comparison = aValue.getTime() - bValue.getTime()
                return sortConfig.direction === 'asc' ? comparison : -comparison
            }

            // Fallback to string comparison
            const comparison = String(aValue).localeCompare(String(bValue))
            return sortConfig.direction === 'asc' ? comparison : -comparison
        })

        return sortableData
    }, [data, sortConfig])

    const requestSort = useCallback((key: string) => {
        let direction: 'asc' | 'desc' = 'asc'

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }

        setSortConfig({ key, direction })
    }, [sortConfig])

    const getSortIcon = useCallback((key: string) => {
        if (!sortConfig || sortConfig.key !== key) return ''
        return sortConfig.direction === 'asc' ? '↑' : '↓'
    }, [sortConfig])

    return {
        sortedData,
        sortConfig,
        requestSort,
        getSortIcon
    }
}