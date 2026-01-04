import React from 'react';
import { useNavigate } from 'react-router-dom';

const Promotions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Hero Card Container */}
        <div className="bg-brand-900 rounded-sm shadow-2xl overflow-hidden min-h-[500px] relative flex flex-col lg:flex-row">

          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            {/* Subtle radial gradient to give depth to the flat blue */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-800 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Left Content: Featured Offer Card */}
          <div className="relative z-20 lg:w-[35%] p-8 lg:p-12 flex items-center">
            <div className="bg-white p-8 rounded-sm shadow-xl w-full relative">
              {/* Decorative Triangle/Arrow pointing right could go here if needed */}

              <span className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3 block">SMART COMPARISON</span>
              <h2 className="text-3xl font-sans font-bold text-brand-900 mb-4 leading-tight">
                Find the best financial products tailored to your lifestyle
              </h2>
              <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                Compare exclusive rates from top banks, track your financial health, and get AI-powered recommendations.
              </p>
              <div className="space-y-3">
                <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded transition-colors shadow-sm">
                  Start Comparing
                </button>
                <button className="w-full py-3.5 bg-white border-2 border-brand-800 text-brand-800 font-bold rounded hover:bg-gray-50 transition-colors">
                  View Features
                </button>
              </div>
            </div>
          </div>

          {/* Center Content: Visual */}
          <div className="relative z-10 lg:w-[35%] flex items-end justify-center h-[350px] lg:h-auto overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Customer using mobile app"
              className="h-[110%] w-auto object-cover object-top lg:object-contain lg:h-[95%] lg:mb-0 transform lg:translate-y-4"
            />

            {/* Floating UI Elements matching reference */}
            <div className="absolute top-1/4 left-4 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hidden xl:block animate-bounce-slow">
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Monthly Savings</div>
              <div className="text-2xl font-bold text-brand-900 mb-2">LKR 45,000</div>
              <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="absolute bottom-1/3 right-4 bg-white p-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hidden xl:block animate-pulse-slow">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Rate Alert</div>
                  <div className="text-blue-600 font-bold text-sm">Better Rate Found!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content: Login Sidebar */}
          <div className="relative z-20 lg:w-[30%] bg-white flex flex-col justify-center p-8 lg:p-12 border-l border-gray-100">
            <h3 className="text-3xl font-bold text-brand-900 mb-6 leading-tight">Your financial dashboard.</h3>
            <button className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-full mb-6 transition-colors shadow-md">
              Member Login
            </button>
            <button onClick={() => navigate('/signup')} className="text-brand-600 font-bold underline hover:text-brand-800 text-sm inline-block">
              Create free account
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Promotions;