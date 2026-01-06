import React from 'react';

interface HeroSectionProps {
    filteredProductsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ filteredProductsCount }) => (
    <section className="relative bg-brand-900 text-white overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500 rounded-full blur-[120px] opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-600 rounded-full blur-[100px] opacity-40 transform -translate-x-1/3 translate-y-1/3"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
                <div className="inline-block px-3 py-1 bg-brand-800 border border-brand-700 rounded-full text-accent-400 text-xs font-bold uppercase tracking-wider mb-6">
                    Financial Marketplace
                </div>
                <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
                    Find the Best Loans, Cards, and Savings – <span className="text-accent-500">Tailored for You</span>
                </h1>
                <p className="text-brand-100 text-lg mb-8 max-w-lg leading-relaxed">
                    Compare top financial products from trusted institutions and make smarter money decisions with confidence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => {
                            requestAnimationFrame(() => {
                                document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
                            });
                        }}
                        className="px-8 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-accent-500/30 transform hover:-translate-y-0.5"
                    >
                        Compare Products
                    </button>
                    <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full transition-all flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Explore AI Recommendations
                    </button>
                </div>
            </div>

            <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="relative w-full max-w-md">
                    <div className="absolute top-4 -right-4 w-full h-full bg-brand-700/50 rounded-2xl transform rotate-3"></div>
                    <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg">Your Comparison</h3>
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Live Rates</span>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white p-4 rounded-xl flex items-center shadow-sm">
                                    <div className={`w-10 h-10 rounded-full mr-4 flex items-center justify-center ${i === 1 ? 'bg-blue-100 text-blue-600' : i === 2 ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {i === 1 ? 'C' : i === 2 ? 'W' : 'A'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 w-24 bg-gray-200 rounded mb-1.5"></div>
                                        <div className="h-2 w-16 bg-gray-100 rounded"></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">{3 + i}.5%</div>
                                        <div className="text-[10px] text-gray-400">APR</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                            <span className="text-brand-200">{filteredProductsCount} Products Found</span>
                            <span className="font-bold text-accent-400 cursor-pointer">View All &rarr;</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);
