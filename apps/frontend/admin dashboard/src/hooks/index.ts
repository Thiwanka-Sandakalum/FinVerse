import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error('Error reading from localStorage:', error)
            return initialValue
        }
    })

    const setValue = (value: T) => {
        try {
            setStoredValue(value)
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Error writing to localStorage:', error)
        }
    }

    return [storedValue, setValue]
}

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

// Re-export all hooks
export * from './useForm'
export * from './usePagination'
export * from './useSortable'
export * from './useFilter'
export * from './useCommon'
export * from './useAuth'
export * from './usePermissions'
export * from './useProducts'
export * from './useProductCategories'
export * from './useUsers'
export * from './useOrganizations'
export * from './useMembers'