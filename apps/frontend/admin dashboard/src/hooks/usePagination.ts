import { useState, useCallback } from 'react'

interface PaginationOptions {
    initialPage?: number
    initialPageSize?: number
}

interface UsePaginationReturn {
    currentPage: number
    pageSize: number
    totalPages: number
    startIndex: number
    endIndex: number
    setPage: (page: number) => void
    setPageSize: (size: number) => void
    nextPage: () => void
    prevPage: () => void
    canGoNext: boolean
    canGoPrev: boolean
    getPageData: <T>(data: T[]) => T[]
}

export const usePagination = (
    totalItems: number,
    options: PaginationOptions = {}
): UsePaginationReturn => {
    const { initialPage = 1, initialPageSize = 10 } = options

    const [currentPage, setCurrentPage] = useState(initialPage)
    const [pageSize, setPageSize] = useState(initialPageSize)

    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)

    const setPage = useCallback((page: number) => {
        const validPage = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(validPage)
    }, [totalPages])

    const nextPage = useCallback(() => {
        setPage(currentPage + 1)
    }, [currentPage, setPage])

    const prevPage = useCallback(() => {
        setPage(currentPage - 1)
    }, [currentPage, setPage])

    const canGoNext = currentPage < totalPages
    const canGoPrev = currentPage > 1

    const getPageData = useCallback(<T>(data: T[]): T[] => {
        return data.slice(startIndex, endIndex)
    }, [startIndex, endIndex])

    return {
        currentPage,
        pageSize,
        totalPages,
        startIndex,
        endIndex,
        setPage,
        setPageSize,
        nextPage,
        prevPage,
        canGoNext,
        canGoPrev,
        getPageData
    }
}