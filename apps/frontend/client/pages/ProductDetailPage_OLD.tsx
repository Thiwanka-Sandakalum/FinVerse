
import React, { useState, useEffect } from 'react';
import { getProductById, getRelatedProducts } from '../data/products';
import { useComparison } from '../context/ComparisonContext';
import { useChat } from '../context/ChatContext';
import { Product } from '../types';

interface ProductDetailPageProps {
   productId: string | null;
   onBack: () => void;
   onProductSelect: (id: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onBack, onProductSelect }) => {
   const [product, setProduct] = useState<Product | undefined>(undefined);
   const [activeTab, setActiveTab] = useState<'details' | 'terms' | 'reviews'>('details');
   const [emiAmount, setEmiAmount] = useState<number | null>(null);
   const { addToCompare, removeFromCompare, isInCompare } = useComparison();
   const { openChat } = useChat();

   useEffect(() => {
      window.scrollTo(0, 0);
      if (productId) {
         setProduct(getProductById(productId));
      }
   }, [productId]);

   if (!product) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
               <button onClick={onBack} className="text-brand-600 hover:underline">Back to Marketplace</button>
            </div>
         </div>
      );
   }

   const relatedProducts = getRelatedProducts(product);
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
                  <span className="hover:text-white cursor-pointer transition-colors" onClick={onBack}>Home</span>
                  <span className="mx-3 opacity-60">/</span>
                  <span className="hover:text-white cursor-pointer transition-colors" onClick={onBack}>Marketplace</span>
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

                  <div className="flex gap-3 w-full md:w-auto">
                     <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white backdrop-blur-sm transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                     </button>
                     <button className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white backdrop-blur-sm transition-colors">
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

               {/* Key Stats Card */}
               <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-6">Product Highlights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                     <div className="p-4 bg-brand-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Interest Rate</p>
                        <p className="text-2xl font-bold text-brand-600">{product.rate}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Term / Type</p>
                        <p className="text-lg font-bold text-gray-900">{product.term || product.type}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Fees</p>
                        <p className="text-lg font-bold text-gray-900">Low / None</p>
                     </div>
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
                     {['details', 'terms', 'reviews'].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab as any)}
                           className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                           {tab}
                        </button>
                     ))}
                  </div>
                  <div className="p-8">
                     {activeTab === 'details' && (
                        <div className="prose prose-sm max-w-none text-gray-600">
                           <p>Experience financial freedom with the {product.name}. Designed for modern needs, this product offers competitive rates and flexibility that suits your lifestyle. Whether you are looking to save for the future, finance a dream home, or manage daily expenses, {product.institution} provides reliable service and digital-first convenience.</p>
                           <p className="mt-4">Our AI analysis indicates this product is suitable for users with a credit score above 700 looking for low-cost options.</p>
                        </div>
                     )}
                     {activeTab === 'terms' && (
                        <div className="text-gray-600 text-sm space-y-2">
                           <p><strong>Eligibility:</strong> Must be a resident over 18 years of age.</p>
                           <p><strong>Rates:</strong> Rates are subject to change based on market conditions.</p>
                           <p><strong>Fees:</strong> Late payment fees apply. Check the full fee schedule on the institution's website.</p>
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
                     "Based on your profile, this loan keeps your EMI under 30% of your income. Want to see cheaper options?"
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
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map(rp => (
                     <div key={rp.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3 mb-4">
                           <img src={rp.logoUrl} alt={rp.institution} className="w-8 h-8 rounded-full object-contain" />
                           <div>
                              <p className="font-bold text-sm text-gray-900 line-clamp-1">{rp.name}</p>
                              <p className="text-xs text-gray-500">{rp.institution}</p>
                           </div>
                        </div>
                        <p className="text-xl font-bold text-brand-600 mb-4">{rp.rate}</p>
                        <button
                           onClick={() => onProductSelect(rp.id)}
                           className="w-full py-2 border border-brand-200 text-brand-700 font-bold text-xs rounded-lg hover:bg-brand-50 transition-colors"
                        >
                           View Details
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
   );
};

export default ProductDetailPage;
