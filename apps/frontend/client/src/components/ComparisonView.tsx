import React, { use, useEffect, useState } from 'react';
import { useComparison } from '../context/ComparisonContext';
import { compareProducts } from '../services/chatService';
import ShareModal from './ShareModal';
import { useNavigate } from 'react-router-dom';

const ComparisonView: React.FC = () => {
  const { selectedProducts } = useComparison();
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigator = useNavigate();
  const onBack = () => {
    navigator('/marketplace');
  };

  useEffect(() => {
    const fetchInsight = async () => {
      if (selectedProducts.length > 1) {
        setLoadingAi(true);
        try {
          const productIds = selectedProducts.map(p => p.id);
          const result = await compareProducts(productIds);
          setAiInsight(result.comparison);
        } catch (error) {
          console.error('Error fetching comparison:', error);
          setAiInsight('Unable to generate comparison. Please try again.');
        } finally {
          setLoadingAi(false);
        }
      }
    };
    fetchInsight();
  }, [selectedProducts]);

  const handleAskAI = () => {
    const productDetails = selectedProducts.map(p => `${p.name} (${p.institution}) - ${p.rate}`).join(', ');
    const message = `I am comparing the following products: ${productDetails}. Based on the insight provided, can you help me analyze them further and recommend the best option for me?`;
    // onContinueChat(message);
  };

  if (selectedProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No products selected</h2>
        <button onClick={onBack} className="px-6 py-2 bg-brand-600 text-white rounded-full">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={onBack} className="text-gray-500 hover:text-brand-600 font-medium flex items-center mb-2">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Marketplace
            </button>
            <h1 className="text-3xl font-serif font-bold text-brand-900">Product Comparison</h1>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-white hover:border-brand-300 hover:text-brand-600 transition-all bg-white/50 text-gray-700 font-medium text-sm shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share Comparison
          </button>
        </div>

        {/* AI Insight Panel */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500 rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                </div>
                <h3 className="text-xl font-bold">AI Comparison Insight</h3>
              </div>
            </div>

            {loadingAi ? (
              <div className="animate-pulse space-y-2">
                <div className="h-2 bg-white/20 rounded w-3/4"></div>
                <div className="h-2 bg-white/20 rounded w-1/2"></div>
                <div className="h-2 bg-white/20 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-brand-100 leading-relaxed text-sm md:text-base prose prose-invert max-w-none">
                  {aiInsight.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAskAI}
                    className="inline-flex items-center px-4 py-2 bg-white text-brand-900 font-bold rounded-lg text-sm hover:bg-brand-50 transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    Ask AI Assistant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-left w-1/5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product Info</th>
                  {selectedProducts.map(product => (
                    <th key={product.id} className="p-6 text-left w-1/5 align-top">
                      <div className="flex flex-col h-full">
                        <img src={product.logoUrl} alt={product.institution} className="h-8 object-contain w-auto mb-3 self-start" />
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                        <span className="text-xs text-gray-500 mb-4">{product.institution}</span>
                        <button className="mt-auto w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm">
                          Apply Now
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Rate Row */}
                <tr>
                  <td className="p-6 font-bold text-gray-700">Interest Rate / APR</td>
                  {selectedProducts.map(product => {
                    // Logic to highlight best rate could go here
                    return (
                      <td key={product.id} className="p-6">
                        <span className="text-2xl font-bold text-brand-600">{product.rate}</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Type Row */}
                <tr>
                  <td className="p-6 font-bold text-gray-700">Product Type</td>
                  {selectedProducts.map(product => (
                    <td key={product.id} className="p-6">
                      <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {product.type}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Features Row */}
                <tr>
                  <td className="p-6 font-bold text-gray-700 align-top">Key Features</td>
                  {selectedProducts.map(product => (
                    <td key={product.id} className="p-6 align-top">
                      <ul className="space-y-2">
                        {(product.features || []).map((feature, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Term Row */}
                <tr>
                  <td className="p-6 font-bold text-gray-700">Term / Duration</td>
                  {selectedProducts.map(product => (
                    <td key={product.id} className="p-6 text-sm text-gray-600">
                      {product.term || 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          products={selectedProducts}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default ComparisonView;
