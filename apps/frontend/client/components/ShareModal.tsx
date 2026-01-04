
import React, { useState } from 'react';
import { Product } from '../types';

interface ShareModalProps {
  onClose: () => void;
  products: Product[];
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, products }) => {
  const [copied, setCopied] = useState(false);

  // Generate shareable URL - either product detail or comparison
  const shareUrl = products.length === 1
    ? `${window.location.origin}/product/${products[0].id}`
    : `${window.location.origin}/compare?ids=${products.map(p => p.id).join(',')}`;

  const shareText = products.length === 1
    ? `Check out ${products[0].name} from ${products[0].institution} on FinVerse!`
    : `Compare ${products.length} products on FinVerse`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share Comparison</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {products.length === 1 ? (
            <>Share <strong className="text-gray-900">{products[0].name}</strong> with your friends, family, or financial advisor to get their opinion.</>
          ) : (
            <>Share this comparison of <strong className="text-gray-900">{products.length} products</strong> with your friends, family, or financial advisor to get their opinion.</>
          )}
        </p>

        <div className="mb-8">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Share Link</label>
          <div className="flex shadow-sm">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-l-lg px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:border-gray-300 transition-colors"
            />
            <button
              onClick={handleCopy}
              className={`px-5 py-2.5 font-bold text-sm rounded-r-lg border border-l-0 border-gray-200 transition-all ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {copied ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Copied
                </span>
              ) : 'Copy'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Share via Social</label>
          <div className="grid grid-cols-4 gap-4">
            <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 rounded-xl transition-all group border border-transparent hover:border-blue-100">
              <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-600">Facebook</span>
            </button>

            <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 rounded-xl transition-all group border border-transparent hover:border-gray-200">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-black">X</span>
            </button>

            <button onClick={() => handleSocialShare('linkedin')} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-50 rounded-xl transition-all group border border-transparent hover:border-blue-100">
              <div className="w-10 h-10 bg-[#0A66C2] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-700">LinkedIn</span>
            </button>

            <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 p-3 hover:bg-green-50 rounded-xl transition-all group border border-transparent hover:border-green-100">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-green-600">WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
