import React, { createContext, useContext, useState, useCallback } from 'react';

// Types
type Product = {
    id: string;
    [key: string]: any;
};

type ComparisonContextType = {
    comparisonProducts: Product[];
    addToComparison: (product: Product) => void;
    removeFromComparison: (productId: string) => void;
    isInComparison: (productId: string) => boolean;
    clearComparison: () => void;
};

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

    const addToComparison = useCallback((product: Product) => {
        setComparisonProducts((prev) => {
            if (prev.find((p) => p.id === product.id)) return prev;
            return [...prev, product];
        });
    }, []);

    const removeFromComparison = useCallback((productId: string) => {
        setComparisonProducts((prev) => prev.filter((p) => p.id !== productId));
    }, []);

    const isInComparison = useCallback((productId: string) => {
        return comparisonProducts.some((p) => p.id === productId);
    }, [comparisonProducts]);

    const clearComparison = useCallback(() => {
        setComparisonProducts([]);
    }, []);

    return (
        <ComparisonContext.Provider
            value={{ comparisonProducts, addToComparison, removeFromComparison, isInComparison, clearComparison }}
        >
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = (): ComparisonContextType => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};
