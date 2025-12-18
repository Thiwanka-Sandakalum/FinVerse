import { forwardRef } from 'react'
import { TextInput, type TextInputProps } from '@mantine/core'

interface FormInputProps extends TextInputProps {
    name: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ name, ...props }, ref) => {
    return (
        <TextInput
            ref={ref}
            name={name}
            {...props}
        />
    )
})

FormInput.displayName = 'FormInput'

export default FormInput