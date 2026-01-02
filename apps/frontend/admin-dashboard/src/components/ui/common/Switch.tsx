import React from 'react';
import { cn } from './cn';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    id?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked, onChange, label, description, disabled = false, size = 'md', className, id }, ref) => {
        const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

        const sizes = {
            sm: {
                track: 'h-5 w-9',
                thumb: 'h-4 w-4',
                translate: 'translate-x-4',
            },
            md: {
                track: 'h-6 w-11',
                thumb: 'h-5 w-5',
                translate: 'translate-x-5',
            },
            lg: {
                track: 'h-7 w-14',
                thumb: 'h-6 w-6',
                translate: 'translate-x-7',
            },
        };

        const sizeConfig = sizes[size];

        const handleToggle = () => {
            if (!disabled) {
                onChange(!checked);
            }
        };

        return (
            <div className={cn("flex items-start gap-3", className)}>
                <button
                    ref={ref}
                    id={switchId}
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-labelledby={label ? `${switchId}-label` : undefined}
                    disabled={disabled}
                    onClick={handleToggle}
                    className={cn(
                        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent",
                        "transition-colors duration-200 ease-in-out",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        sizeConfig.track,
                        checked ? "bg-indigo-600" : "bg-slate-300"
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={cn(
                            "pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0",
                            "transform transition-transform duration-200 ease-in-out",
                            sizeConfig.thumb,
                            checked ? sizeConfig.translate : "translate-x-0"
                        )}
                    />
                </button>
                {(label || description) && (
                    <div className="flex-1">
                        {label && (
                            <label
                                id={`${switchId}-label`}
                                htmlFor={switchId}
                                className={cn(
                                    "text-sm font-medium text-slate-900 cursor-pointer",
                                    disabled && "cursor-not-allowed opacity-50"
                                )}
                                onClick={handleToggle}
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p className="text-xs text-slate-600 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);
Switch.displayName = "Switch";
