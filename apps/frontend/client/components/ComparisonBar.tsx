import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { useNavigate } from 'react-router-dom';

interface ComparisonBarProps {
  onCompare?: () => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ onCompare }) => {
  const { selectedProducts, removeFromCompare, clearComparison } = useComparison();
  const navigate = useNavigate();

  const handleCompare = () => {
    const productIds = selectedProducts.map(p => p.id).join(',');
    navigate(`/compare?ids=${productIds}`);
    if (onCompare) onCompare();
  };

  if (selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-white rounded-t-2xl shadow-[0_-5px_30px_rgba(0,0,0,0.15)] border-t border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center space-x-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
            <div className="flex items-center flex-shrink-0 mr-2">
              <span className="bg-brand-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {selectedProducts.length}
              </span>
            </div>

            {selectedProducts.map((product) => (
              <div key={product.id} className="relative group flex-shrink-0">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-center shadow-sm">
                  <img src={product.logoUrl} alt={product.institution} className="max-w-full max-h-full object-contain" />
                </div>
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  ×
                </button>
              </div>
            ))}

            {selectedProducts.length < 4 && (
              <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center flex-shrink-0">
                Add<br />More
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={clearComparison}
              className="px-4 py-2 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleCompare}
              disabled={selectedProducts.length < 2}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full font-bold text-white transition-all shadow-md ${selectedProducts.length < 2
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-accent-500 hover:bg-accent-600 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              Compare Now {selectedProducts.length > 1 ? `(${selectedProducts.length})` : ''}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
