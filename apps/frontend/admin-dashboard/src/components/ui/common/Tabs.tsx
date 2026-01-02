import React from 'react';
import { cn } from './cn';

export const Tabs: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("w-full", className)}>{children}</div>
);

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500", className)}>
        {children}
    </div>
);

export const TabsTrigger: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void; className?: string }> = ({
    children, active, onClick, className
}) => (
    <button
        onClick={onClick}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
            active ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-200/50 hover:text-slate-900",
            className
        )}
    >
        {children}
    </button>
);

export const TabsContent: React.FC<{ children: React.ReactNode; value: string; activeValue: string; className?: string }> = ({
    children, value, activeValue, className
}) => {
    if (value !== activeValue) return null;
    return (
        <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    );
};
