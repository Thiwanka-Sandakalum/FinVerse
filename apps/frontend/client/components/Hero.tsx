import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-gray-50 pb-24 lg:pb-32">
      {/* Background Area */}
      <div className="absolute inset-0 h-[85%] lg:h-[80%] bg-brand-900 overflow-hidden rounded-bl-[3rem] lg:rounded-bl-[5rem] shadow-2xl">
        {/* Main Background Image */}
        <img
          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=80"
          alt="Future of Finance"
          className="w-full h-full object-cover opacity-40 mix-blend-color-dodge scale-105"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-900/90 to-brand-800/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900 via-transparent to-transparent"></div>

        {/* Animated Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-500/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse-slow transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32 pb-20">
        <div className="md:w-2/3 lg:w-1/2 text-white mb-16 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
            </span>
            <span className="text-xs font-semibold text-accent-100 tracking-wide uppercase">AI-Powered Financial Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold leading-tight mb-6 tracking-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-blue-400">Smart Money.</span>
          </h1>

          <p className="text-lg md:text-xl text-brand-100 mb-10 max-w-lg leading-relaxed font-light">
            inVerse connects you with top financial institutions, helping you discover, compare, and access the best products through personalized AI insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(22,178,174,0.4)] hover:shadow-[0_0_30px_rgba(22,178,174,0.6)] transform hover:-translate-y-1 flex items-center justify-center"
            >
              Explore Marketplace
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full transition-all flex items-center justify-center"
            >
              Personalized Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Cards Layer - Overlapping the background */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 p-8 lg:p-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How can we help you today?</h2>
              <p className="text-gray-500">Select a category to get started with AI-driven comparisons.</p>
            </div>
            <button onClick={() => navigate('/marketplace')} className="hidden md:flex text-brand-600 font-bold items-center hover:text-brand-800 transition-colors mt-4 md:mt-0">
              View All Products <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div
              onClick={() => navigate('/marketplace')}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">I want a loan</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Compare competitive rates for personal, home, or vehicle loans tailored to your credit score.</p>
                <span className="inline-flex items-center text-brand-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                  Find Loans <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => navigate('/marketplace')}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">Savings & Education</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Secure your future with high-yield savings accounts and education plans.</p>
                <span className="inline-flex items-center text-brand-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                  Start Saving <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => navigate('/marketplace')}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">Cards & Banking</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Find the perfect credit card or banking package that matches your lifestyle.</p>
                <span className="inline-flex items-center text-brand-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                  View Cards <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;