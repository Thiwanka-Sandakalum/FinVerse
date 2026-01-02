import React from 'react';
import { cn } from './cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
        const variants = {
            default: "bg-slate-100 text-slate-900 hover:bg-slate-200/80",
            primary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200/80",
            secondary: "bg-purple-100 text-purple-700 hover:bg-purple-200/80",
            success: "bg-green-100 text-green-700 hover:bg-green-200/80",
            warning: "bg-amber-100 text-amber-700 hover:bg-amber-200/80",
            error: "bg-red-100 text-red-700 hover:bg-red-200/80",
            info: "bg-blue-100 text-blue-700 hover:bg-blue-200/80",
            outline: "text-slate-700 border-2 border-slate-300 bg-transparent hover:bg-slate-50",
        };

        const sizes = {
            sm: "px-2 py-0.5 text-xs",
            md: "px-2.5 py-0.5 text-xs",
            lg: "px-3 py-1 text-sm",
        };

        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-1.5 rounded-full font-semibold",
                    "transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {dot && (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
                {children}
            </span>
        );
    }
);
Badge.displayName = "Badge";
