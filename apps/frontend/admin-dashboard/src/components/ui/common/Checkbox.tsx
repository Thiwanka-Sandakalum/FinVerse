import React, { useEffect, useRef } from 'react';
import { cn } from './cn';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
    indeterminate?: boolean;
    error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, description, indeterminate, error, className, id, ...props }, ref) => {
        const internalRef = useRef<HTMLInputElement>(null);
        const checkboxRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        useEffect(() => {
            if (checkboxRef.current) {
                checkboxRef.current.indeterminate = !!indeterminate;
            }
        }, [indeterminate, checkboxRef]);

        return (
            <div className={cn("flex items-start gap-3", className)}>
                <div className="flex items-center h-5">
                    <input
                        id={checkboxId}
                        ref={checkboxRef}
                        type="checkbox"
                        className={cn(
                            "h-4 w-4 rounded border-slate-300 text-indigo-600",
                            "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "transition-colors cursor-pointer",
                            error && "border-red-500 focus:ring-red-500"
                        )}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${checkboxId}-error` : description ? `${checkboxId}-description` : undefined}
                        {...props}
                    />
                </div>
                {(label || description) && (
                    <div className="flex-1">
                        {label && (
                            <label
                                htmlFor={checkboxId}
                                className="text-sm font-medium text-slate-900 cursor-pointer leading-5"
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p id={`${checkboxId}-description`} className="text-xs text-slate-600 mt-0.5">
                                {description}
                            </p>
                        )}
                        {error && (
                            <p id={`${checkboxId}-error`} className="text-xs font-medium text-red-600 mt-0.5">
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
Checkbox.displayName = "Checkbox";
