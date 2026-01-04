import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
    {
        children,
        className,
        variant = 'primary',
        size = 'md',
        loading = false,
        fullWidth = false,
        leftIcon,
        rightIcon,
        disabled,
        ...props
    },
    ref
) => {
    const baseStyles = cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-all duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]"
    );

    const variants = {
        primary: cn(
            "bg-indigo-600 text-white shadow-sm",
            "hover:bg-indigo-700 hover:shadow-md",
            "focus-visible:ring-indigo-500"
        ),
        secondary: cn(
            "bg-slate-100 text-slate-900",
            "hover:bg-slate-200",
            "focus-visible:ring-slate-500"
        ),
        outline: cn(
            "border-2 border-slate-300 bg-transparent text-slate-700",
            "hover:bg-slate-50 hover:border-slate-400",
            "focus-visible:ring-slate-500"
        ),
        ghost: cn(
            "text-slate-700",
            "hover:bg-slate-100",
            "focus-visible:ring-slate-500"
        ),
        danger: cn(
            "bg-red-600 text-white shadow-sm",
            "hover:bg-red-700 hover:shadow-md",
            "focus-visible:ring-red-500"
        ),
        success: cn(
            "bg-green-600 text-white shadow-sm",
            "hover:bg-green-700 hover:shadow-md",
            "focus-visible:ring-green-500"
        ),
        warning: cn(
            "bg-amber-500 text-white shadow-sm",
            "hover:bg-amber-600 hover:shadow-md",
            "focus-visible:ring-amber-500"
        ),
        link: cn(
            "text-indigo-600 underline-offset-4",
            "hover:underline",
            "focus-visible:ring-indigo-500"
        ),
    };

    const sizes = {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
    };

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {!loading && leftIcon && leftIcon}
            {children}
            {!loading && rightIcon && rightIcon}
        </button>
    );
});

Button.displayName = 'Button';
