import React, { createContext, useContext, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './cn';

// ============ Spinner Component ============
interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    label?: string;
    color?: 'primary' | 'secondary' | 'white' | 'slate';
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    className,
    label,
    color = 'primary'
}) => {
    const sizes = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
    };

    const colors = {
        primary: 'text-indigo-600',
        secondary: 'text-slate-600',
        white: 'text-white',
        slate: 'text-slate-400',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
            <Loader2 className={cn('animate-spin', sizes[size], colors[color])} />
            {label && <p className="text-sm text-slate-600 font-medium">{label}</p>}
        </div>
    );
};

// ============ Loading Overlay Component ============
interface LoadingOverlayProps {
    isLoading: boolean;
    label?: string;
    children: React.ReactNode;
    blur?: boolean;
    opacity?: number;
    spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    label,
    children,
    blur = true,
    opacity = 80,
    spinnerSize = 'lg'
}) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div
                    className={cn(
                        'absolute inset-0 z-50 flex items-center justify-center rounded-lg transition-all',
                        blur && 'backdrop-blur-sm'
                    )}
                    style={{ backgroundColor: `rgba(255, 255, 255, ${opacity / 100})` }}
                >
                    <Spinner size={spinnerSize} label={label} />
                </div>
            )}
        </div>
    );
};

// ============ Skeleton Component ============
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
    count = 1,
    className,
    style,
    ...props
}) => {
    const variants = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-md',
        rounded: 'rounded-lg',
    };

    const animations = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]',
        none: '',
    };

    const skeletons = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={cn(
                'bg-slate-200',
                variants[variant],
                animations[animation],
                className
            )}
            style={{
                width: width,
                height: height,
                ...style,
            }}
            {...props}
        />
    ));

    return count > 1 ? <div className="space-y-2">{skeletons}</div> : skeletons[0];
};

// ============ Loading Dots Component ============
interface LoadingDotsProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'secondary' | 'white';
    className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
    size = 'md',
    color = 'primary',
    className
}) => {
    const sizes = {
        sm: 'w-1.5 h-1.5',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    };

    const colors = {
        primary: 'bg-indigo-600',
        secondary: 'bg-slate-600',
        white: 'bg-white',
    };

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <div className={cn('rounded-full animate-bounce', sizes[size], colors[color])} style={{ animationDelay: '0ms' }} />
            <div className={cn('rounded-full animate-bounce', sizes[size], colors[color])} style={{ animationDelay: '150ms' }} />
            <div className={cn('rounded-full animate-bounce', sizes[size], colors[color])} style={{ animationDelay: '300ms' }} />
        </div>
    );
};

// ============ Progress Bar Component ============
interface ProgressBarProps {
    value?: number; // 0-100
    indeterminate?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'success' | 'warning' | 'error';
    showLabel?: boolean;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value = 0,
    indeterminate = false,
    size = 'md',
    color = 'primary',
    showLabel = false,
    className,
}) => {
    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    const colors = {
        primary: 'bg-indigo-600',
        success: 'bg-green-600',
        warning: 'bg-amber-600',
        error: 'bg-red-600',
    };

    return (
        <div className={cn('w-full', className)}>
            <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', sizes[size])}>
                <div
                    className={cn(
                        'h-full transition-all duration-300 ease-out',
                        colors[color],
                        indeterminate && 'animate-progress-indeterminate'
                    )}
                    style={{ width: indeterminate ? '30%' : `${Math.min(100, Math.max(0, value))}%` }}
                />
            </div>
            {showLabel && !indeterminate && (
                <p className="text-xs text-slate-600 mt-1 text-right">{Math.round(value)}%</p>
            )}
        </div>
    );
};

// ============ Full Page Loader Component ============
interface FullPageLoaderProps {
    message?: string;
    submessage?: string;
    showProgress?: boolean;
    progress?: number;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
    message = 'Loading...',
    submessage,
    showProgress = false,
    progress = 0,
}) => {
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/90 backdrop-blur-md">
            <div className="flex flex-col items-center gap-4 max-w-md w-full px-6">
                <Spinner size="xl" />
                <div className="text-center space-y-2 w-full">
                    <h3 className="text-lg font-semibold text-slate-900">{message}</h3>
                    {submessage && <p className="text-sm text-slate-600">{submessage}</p>}
                    {showProgress && (
                        <ProgressBar value={progress} showLabel className="mt-4" />
                    )}
                </div>
            </div>
        </div>
    );
};

// ============ Global Loading Context ============
interface LoadingContextType {
    isLoading: boolean;
    message: string;
    submessage?: string;
    progress?: number;
    showLoading: (message?: string, submessage?: string) => void;
    hideLoading: () => void;
    setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('Loading...');
    const [submessage, setSubmessage] = useState<string | undefined>(undefined);
    const [progress, setProgressState] = useState<number>(0);

    const showLoading = useCallback((msg = 'Loading...', sub?: string) => {
        setMessage(msg);
        setSubmessage(sub);
        setProgressState(0);
        setIsLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setIsLoading(false);
        setProgressState(0);
        setSubmessage(undefined);
    }, []);

    const setProgress = useCallback((prog: number) => {
        setProgressState(prog);
    }, []);

    return (
        <LoadingContext.Provider value={{
            isLoading,
            message,
            submessage,
            progress,
            showLoading,
            hideLoading,
            setProgress
        }}>
            {children}
            {isLoading && (
                <FullPageLoader
                    message={message}
                    submessage={submessage}
                    showProgress={progress > 0}
                    progress={progress}
                />
            )}
        </LoadingContext.Provider>
    );
};
