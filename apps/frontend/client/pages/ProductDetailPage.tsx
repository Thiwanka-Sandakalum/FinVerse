
import React, { useState, useEffect } from 'react';
import { useSavedProducts } from '../context/SavedProductsContext';
import Toast from '../components/Toast';
import ShareModal from '../components/ShareModal';

// Skeleton loader for product detail page
const ProductDetailSkeleton = () => (
   <div className="animate-fade-in bg-gray-50 min-h-screen pb-20">
      {/* Header Skeleton */}
      <div className="relative bg-gray-200 text-white overflow-hidden">
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="h-4 w-64 bg-gray-300 rounded mb-8 animate-pulse"></div>

            {/* Header Content */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
               <div className="flex items-center gap-6 w-full">
                  <div className="w-24 h-24 bg-gray-300 rounded-2xl animate-pulse"></div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
                     </div>
                     <div className="h-8 w-3/4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                     <div className="h-5 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-xl animate-pulse"></div>
                  <div className="w-10 h-10 bg-gray-300 rounded-xl animate-pulse"></div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8 relative z-20">
         {/* Left Column */}
         <div className="lg:col-span-2 space-y-8">
            {/* Key Stats Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
               <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="p-4 bg-gray-50 rounded-xl">
                        <div className="h-3 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
               <div className="h-6 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
               <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                     <div key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 animate-pulse"></div>
                        <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Tabs Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="flex border-b border-gray-100">
                  {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="flex-1 py-4 px-6 h-6 bg-gray-100 animate-pulse"></div>
                  ))}
               </div>
               <div className="p-8 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                     <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column */}
         <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
               <div className="mb-6">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
               </div>
               <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
               </div>
               <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="space-y-3">
                     <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                     <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                     <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
               </div>
            </div>

            {/* AI Card */}
            <div className="bg-gray-200 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-pulse">
               <div className="h-6 w-40 bg-gray-300 rounded mb-3 animate-pulse"></div>
               <div className="h-12 bg-gray-300 rounded mb-4 animate-pulse"></div>
               <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
         </div>
      </div>
   </div>
);
import { useComparison } from '../context/ComparisonContext';
import { useChat } from '../context/ChatContext';
import { Product } from '../types';
import { ProductsService } from '../services/products';
import type { Product as ApiProduct, ProductCategory } from '../services/products';
import { useNavigate, useParams } from 'react-router-dom';

// Extended Product type with category (API returns this)
type ProductWithCategory = ApiProduct & {
   category?: ProductCategory;
};

// Helper to format detail labels nicely
const formatDetailLabel = (key: string): string => {
   const labelMap: Record<string, string> = {
      interestRate: 'Interest Rate',
      loanAmount: 'Loan Amount',
      minimumBalance: 'Minimum Balance',
      creditLimit: 'Credit Limit',
      annualFee: 'Annual Fee',
      processingFee: 'Processing Fee',
      cashback: 'Cashback',
      leaseValue: 'Lease Value',
      payout: 'Payout',
      tenure: 'Tenure',
      img_url: 'Image',
      backgroundImage: 'Background'
   };
   return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper to format detail values
const formatDetailValue = (value: any, key?: string): string => {
   if (value === null || value === undefined) return 'N/A';

   // Handle eligibility object
   if (key === 'eligibility' && typeof value === 'object') {
      const parts: string[] = [];
      if (value.age) parts.push(`Age: ${value.age}`);
      if (value.minIncome) parts.push(`Min Income: LKR ${value.minIncome.toLocaleString()}`);
      if (value.employment) parts.push(`Employment: ${value.employment}`);
      if (value.businessAge) parts.push(`Business Age: ${value.businessAge}`);
      if (value.annualTurnover) parts.push(`Annual Turnover: ${value.annualTurnover}`);
      if (value.status) parts.push(`Status: ${value.status}`);
      return parts.join(', ') || 'See details';
   }

   // Handle arrays
   if (Array.isArray(value)) {
      return value.join(', ');
   }

   // Handle objects (flatten to string)
   if (typeof value === 'object') {
      return Object.entries(value).map(([k, v]) => `${formatDetailLabel(k)}: ${v}`).join(', ');
   }

   // Format currency values
   if (typeof value === 'number' && (key?.toLowerCase().includes('balance') || key?.toLowerCase().includes('fee') || key?.toLowerCase().includes('amount'))) {
      return `LKR ${value.toLocaleString()}`;
   }

   // Format numbers with commas
   if (typeof value === 'number') {
      return value.toLocaleString();
   }

   return String(value);
};

// Get filterable details (exclude images and features arrays)
const getDisplayableDetails = (details: Record<string, any>) => {
   const excludeKeys = ['img_url', 'backgroundImage', 'features', 'benefits', 'travelPerks', 'assetTypes'];
   return Object.entries(details || {}).filter(([key]) => !excludeKeys.includes(key));
};

// Map API product to local Product interface
const mapApiProductToLocal = (apiProduct: ProductWithCategory, categories: ProductCategory[] = []): Product => {
   const details = apiProduct.details || {};

   // Extract institution name from institutionId
   const getInstitutionName = (institutionId: string) => {
      const institutionMap: Record<string, string> = {
         'org_Q1QYO0bsqiWTfuI9': 'Acme Corp',
         'd7e8-4f9a-9b1c-3d4e5f6a7b8c': 'PaySL',
         'a3b4-4c5d-8e6f-1a2b3c4d5e6f': 'Digital Wallet',
         'e9f0-4a2b-8c3d-5e6f7a8b9c0d': 'Lanka-Credit',
         'f5f5-47e2-b13a-7e0e5a9a8c1e': 'Serendib Bank',
         'd0e1-4c12-9c4c-3e6e73a02a4a': 'LNB',
         'a1b2-4c3d-8e4f-5a6b7c8d9e0f': 'Central Alliance',
         'b3c4-4d5e-9f6a-7b8c9d0e1f2a': 'Island Wide',
         'e7b1-4f2b-8a1a-4f5e8c1a2b3c': 'Oceanic Bank',
         'c5d6-4e7f-8a9b-1c2d3e4f5a6b': 'Heladiva',
         'f1a2-4b3c-9d4e-7f8a9b0c1d2e': 'Colombo Capital'
      };
      return institutionMap[institutionId] || 'Financial Partner';
   };

   // Map category to product type
   const getProductType = (categoryId: string): Product['type'] => {
      if (categoryId?.includes('c1-')) return 'card';
      if (categoryId?.includes('s1-')) return 'savings';
      if (categoryId?.includes('l1-')) return 'loan';
      if (categoryId?.includes('le1-')) return 'investment';
      return 'loan';
   };

   // Extract key features from details
   const extractFeatures = (details: any): string[] => {
      const features: string[] = [];
      if (details.features && Array.isArray(details.features)) {
         features.push(...details.features);
      }
      if (details.tenure) features.push(`Tenure: ${details.tenure}`);
      if (details.loanAmount) features.push(`Amount: ${details.loanAmount}`);
      if (details.creditLimit) features.push(`Credit Limit: ${details.creditLimit}`);
      if (details.minimumBalance) features.push(`Min Balance: LKR ${details.minimumBalance.toLocaleString()}`);
      if (details.cashback) features.push(`Cashback: ${details.cashback}`);
      if (details.annualFee === 0) features.push('No Annual Fee');
      else if (details.annualFee) features.push(`Annual Fee: LKR ${details.annualFee.toLocaleString()}`);
      return features.slice(0, 5);
   };

   return {
      id: apiProduct.id || '',
      institution: getInstitutionName(apiProduct.institutionId),
      name: apiProduct.name,
      type: getProductType(apiProduct.categoryId),
      rate: details.interestRate || '0%',
      term: details.tenure,
      features: extractFeatures(details),
      logoUrl: details.img_url || 'https://placehold.co/600x400',
      badge: apiProduct.isFeatured ? 'Featured' : undefined,
      featured: apiProduct.isFeatured,
      backgroundImage: details.backgroundImage
   };
};

const ProductDetailPage: React.FC = () => {
   const [product, setProduct] = useState<Product | undefined>(undefined);
   const [rawProductData, setRawProductData] = useState<ProductWithCategory | null>(null); // Store raw API data
   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
   const [emiAmount, setEmiAmount] = useState<number | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isLoadingRelated, setIsLoadingRelated] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [activeTab, setActiveTab] = useState<'details' | 'terms' | 'reviews'>('details');
   const [showShareModal, setShowShareModal] = useState(false);
   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
   const { addToCompare, removeFromCompare, isInCompare } = useComparison();
   const { openChat } = useChat();
   const { isSaved, add, remove } = useSavedProducts();
   const navigate = useNavigate();
   const { productId } = useParams<{ productId: string }>();

   const handleProductSelect = (id: string) => {
      navigate(`/product/${id}`);
   };

   const back = () => {
      navigate('/marketplace');
   };

   // Fetch product details from API
   useEffect(() => {
      const fetchProduct = async () => {
         if (!productId) {
            console.log('❌ No product ID provided');
            setIsLoading(false);
            return;
         }

         try {
            setIsLoading(true);
            setError(null);

            console.log('🔍 Fetching product:', productId);
            const response = await ProductsService.getProducts1(productId) as any;
            console.log('📦 Product response:', response);

            // Extract product from response (handle both wrapped and direct responses)
            const apiProduct = (response.data || response) as ProductWithCategory;
            console.log('📊 Extracted product data:', apiProduct);

            setRawProductData(apiProduct);
            const mappedProduct = mapApiProductToLocal(apiProduct, apiProduct.category ? [apiProduct.category] : []);
            console.log('🗺️ Mapped product:', mappedProduct);

            setProduct(mappedProduct);

            // Main product is loaded, set loading to false immediately
            console.log('✅ Main product loaded, setting loading to false');
            setIsLoading(false);

            // Fetch related products independently (doesn't block main UI)
            if (apiProduct.categoryId) {
               fetchRelatedProducts(apiProduct.categoryId, productId).catch(err => {
                  console.error('❌ Failed to fetch related products (non-blocking):', err);
               });
            }

            console.log('✅ Product fetch completed successfully');

         } catch (err) {
            console.error('❌ Failed to fetch product:', err);
            setError('Failed to load product details. Please try again.');
            setProduct(undefined);
            setIsLoading(false);
         }
      };

      const fetchRelatedProducts = async (categoryId: string, excludeId: string) => {
         try {
            setIsLoadingRelated(true);
            console.log('🔗 Fetching related products for category:', categoryId);

            const relatedResponse = await ProductsService.getProducts(
               categoryId, // same category
               undefined, // any institution
               true, // only active
               undefined, // any featured status
               undefined, // no specific IDs
               1, // first page
               8 // limit to 8 related products
            );

            const relatedData = relatedResponse.data || [];
            const related = relatedData
               .filter((p: ProductWithCategory) => p.id !== excludeId)
               .map((p: ProductWithCategory) => mapApiProductToLocal(p, p.category ? [p.category] : []));
            setRelatedProducts(related);
         } catch (err) {
            console.error('❌ Failed to fetch related products:', err);
            setRelatedProducts([]);
         } finally {
            setIsLoadingRelated(false);
         }
      };

      fetchProduct();
   }, [productId]);

   // Debug logging for state changes
   useEffect(() => {
      console.log('🔄 State update - isLoading:', isLoading, 'product:', product ? 'exists' : 'null', 'error:', error);
   }, [isLoading, product, error]);

   if (isLoading) {
      return <ProductDetailSkeleton />;
   }

   if (error || !product) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
               <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">{error ? 'Failed to load product' : 'Product not found'}</h2>
               <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist or has been removed.'}</p>
               <button
                  onClick={back}
                  className="px-6 py-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors"
               >
                  Back to Marketplace
               </button>
            </div>
         </div>
      );
   }

   const isCompared = isInCompare(product.id);

   const calculateEmi = () => {
      // Simple mock calculation for demo
      setEmiAmount(45250);
   };

   const handleAskAI = () => {
      openChat(`I am looking at ${product.name} from ${product.institution} which has a rate of ${product.rate}. Is this a good fit for me given I want to keep EMI under 30% of income? Also show me cheaper options.`);
   };

   return (
      <div className="animate-fade-in bg-gray-50 min-h-screen pb-20">
         {/* Toast Notification */}
         {toast && (
            <Toast
               message={toast.message}
               type={toast.type}
               onClose={() => setToast(null)}
            />
         )}

         {/* Breadcrumbs & Header with Background Image */}
         <div className="relative bg-brand-900 text-white overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
               {product.backgroundImage && (
                  <img
                     src={product.backgroundImage}
                     alt=""
                     className="w-full h-full object-cover opacity-20 transform scale-105"
                  />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/60 to-brand-800/80"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               <nav className="flex text-sm text-brand-200 mb-8 font-medium">
                  <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
                  <span className="mx-3 opacity-60">/</span>
                  <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/marketplace')}>Marketplace</span>
                  <span className="mx-3 opacity-60">/</span>
                  <span className="capitalize">{product.type}s</span>
                  <span className="mx-3 opacity-60">/</span>
                  <span className="text-white truncate">{product.name}</span>
               </nav>

               <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                  <div className="flex items-center gap-6">
                     <div className="w-24 h-24 bg-white rounded-2xl shadow-xl p-3 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <img src={product.logoUrl} alt={product.institution} className="max-w-full max-h-full object-contain" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${product.type === 'loan' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' :
                              product.type === 'card' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' :
                                 'bg-green-500/20 text-green-200 border border-green-500/30'
                              }`}>
                              {product.type}
                           </span>
                           {product.badge && (
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-500/20 text-accent-200 border border-accent-500/30">
                                 {product.badge}
                              </span>
                           )}
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2 leading-tight shadow-sm">{product.name}</h1>
                        <p className="text-brand-100 flex items-center text-lg">
                           {product.institution}
                           <span className="mx-3 opacity-50">•</span>
                           <span className="flex items-center text-yellow-400">
                              ★★★★☆ <span className="text-brand-200 text-sm ml-2">(4.8 from 1,200+ reviews)</span>
                           </span>
                        </p>
                     </div>
                  </div>

                  <div className="relative z-20 flex gap-3 w-full md:w-auto">
                     <button
                        onClick={() => {
                           if (product?.id) {
                              if (isSaved(product.id)) {
                                 remove(product.id);
                              } else {
                                 add(product.id);
                              }
                           }
                        }}
                        className={`p-3 rounded-xl backdrop-blur-sm transition-colors ${isSaved(product?.id || '') ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}
                        title={isSaved(product?.id || '') ? 'Remove from saved' : 'Save product'}
                     >
                        <svg
                           className="w-6 h-6"
                           fill={isSaved(product?.id || '') ? 'currentColor' : 'none'}
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                     </button>
                     <button
                        onClick={() => navigate(`/chat?productId=${product?.id}`)}
                        className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white backdrop-blur-sm transition-colors"
                        title="Chat with AI about this product"
                     >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                     </button>
                     <button
                        onClick={() => setShowShareModal(true)}
                        className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white backdrop-blur-sm transition-colors"
                        title="Share product"
                     >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Content Grid */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-8 relative z-20">

            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">

               {/* Key Stats Card - Dynamic */}
               <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-6">Product Highlights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     {rawProductData?.details && getDisplayableDetails(rawProductData.details).slice(0, 6).map(([key, value], index) => (
                        <div key={key} className={`p-4 rounded-xl ${index === 0 ? 'bg-brand-50' : 'bg-gray-50'}`}>
                           <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{formatDetailLabel(key)}</p>
                           <p className={`text-lg font-bold ${index === 0 ? 'text-brand-600' : 'text-gray-900'} break-words`}>
                              {formatDetailValue(value, key)}
                           </p>
                        </div>
                     ))}

                     {rawProductData?.category?.name && (
                        <div className="p-4 bg-gray-50 rounded-xl">
                           <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Category</p>
                           <p className="text-lg font-bold text-gray-900">{rawProductData.category.name}</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* Features List */}
               <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-6">Key Features & Benefits</h3>
                  <ul className="space-y-4">
                     {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                           <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4">
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                           </div>
                           <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                     ))}

                     {/* Add some standard features */}
                     <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4">
                           <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">Trusted financial partner with proven track record</span>
                     </li>
                     <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4">
                           <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">24/7 Customer support and digital banking access</span>
                     </li>
                  </ul>
               </div>

               {/* Tabs */}
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex border-b border-gray-100">
                     <button
                        className={`flex-1 py-4 px-6 text-center font-medium text-sm ${activeTab === 'details' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveTab('details')}
                     >
                        Details
                     </button>
                     <button
                        className={`flex-1 py-4 px-6 text-center font-medium text-sm ${activeTab === 'terms' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveTab('terms')}
                     >
                        Terms & Conditions
                     </button>
                     <button
                        className={`flex-1 py-4 px-6 text-center font-medium text-sm ${activeTab === 'reviews' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-600 hover:text-gray-800'}`}
                        onClick={() => setActiveTab('reviews')}
                     >
                        Reviews
                     </button>
                  </div>

                  <div className="p-8">
                     {activeTab === 'details' && (
                        <div className="prose prose-sm max-w-none text-gray-600">
                           <p>Experience financial freedom with the {product.name} from {product.institution}.
                              {rawProductData?.details?.interestRate && ` With an attractive interest rate of ${rawProductData.details.interestRate}, `}
                              this product is designed to meet your financial goals efficiently.</p>

                           <div className="mt-6 space-y-3">
                              {rawProductData?.details && getDisplayableDetails(rawProductData.details).map(([key, value]) => (
                                 <p key={key}>• <strong>{formatDetailLabel(key)}:</strong> {formatDetailValue(value, key)}</p>
                              ))}
                           </div>

                           {rawProductData?.category?.description && (
                              <p className="mt-4 italic">{rawProductData.category.description}</p>
                           )}

                           <p className="mt-4">This {rawProductData?.category?.name || 'financial product'} from {product.institution} offers excellent value and is backed by their commitment to customer satisfaction.</p>
                        </div>
                     )}

                     {activeTab === 'terms' && (
                        <div className="text-gray-600 text-sm space-y-4">
                           {rawProductData?.details?.eligibility && (
                              <div>
                                 <p><strong>Eligibility Requirements:</strong></p>
                                 <ul className="ml-4 mt-2 space-y-1">
                                    {Object.entries(rawProductData.details.eligibility).map(([key, value]) => (
                                       <li key={key}>• {formatDetailLabel(key)}: {formatDetailValue(value)}</li>
                                    ))}
                                 </ul>
                              </div>
                           )}

                           {rawProductData?.details && (
                              <div className="space-y-2">
                                 {getDisplayableDetails(rawProductData.details).map(([key, value]) => (
                                    key !== 'eligibility' && (
                                       <p key={key}><strong>{formatDetailLabel(key)}:</strong> {formatDetailValue(value, key)}
                                          {key === 'interestRate' && ' (rates are subject to change based on market conditions)'}
                                       </p>
                                    )
                                 ))}
                              </div>
                           )}

                           <div>
                              <p><strong>General Terms:</strong></p>
                              <ul className="ml-4 mt-2 space-y-1">
                                 <li>• All rates and terms are subject to approval and may vary based on individual circumstances</li>
                                 <li>• Early withdrawal penalties may apply for fixed deposits</li>
                                 <li>• Please check with {product.institution} for the complete terms and conditions</li>
                                 <li>• Product availability subject to regulatory approval</li>
                              </ul>
                           </div>
                        </div>
                     )}

                     {activeTab === 'reviews' && (
                        <div className="space-y-6">
                           <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              <div>
                                 <p className="font-bold text-gray-900">Michael D.</p>
                                 <div className="text-yellow-400 text-xs mb-1">★★★★★</div>
                                 <p className="text-gray-600 text-sm">Great rates and the application process was seamless. Highly recommend!</p>
                              </div>
                           </div>
                           <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              <div>
                                 <p className="font-bold text-gray-900">Sarah J.</p>
                                 <div className="text-yellow-400 text-xs mb-1">★★★★☆</div>
                                 <p className="text-gray-600 text-sm">Customer service is good, but the app could be better.</p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-6">
               {/* Action Card */}
               <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-24">
                  <div className="mb-6">
                     <span className="text-sm text-gray-500 block mb-1">Monthly Payment Estimate</span>
                     <div className="text-3xl font-bold text-brand-900">
                        {emiAmount ? `LKR ${emiAmount.toLocaleString()}` : 'Calculate below'}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <button className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center">
                        Apply Now <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                     </button>
                     <button
                        onClick={() => isCompared ? removeFromCompare(product.id) : addToCompare(product)}
                        className={`w-full py-3.5 border-2 font-bold rounded-xl transition-colors ${isCompared ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-700 hover:border-brand-600 hover:text-brand-600'}`}
                     >
                        {isCompared ? 'Remove from Compare' : 'Add to Compare'}
                     </button>
                  </div>

                  {/* Mini Calculator */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                     <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Quick Calculator
                     </h4>
                     <div className="space-y-3">
                        <input type="number" placeholder="Amount (LKR)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                        <input type="number" placeholder="Duration (Months)" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900" />
                        <button onClick={calculateEmi} className="w-full py-2 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-700">Calculate</button>
                     </div>
                  </div>
               </div>

               {/* AI Prompt */}
               <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500 rounded-full blur-2xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                     <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                        <span className="text-xs">AI</span>
                     </div>
                     <span className="font-bold text-sm">FinVerse Assistant</span>
                  </div>
                  <p className="text-sm text-brand-100 mb-4 relative z-10">
                     "The {product.name} offers {rawProductData?.details?.interestRate || product.rate} returns
                     {rawProductData?.details?.minimumBalance && ` with a minimum balance of LKR ${rawProductData.details.minimumBalance.toLocaleString()}`}
                     {rawProductData?.details?.eligibility?.age && ` for individuals ${rawProductData.details.eligibility.age}`}.
                     Want personalized advice?"
                  </p>
                  <button
                     onClick={handleAskAI}
                     className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-colors relative z-10"
                  >
                     Ask AI about this product
                  </button>
               </div>
            </div>
         </div>

         {/* Related Products */}
         <div className="bg-white py-16 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Similar Products</h2>

               {isLoadingRelated ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-5 animate-pulse">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              <div>
                                 <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                 <div className="h-3 bg-gray-200 rounded w-16"></div>
                              </div>
                           </div>
                           <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
                           <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                     ))}
                  </div>
               ) : relatedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {relatedProducts.map(rp => (
                        <div key={rp.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group cursor-pointer">
                           <div className="flex items-center gap-3 mb-4">
                              <img src={rp.logoUrl} alt={rp.institution} className="w-8 h-8 rounded-full object-contain" />
                              <div>
                                 <p className="font-bold text-sm text-gray-900 line-clamp-1">{rp.name}</p>
                                 <p className="text-xs text-gray-500">{rp.institution}</p>
                              </div>
                           </div>
                           <p className="text-xl font-bold text-brand-600 mb-4">{rp.rate}</p>
                           <button
                              onClick={() => handleProductSelect(rp.id)}
                              className="w-full py-2 border border-brand-200 text-brand-700 font-bold text-xs rounded-lg hover:bg-brand-50 transition-colors"
                           >
                              View Details
                           </button>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-8">
                     <p className="text-gray-500">No similar products found.</p>
                  </div>
               )}
            </div>
         </div>

         {/* Share Modal */}
         {showShareModal && (
            <ShareModal
               products={[product]}
               onClose={() => setShowShareModal(false)}
            />
         )}
      </div>
   );
};

export default ProductDetailPage;
