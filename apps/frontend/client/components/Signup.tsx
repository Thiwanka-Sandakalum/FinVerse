import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { href } from 'react-router-dom';

const Signup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'institution' | null>(null);
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10">
        <h2 className="text-4xl font-serif font-bold text-brand-900 mb-4">Join inVerse</h2>
        <p className="text-lg text-gray-600">Choose how you want to get started with us.</p>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Option 1: For Users */}
        <div
          className={`relative group bg-white rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${activeTab === 'user' ? 'border-brand-500 ring-4 ring-brand-100' : 'border-transparent hover:border-brand-200'}`}
          onClick={() => setActiveTab('user')}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600 rounded-t-3xl"></div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">I am a User</h3>
          <p className="text-center text-gray-500 mb-8">Looking to compare products, save money, and get personalized financial advice.</p>

          <ul className="space-y-3 mb-8 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Compare rates instantly
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Free AI Financial Assistant
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Exclusive deals & offers
            </li>
          </ul>

          <button onClick={() => loginWithRedirect()} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center active:scale-95 transform shadow-md hover:shadow-lg">
            Sign up as User
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>

        {/* Option 2: For Institutions */}
        <div
          className={`relative group bg-white rounded-3xl p-8 border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${activeTab === 'institution' ? 'border-brand-800 ring-4 ring-brand-100' : 'border-transparent hover:border-brand-200'}`}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-800 to-brand-900 rounded-t-3xl"></div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-brand-900 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <h3
            className="text-2xl font-bold text-center text-gray-900 mb-2 cursor-pointer"
          >
            Financial Institution
          </h3>
          <p className="text-center text-gray-500 mb-8">Want to list products, reach qualified leads, and access market analytics.</p>

          <ul className="space-y-3 mb-8 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-brand-800 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              List unlimited products
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-brand-800 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Customer intent analytics
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-brand-800 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Brand visibility dashboard
            </li>
          </ul>


          <button onClick={() => window.location.href = "https://finverselk.web.app/"} className="w-full bg-brand-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center active:scale-95 transform shadow-md hover:shadow-lg">
            Become a Partner
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>

      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">Already have an account? <button onClick={() => loginWithRedirect()} className="text-brand-600 font-semibold hover:text-brand-800 active:scale-95 transform transition-all inline-block cursor-pointer hover:underline">Log in</button></p>
      </div>
    </div>
  );
};

export default Signup;