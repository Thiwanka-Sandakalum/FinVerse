import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SavedProductsContextType {
    saved: string[];
    add: (id: string) => void;
    remove: (id: string) => void;
    isSaved: (id: string) => boolean;
    set: (ids: string[]) => void;
}

const SavedProductsContext = createContext<SavedProductsContextType | undefined>(undefined);

export const SavedProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [saved, setSaved] = useState<string[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('savedProducts') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const handler = () => {
            try {
                setSaved(JSON.parse(localStorage.getItem('savedProducts') || '[]'));
            } catch {
                setSaved([]);
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const add = (id: string) => {
        if (!saved.includes(id)) {
            const updated = [...saved, id];
            setSaved(updated);
            localStorage.setItem('savedProducts', JSON.stringify(updated));
        }
    };

    const remove = (id: string) => {
        if (saved.includes(id)) {
            const updated = saved.filter(pid => pid !== id);
            setSaved(updated);
            localStorage.setItem('savedProducts', JSON.stringify(updated));
        }
    };

    const isSaved = (id: string) => saved.includes(id);

    const set = (ids: string[]) => {
        setSaved(ids);
        localStorage.setItem('savedProducts', JSON.stringify(ids));
    };

    return (
        <SavedProductsContext.Provider value={{ saved, add, remove, isSaved, set }}>
            {children}
        </SavedProductsContext.Provider>
    );
};

export function useSavedProducts() {
    const ctx = useContext(SavedProductsContext);
    if (!ctx) throw new Error('useSavedProducts must be used within a SavedProductsProvider');
    return ctx;
}
