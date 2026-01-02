import React from 'react';
import { cn } from './cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        type,
        label,
        error,
        helperText,
        containerClassName,
        leftIcon,
        rightIcon,
        onRightIconClick,
        id,
        ...props
    }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;

        return (
            <div className={cn("w-full space-y-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-semibold leading-none text-slate-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm",
                            "placeholder:text-slate-400",
                            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
                            "transition-colors",
                            hasError && "border-red-500 focus:ring-red-500",
                            !hasError && "border-slate-300",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        ref={ref}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400",
                                onRightIconClick && "cursor-pointer hover:text-slate-600"
                            )}
                            onClick={onRightIconClick}
                        >
                            {rightIcon}
                        </div>
                    )}
                </div>
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
Input.displayName = "Input";
