import { useSavedProducts } from '../context/SavedProductsContext';
import React, { useState, useEffect } from 'react';
// Skeleton loader for product cards
const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 w-16 bg-gray-200 rounded" />
      <div className="h-8 w-8 bg-gray-200 rounded-full" />
    </div>
    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-100 rounded mb-4" />
    <div className="h-8 w-1/3 bg-gray-200 rounded mb-4" />
    <div className="space-y-2 mb-6">
      <div className="h-4 w-5/6 bg-gray-100 rounded" />
      <div className="h-4 w-2/3 bg-gray-100 rounded" />
      <div className="h-4 w-1/2 bg-gray-100 rounded" />
    </div>
    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
      <div className="h-8 w-20 bg-gray-100 rounded" />
      <div className="h-8 w-8 bg-gray-100 rounded" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </div>
  </div>
);
import { Product } from '../types';
import { useComparison } from '../context/ComparisonContext';
import { ProductsService } from '../services/products/services/ProductsService';
import { useNavigate } from 'react-router-dom';

interface ProductListProps {
  onProductSelect?: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'loan' | 'card' | 'savings'>('all');
  const { addToCompare, removeFromCompare, isInCompare, selectedProducts } = useComparison();
  const { isSaved, add, remove } = useSavedProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    ProductsService.getProducts(undefined, undefined, true, true, undefined, 1, 8, 'createdAt', 'desc')
      .then((res: any) => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch((err: any) => {
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.type === filter);

  const handleCompareToggle = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleDetailClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Featured Financial Products</h2>
          <p className="text-gray-500">Curated selections with the best rates available today.</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-10 space-x-2">
          {['all', 'loan', 'card', 'savings'].map((f) => (
            <button
              key={f}
              onClick={() => {
                if (f === 'all') {
                  navigate('/marketplace');
                } else {
                  navigate(`/marketplace?type=${f}`);
                }
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all ${filter === f
                ? 'bg-brand-900 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {f === 'all' ? 'All Products' : `${f}s`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const isSelected = isInCompare(product.id);
              const isLimitReached = selectedProducts.length >= 4;
              const isDisabled = !isSelected && isLimitReached;

              // Extract info from API structure
              const details = product.details || {};
              const category = product.category || {};
              // Try to get a logo from details or fallback
              const logoUrl = details.img_url || product.logoUrl || '';
              // Try to get a type from category or fallback
              let type = (category.name || '').toLowerCase();
              if (type.includes('loan')) type = 'loan';
              else if (type.includes('card')) type = 'card';
              else if (type.includes('savings') || type.includes('deposit')) type = 'savings';
              else type = 'other';
              // Try to get a rate from details
              const rate = details.interestRate || details.rate || details.cashback || details.payout || '';
              // Features: from details.features (array) or build from details
              let features: string[] = [];
              if (Array.isArray(details.features)) {
                features = details.features;
              } else {
                // Build features from details keys (excluding img_url, interestRate, rate, cashback, payout)
                features = Object.entries(details)
                  .filter(([k, v]) => !['img_url', 'interestRate', 'rate', 'cashback', 'payout'].includes(k))
                  .map(([k, v]) => {
                    if (typeof v === 'object' && v !== null) {
                      return Object.entries(v).map(([kk, vv]) => `${kk}: ${vv}`).join(', ');
                    }
                    return `${k}: ${v}`;
                  });
              }
              // Institution name: try product.institution or fallback to institutionId
              const institution = product.institution || product.institutionId || '';

              return (
                <div
                  key={product.id}
                  onClick={() => handleDetailClick(product.id)}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group relative cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${type === 'loan' ? 'bg-blue-100 text-blue-700' :
                      type === 'card' ? 'bg-purple-100 text-purple-700' :
                        type === 'savings' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {category.name || type}
                    </span>
                    {logoUrl ? (
                      <img src={logoUrl} alt={institution} className="w-8 h-8 rounded-full grayscale hover:grayscale-0 transition-all" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{institution}</p>

                  <div className="mb-4">
                    <span className="block text-3xl font-bold text-brand-600">{rate}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{details.interestRate ? 'Interest Rate' : details.cashback ? 'Cashback' : details.payout ? 'Payout' : 'Rate'}</span>
                  </div>

                  <div className="flex-1 space-y-2 mb-6">
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {feat}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                    {/* Compare Checkbox Button */}
                    <button
                      onClick={(e) => handleCompareToggle(e, product)}
                      disabled={isDisabled}
                      className={`flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold border transition-all ${isSelected
                        ? 'bg-accent-50 border-accent-200 text-accent-700'
                        : isDisabled
                          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
                        }`}
                      title={isDisabled ? "Comparison limit reached (4 products)" : "Add to compare"}
                    >
                      <div className={`w-3.5 h-3.5 rounded border mr-1.5 flex items-center justify-center ${isSelected ? 'bg-accent-500 border-accent-500' : 'border-gray-400'}`}>
                        {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      Compare
                    </button>

                    {/* Save Heart Button (local) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSaved(product.id)) {
                          remove(product.id);
                        } else {
                          add(product.id);
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors border ${isSaved(product.id)
                        ? 'text-red-500 bg-red-50 border-red-100'
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50 border-transparent hover:border-red-100'
                        }`}
                      title={isSaved(product.id) ? 'Remove from saved' : 'Save product'}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* View Details Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDetailClick(product.id); }}
                      className="flex-1 py-2 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors text-xs flex items-center justify-center shadow-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View More Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/marketplace')}
            className="inline-flex items-center justify-center px-8 py-3 border border-brand-200 text-base font-medium rounded-full text-brand-800 bg-white hover:bg-brand-50 hover:border-brand-300 transition-all shadow-sm group"
          >
            View All Products
            <svg className="ml-2 w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
