import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from './cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: { label: string; value: string; disabled?: boolean }[];
    containerClassName?: string;
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, helperText, options, containerClassName, placeholder, id, ...props }, ref) => {
        const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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
                    <select
                        id={inputId}
                        className={cn(
                            "flex h-10 w-full appearance-none rounded-lg border bg-white px-3 py-2 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
                            "transition-colors",
                            error ? "border-red-500 focus:ring-red-500" : "border-slate-300",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
            </div>
        );
    }
);
Select.displayName = "Select";
