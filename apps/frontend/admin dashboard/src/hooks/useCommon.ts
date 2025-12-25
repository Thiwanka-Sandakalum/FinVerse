import { useState, useCallback } from 'react'

interface UseDisclosureReturn {
    opened: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

export const useDisclosure = (initialState = false): UseDisclosureReturn => {
    const [opened, setOpened] = useState(initialState)

    const open = useCallback(() => setOpened(true), [])
    const close = useCallback(() => setOpened(false), [])
    const toggle = useCallback(() => setOpened(prev => !prev), [])

    return { opened, open, close, toggle }
}

interface UseToggleReturn {
    value: boolean
    toggle: () => void
    setTrue: () => void
    setFalse: () => void
    setValue: (value: boolean) => void
}

export const useToggle = (initialValue = false): UseToggleReturn => {
    const [value, setValue] = useState(initialValue)

    const toggle = useCallback(() => setValue(prev => !prev), [])
    const setTrue = useCallback(() => setValue(true), [])
    const setFalse = useCallback(() => setValue(false), [])

    return {
        value,
        toggle,
        setTrue,
        setFalse,
        setValue
    }
}

interface UseCounterReturn {
    count: number
    increment: () => void
    decrement: () => void
    reset: () => void
    set: (value: number) => void
}

export const useCounter = (initialValue = 0): UseCounterReturn => {
    const [count, setCount] = useState(initialValue)

    const increment = useCallback(() => setCount(prev => prev + 1), [])
    const decrement = useCallback(() => setCount(prev => prev - 1), [])
    const reset = useCallback(() => setCount(initialValue), [initialValue])
    const set = useCallback((value: number) => setCount(value), [])

    return {
        count,
        increment,
        decrement,
        reset,
        set
    }
}