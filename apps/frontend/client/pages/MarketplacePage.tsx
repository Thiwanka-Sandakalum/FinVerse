import React, { useState, useEffect, useCallback } from 'react';
import { useComparison } from '../context/ComparisonContext';
import { ProductsService } from '../services/products';
import type { Product as ApiProduct, ProductCategory } from '../services/products';

// Import modularized components and utilities
import { getInstitutionName } from './marketplace/utils';
import { HeroSection } from './marketplace/HeroSection';
import { LoadingSkeleton } from './marketplace/LoadingSkeleton';
import { ProductCard } from './marketplace/ProductCard';
import { useNavigate, useLocation } from 'react-router-dom';

// Extended Product type with category (API returns this)
type ProductWithCategory = ApiProduct & {
  category?: ProductCategory;
};

// ==================== MAIN COMPONENT ====================
const MarketplacePage: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<string>('All');
  const [allProducts, setAllProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Get categoryId from query params
  const getCategoryIdFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('categoryId') || undefined;
  };

  // Sync activeTab with categoryId from URL
  useEffect(() => {
    const categoryId = getCategoryIdFromQuery();
    if (categoryId && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      if (selectedCategory) {
        setActiveTab(selectedCategory.name);
      }
    }
    if (!categoryId) {
      setActiveTab('All');
    }
  }, [location.search, categories]);
  const { addToCompare, removeFromCompare, isInCompare, selectedProducts } = useComparison();

  // Available institutions list
  const institutions = [
    { id: 'org_Q1QYO0bsqiWTfuI9', name: 'Acme Corp' },
    { id: 'd7e8-4f9a-9b1c-3d4e5f6a7b8c', name: 'PaySL' },
    { id: 'e9f0-4a2b-8c3d-5e6f7a8b9c0d', name: 'Lanka-Credit' },
    { id: 'f5f5-47e2-b13a-7e0e5a9a8c1e', name: 'Serendib Bank' },
    { id: 'd0e1-4c12-9c4c-3e6e73a02a4a', name: 'LNB' },
    { id: 'a1b2-4c3d-8e4f-5a6b7c8d9e0f', name: 'Central Alliance' },
    { id: 'b3c4-4d5e-9f6a-7b8c9d0e1f2a', name: 'Island Wide' },
    { id: 'e7b1-4f2b-8a1a-4f5e8c1a2b3c', name: 'Oceanic Bank' },
    { id: 'c5d6-4e7f-8a9b-1c2d3e4f5a6b', name: 'Heladiva' },
    { id: 'f1a2-4b3c-9d4e-7f8a9b0c1d2e', name: 'Colombo Capital' }
  ];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse: any = await ProductsService.getProductsCategories();
        const categoriesData = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);


        // Use categoryId from query param if present, else from activeTab
        let categoryId: string | undefined = getCategoryIdFromQuery();
        if (!categoryId && activeTab !== 'All') {
          const selectedCategory = categories.find(cat => cat.name === activeTab);
          categoryId = selectedCategory?.id;
        }

        const productsResponse: any = await ProductsService.getProducts(
          categoryId,
          selectedInstitution || undefined,
          true, // isActive
          undefined, // isFeatured
          undefined, // productIds
          currentPage,
          itemsPerPage,
          sortBy,
          sortOrder,
          searchTerm || undefined
        );

        const { data: productData, meta } = productsResponse;
        setAllProducts(productData || []);

        // Update pagination info from meta
        if (meta) {
          // Use meta.limit and meta.offset for accurate calculation
          const limit = meta.limit || itemsPerPage;
          const total = meta.total || 0;
          const offset = meta.offset || 0;
          setItemsPerPage(limit);
          setTotalItems(total);
          setTotalPages(Math.ceil(total / limit) || 1);
          // Optionally, update currentPage if offset/limit changes
          // setCurrentPage(Math.floor(offset / limit) + 1);
        }

      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if categories are loaded
    if (categories.length > 0 || activeTab === 'All') {
      fetchProducts();
    }
  }, [activeTab, categories, selectedInstitution, currentPage, itemsPerPage, sortBy, sortOrder, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedInstitution, sortBy, sortOrder, searchTerm]);


  // Event handlers
  const handleCompareToggle = useCallback((e: React.MouseEvent, product: ProductWithCategory) => {
    e.stopPropagation();
    if (isInCompare(product.id || '')) {
      removeFromCompare(product.id || '');
    } else {
      // Convert to local Product type for comparison context
      const localProduct = {
        id: product.id || '',
        institution: getInstitutionName(product.institutionId),
        name: product.name,
        type: 'loan' as const,
        rate: String(Object.values(product.details || {})[0] || 'N/A'),
        features: Object.entries(product.details || {}).slice(0, 3).map(([k, v]) => `${k}: ${v}`),
        logoUrl: '',
        featured: product.isFeatured || false
      };
      addToCompare(localProduct);
    }
  }, [isInCompare, removeFromCompare, addToCompare]);

  const handleDetailClick = useCallback((id: string) => {
    navigate(`/product/${id}`);
  }, []);


  return (
    <div className="animate-fade-in bg-gray-50 min-h-screen pb-20">
      <HeroSection filteredProductsCount={allProducts.length} />

      {/* Featured Products Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-900 mb-2">Featured Products</h2>
            <p className="text-gray-600">Handpicked offers with exclusive rates for our members.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x space-x-6 pb-8 no-scrollbar">
          {isLoading ? (
            <LoadingSkeleton count={3} type="featured" />
          ) : error ? (
            <div className="w-full text-center py-8 text-red-600">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-sm text-brand-600 hover:underline">
                Retry
              </button>
            </div>
          ) : (
            allProducts.slice(0, 5).map((product) => {
              const isSelected = isInCompare(product.id);
              const isLimitReached = selectedProducts.length >= 4;
              const isDisabled = !isSelected && isLimitReached;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInCompare={isSelected}
                  isDisabled={isDisabled}
                  onCompareToggle={handleCompareToggle}
                  onDetailClick={handleDetailClick}
                  variant="featured"
                />
              );
            })
          )}
        </div>
      </section>

      {/* All Products Section */}
      <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900">All Products</h2>
          <p className="text-gray-500 text-sm mt-1">{totalItems} products available</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Institution Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="">All Institutions</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt' | 'updatedAt')}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              <option value="createdAt">Latest</option>
              <option value="name">Name</option>
              <option value="updatedAt">Recently Updated</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 no-scrollbar border-b border-gray-200">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-6 py-3 font-medium text-sm transition-all relative whitespace-nowrap ${activeTab === 'All' ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            All
            {activeTab === 'All' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></span>
            )}
          </button>

          {categories.filter(cat => cat.parentId).map(category => {
            const tabName = category.name || '';
            const isActive = activeTab === tabName;
            return (
              <button
                key={category.id}
                onClick={() => {
                  // Update URL with categoryId param
                  navigate(`/marketplace?categoryId=${category.id}`);
                }}
                className={`px-6 py-3 font-medium text-sm transition-all relative whitespace-nowrap ${isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tabName}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <LoadingSkeleton count={8} type="grid" />
          ) : error ? (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Failed to load products</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : allProducts.length > 0 ? (
            allProducts.map(product => {
              const isSelected = isInCompare(product.id);
              const isLimitReached = selectedProducts.length >= 4;
              const isDisabled = !isSelected && isLimitReached;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInCompare={isSelected}
                  isDisabled={isDisabled}
                  onCompareToggle={handleCompareToggle}
                  onDetailClick={handleDetailClick}
                  variant="grid"
                />
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">No products found</h3>
              <p className="text-gray-500">No products available in this category.</p>
            </div>
          )}
        </div>

        {/* Pagination: always show if totalPages > 1 and not loading */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {/* Pagination with ellipsis for large page sets */}
                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === i + 1
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))
                ) : (
                  <>
                    {/* First page */}
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === 1
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      1
                    </button>
                    {/* Left ellipsis */}
                    {currentPage > 4 && <span className="px-2">...</span>}
                    {/* Middle pages */}
                    {Array.from({ length: 3 }, (_, i) => {
                      let pageNum = currentPage;
                      if (currentPage <= 4) {
                        pageNum = i + 2;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 1 + i;
                      }
                      if (pageNum <= 1 || pageNum >= totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === pageNum
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {/* Right ellipsis */}
                    {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                    {/* Last page */}
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === totalPages
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Items per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
              </select>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MarketplacePage;