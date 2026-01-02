import React from 'react';
import { cn } from './cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    showCharCount?: boolean;
    containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        className,
        label,
        error,
        helperText,
        showCharCount,
        maxLength,
        containerClassName,
        id,
        value,
        ...props
    }, ref) => {
        const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;
        const charCount = typeof value === 'string' ? value.length : 0;

        return (
            <div className={cn("w-full space-y-1.5", containerClassName)}>
                {label && (
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor={inputId}
                            className="text-sm font-semibold leading-none text-slate-700"
                        >
                            {label}
                        </label>
                        {showCharCount && maxLength && (
                            <span className="text-xs text-slate-500">
                                {charCount}/{maxLength}
                            </span>
                        )}
                    </div>
                )}
                <textarea
                    id={inputId}
                    maxLength={maxLength}
                    value={value}
                    className={cn(
                        "flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm",
                        "placeholder:text-slate-400",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
                        "resize-none transition-colors",
                        hasError && "border-red-500 focus:ring-red-500",
                        !hasError && "border-slate-300",
                        className
                    )}
                    ref={ref}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="text-xs font-medium text-red-600">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p id={`${inputId}-description`} className="text-xs text-slate-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";
