import React, { useState, useRef, useEffect } from 'react';
import { cn } from './cn';

interface DropdownProps {
    trigger: React.ReactNode;
    items: { label: string; onClick?: () => void; danger?: boolean }[];
}

export const DropdownMenu: React.FC<DropdownProps> = ({ trigger, items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1">
                        {items.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    item.onClick?.();
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "block w-full px-4 py-2 text-left text-sm hover:bg-slate-100",
                                    item.danger ? "text-red-600 hover:bg-red-50" : "text-slate-700"
                                )}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
