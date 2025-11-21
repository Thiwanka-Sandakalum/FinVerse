import { useState, useCallback } from 'react'

interface UseFormOptions<T> {
    initialValues: T
    onSubmit: (values: T) => void | Promise<void>
    validate?: (values: T) => Record<string, string>
}

interface UseFormReturn<T> {
    values: T
    errors: Record<string, string>
    isSubmitting: boolean
    handleChange: (name: keyof T) => (value: any) => void
    handleSubmit: (e?: React.FormEvent) => void
    setFieldValue: (name: keyof T, value: any) => void
    setFieldError: (name: keyof T, error: string) => void
    resetForm: () => void
    isValid: boolean
}

export const useForm = <T extends Record<string, any>>({
    initialValues,
    onSubmit,
    validate
}: UseFormOptions<T>): UseFormReturn<T> => {
    const [values, setValues] = useState<T>(initialValues)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = useCallback((name: keyof T) => (value: any) => {
        setValues(prev => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name as string]) {
            setErrors(prev => ({ ...prev, [name as string]: '' }))
        }
    }, [errors])

    const setFieldValue = useCallback((name: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }))
    }, [])

    const setFieldError = useCallback((name: keyof T, error: string) => {
        setErrors(prev => ({ ...prev, [name as string]: error }))
    }, [])

    const resetForm = useCallback(() => {
        setValues(initialValues)
        setErrors({})
        setIsSubmitting(false)
    }, [initialValues])

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault()
        }

        // Validate if validator is provided
        if (validate) {
            const validationErrors = validate(values)
            setErrors(validationErrors)

            if (Object.keys(validationErrors).length > 0) {
                return
            }
        }

        setIsSubmitting(true)
        try {
            await onSubmit(values)
        } catch (error) {
            console.error('Form submission error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }, [values, validate, onSubmit])

    const isValid = Object.keys(errors).length === 0

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldError,
        resetForm,
        isValid
    }
}