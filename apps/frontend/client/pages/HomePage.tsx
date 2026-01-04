
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Partners from '../components/Partners';
import MobileApp from '../components/MobileApp';
import Promotions from '../components/Promotions';
import Features from '../components/Features';
import ProductList from '../components/ProductList';
import Calculators from '../components/Calculators';
import Testimonials from '../components/Testimonials';
import { useAuth0 } from '@auth0/auth0-react';
import FloatingMarketingOverlay from '@/components/FloatingMarketingOverlay';


const LATEST_INSIGHTS = [
  {
    id: 1,
    title: "8 creative ways to save money on groceries",
    excerpt: "With inflation on the rise, learn how to cut costs without compromising on nutrition or quality for your family.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    category: "Smart Saving"
  },
  {
    id: 2,
    title: "How to prevent fraud in the digital age",
    excerpt: "Essential tips to protect your identity and finances from modern cyber scams and phishing attacks.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80",
    category: "Security"
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="animate-fade-in">
      <Hero />
      <ProductList />
      <Promotions />
      <Features />
      <MobileApp />
      <Calculators />
      <Partners />
      <Testimonials />

      {/* Latest News Teaser - Redirects to Blog */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">Latest Financial Insights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with our latest articles and tips for financial freedom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {LATEST_INSIGHTS.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate('/blog')}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-full border border-gray-100"
              >
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-center">
                  <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">{post.category}</div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight group-hover:text-brand-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-brand-600 font-semibold text-sm mt-auto group-hover:underline decoration-2 underline-offset-4">
                    Read Article
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center justify-center px-8 py-3 border border-brand-200 text-base font-medium rounded-full text-brand-800 bg-white hover:bg-brand-50 hover:border-brand-300 transition-all shadow-sm group"
            >
              View all articles
              <svg className="ml-2 w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-brand-500 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Proudly Sri Lankan, supporting our nation's economy with dedication
          </h2>
          <p className="mb-8 text-brand-100 text-lg">
            Our commitment goes beyond banking. We are invested in the future of our communities and the prosperity of Sri Lanka.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="font-bold text-xl mb-2">Corporate Announcements</h3>
              <p className="text-sm opacity-80">Stay home and make our purchases with inVerse cards, earning 20% of their value in points.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <h3 className="font-bold text-xl mb-2">Technology Hub</h3>
              <p className="text-sm opacity-80">The inVerse activity supports those who fight on the front lines with technology investments.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Floating marketing overlay for unauthenticated users */}
      {!isAuthenticated && (
        <FloatingMarketingOverlay loginWithRedirect={loginWithRedirect} />
      )}
    </div>
  );
};

export default HomePage;
