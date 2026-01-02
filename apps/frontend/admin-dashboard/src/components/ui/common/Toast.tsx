import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from './cn';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, variant: ToastVariant = 'info', duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast: Toast = { id, message, variant, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    const variants = {
        success: {
            bg: 'bg-green-50 border-green-200',
            icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
            text: 'text-green-900',
            closeBtn: 'text-green-600 hover:bg-green-100',
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            icon: <XCircle className="h-5 w-5 text-red-600" />,
            text: 'text-red-900',
            closeBtn: 'text-red-600 hover:bg-red-100',
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200',
            icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
            text: 'text-amber-900',
            closeBtn: 'text-amber-600 hover:bg-amber-100',
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            icon: <Info className="h-5 w-5 text-blue-600" />,
            text: 'text-blue-900',
            closeBtn: 'text-blue-600 hover:bg-blue-100',
        },
    };

    const config = variants[toast.variant];

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 200);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLeaving(true), (toast.duration || 5000) - 200);
        return () => clearTimeout(timer);
    }, [toast.duration]);

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
                'transition-all duration-200',
                config.bg,
                isLeaving ? 'animate-out fade-out slide-out-to-right' : 'animate-in fade-in slide-in-from-right'
            )}
        >
            <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
            <p className={cn('flex-1 text-sm font-medium', config.text)}>{toast.message}</p>
            <button
                onClick={handleClose}
                className={cn(
                    'flex-shrink-0 rounded-md p-1 transition-colors',
                    config.closeBtn
                )}
                aria-label="Close notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
