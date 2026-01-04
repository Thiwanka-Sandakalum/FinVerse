import React from 'react';
import { useNavigate } from 'react-router-dom';

const Features: React.FC = () => {
  const navigate = useNavigate();
  const navi = () => {
    navigate('/signup');
  };
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">The inVerse Ecosystem</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Connecting individuals with the right financial partners for a prosperous future.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* For Users Card */}
          <div onClick={navi} className="bg-white rounded-3xl p-10 shadow-lg border-2 border-transparent hover:border-brand-200 transition-all duration-300 group cursor-pointer hover:shadow-xl active:scale-[0.98] transform">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>

            <h3 className="text-2xl font-bold text-brand-900 mb-6">For Users</h3>
            <ul className="space-y-4">
              {[
                "Compare financial products from multiple institutions",
                "Save and organize your favorite financial products",
                "Share product comparisons with family and friends",
                "Chat with our AI assistant for instant financial advice",
                "Create profiles to get personalized recommendations"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {item}
                </li>
              ))}
            </ul>

            <button className="mt-8 px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-all w-full sm:w-auto active:scale-95 transform">
              Find Products
            </button>
          </div>

          {/* For Financial Institutions Card */}
          <div onClick={navi} className="bg-brand-900 rounded-3xl p-10 shadow-lg border-2 border-brand-800 text-white relative overflow-hidden group cursor-pointer hover:shadow-2xl active:scale-[0.98] transform transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500 rounded-full blur-[100px] opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-white group-hover:scale-110 transition-transform border border-white/10">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-6">For Financial Institutions</h3>
              <ul className="space-y-4">
                {[
                  "List your products on our platform to reach more customers",
                  "Showcase your competitive rates and features",
                  "Connect with qualified prospects actively seeking financial products",
                  "Analytics on product performance and user engagement"
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-brand-100">
                    <svg className="w-5 h-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="mt-8 px-6 py-3 bg-white text-brand-900 font-bold rounded-lg hover:bg-gray-100 transition-all w-full sm:w-auto active:scale-95 transform">
                Partner With Us
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;