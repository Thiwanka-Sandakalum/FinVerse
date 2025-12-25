import { createContext, useContext, useState, type ReactNode } from 'react'

interface UIContextType {
    sidebarCollapsed: boolean
    toggleSidebar: () => void
    theme: 'light' | 'dark'
    toggleTheme: () => void
    searchQuery: string
    setSearchQuery: (query: string) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const useUI = () => {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider')
    }
    return context
}

interface UIProviderProps {
    children: ReactNode
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [searchQuery, setSearchQuery] = useState('')

    const toggleSidebar = () => {
        setSidebarCollapsed(prev => !prev)
    }

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const value = {
        sidebarCollapsed,
        toggleSidebar,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery
    }

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    )
}