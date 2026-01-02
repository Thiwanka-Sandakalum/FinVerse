import React from 'react';
import { cn } from './cn';

interface AvatarProps {
    initials: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', className }) => {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-16 h-16 text-xl",
        xl: "w-24 h-24 text-3xl",
    };

    return (
        <div className={cn(
            "rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 border border-slate-300",
            sizes[size],
            className
        )}>
            {initials}
        </div>
    );
};
