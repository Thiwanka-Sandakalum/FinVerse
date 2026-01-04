import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 text-white',
        },
        warning: {
            icon: 'bg-yellow-100 text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        },
        info: {
            icon: 'bg-indigo-100 text-indigo-600',
            button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        },
    };

    const styles = variantStyles[variant];

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative z-50 w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="p-6">
                    {/* Icon */}
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${styles.icon}`}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            {cancelText}
                        </Button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
