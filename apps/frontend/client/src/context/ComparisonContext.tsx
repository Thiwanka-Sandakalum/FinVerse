import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../services/types';

interface ComparisonContextType {
  selectedProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    if (selectedProducts.length < 4 && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const clearComparison = () => {
    setSelectedProducts([]);
  };

  return (
    <ComparisonContext.Provider value={{ selectedProducts, addToCompare, removeFromCompare, isInCompare, clearComparison }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
