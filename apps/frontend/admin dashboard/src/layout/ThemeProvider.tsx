import { MantineProvider, createTheme, type MantineColorsTuple } from '@mantine/core'
import { useUI } from '../context/UIContext'
import type { ReactNode } from 'react'

const primaryColor: MantineColorsTuple = [
    '#e3f2fd',
    '#bbdefb',
    '#90caf9',
    '#64b5f6',
    '#42a5f5',
    '#2196f3',
    '#1e88e5',
    '#1976d2',
    '#1565c0',
    '#0d47a1'
]

const lightTheme = createTheme({
    colors: {
        primary: primaryColor
    },
    primaryColor: 'primary',
    primaryShade: 6
})

const darkTheme = createTheme({
    colors: {
        primary: primaryColor
    },
    primaryColor: 'primary',
    primaryShade: 4
})

interface ThemeProviderProps {
    children: ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { theme } = useUI()

    return (
        <MantineProvider
            theme={theme === 'light' ? lightTheme : darkTheme}
            forceColorScheme={theme}
        >
            {children}
        </MantineProvider>
    )
}

export default ThemeProvider