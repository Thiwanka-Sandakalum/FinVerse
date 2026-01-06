import React, { useState, useEffect } from 'react';

const AdModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after 1.5 seconds of site load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Content - Horizontal Layout on Desktop */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up transform transition-all scale-100 mx-auto flex flex-col md:flex-row max-h-[90vh] md:h-auto">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-50 w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Visual (Gradient & Mockup) */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-brand-800 to-brand-900 relative overflow-hidden flex flex-col justify-between p-8 text-white">
           {/* Decorative elements */}
           <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-[-20px] w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
           
           <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
             <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
               New App
             </div>
             <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight leading-none">
               inVerse <span className="text-accent-500">ONE</span>
             </h2>
           </div>

           {/* Phone CSS Mockup */}
           <div className="relative z-10 flex justify-center items-end flex-grow -mb-12 md:-mb-16 mt-4 pointer-events-none">
               <div className="w-36 md:w-44 bg-gray-900 rounded-[1.5rem] border-[4px] border-gray-800 shadow-2xl overflow-hidden transform md:rotate-[-5deg] z-20 relative ring-1 ring-white/10">
                   {/* Notch */}
                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-4 bg-black rounded-b-lg z-20"></div>
                   
                   {/* Screen Content */}
                   <div className="w-full h-[320px] bg-gray-50 flex flex-col relative">
                       {/* Header */}
                       <div className="bg-white px-4 pt-8 pb-3 shadow-sm z-10">
                           <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200"></div>
                               <div>
                                   <div className="h-2 w-16 bg-gray-200 rounded"></div>
                                   <div className="h-2 w-10 bg-gray-100 rounded mt-1"></div>
                               </div>
                           </div>
                       </div>
                       
                       {/* Body */}
                       <div className="p-3 space-y-3">
                           {/* Balance Card */}
                           <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-4 rounded-xl shadow-lg text-white">
                               <div className="text-[8px] opacity-70 uppercase mb-1">Total Balance</div>
                               <div className="text-lg font-bold">LKR 45,250</div>
                               <div className="flex gap-2 mt-3">
                                   <div className="w-6 h-6 rounded bg-white/20"></div>
                                   <div className="w-6 h-6 rounded bg-white/20"></div>
                               </div>
                           </div>
                           
                           {/* List */}
                           <div className="space-y-2">
                               {[1, 2, 3].map(i => (
                                   <div key={i} className="bg-white p-2 rounded-lg border border-gray-100 flex items-center shadow-sm">
                                       <div className={`w-8 h-8 rounded-lg ${i===1 ? 'bg-red-100' : i===2 ? 'bg-green-100' : 'bg-blue-100'} mr-3`}></div>
                                       <div className="flex-1">
                                           <div className="h-2 w-16 bg-gray-200 rounded mb-1"></div>
                                           <div className="h-1.5 w-8 bg-gray-100 rounded"></div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>
               </div>
               
               {/* Second Phone (Back) */}
               <div className="hidden md:block w-32 md:w-40 bg-gray-800 rounded-[1.5rem] border-[4px] border-gray-700 shadow-xl overflow-hidden transform translate-x-6 translate-y-6 rotate-[5deg] absolute right-4 bottom-0 opacity-60 z-10">
                    <div className="w-full h-full bg-gray-700/50"></div>
               </div>
           </div>
        </div>

        {/* Right Side: Content & Actions */}
        <div className="w-full md:w-7/12 bg-white p-8 md:p-12 flex flex-col justify-center text-left">
           <div className="max-w-md">
             <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
               Banking tailored to your <br className="hidden md:block" />
               <span className="text-accent-500">digital lifestyle.</span>
             </h3>
             <p className="text-gray-500 mb-8 text-base md:text-lg leading-relaxed">
               Experience the future of finance with real-time insights, zero hidden fees, and AI-powered recommendations—all in one place.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button className="bg-brand-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-brand-800 transition-all flex items-center justify-center shadow-lg transform hover:-translate-y-0.5 group">
                   <svg className="w-6 h-6 mr-2 group-hover:text-gray-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L3.84,2.15C3.84,2.15 6.05,2.66 6.05,2.66Z" />
                   </svg>
                   <div className="text-left">
                     <div className="text-[9px] uppercase leading-none text-gray-400">Get it on</div>
                     <div className="text-sm font-bold font-sans leading-none mt-0.5">Google Play</div>
                   </div>
                </button>

                <button className="bg-brand-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-brand-800 transition-all flex items-center justify-center shadow-lg transform hover:-translate-y-0.5 group">
                   <svg className="w-6 h-6 mr-2 group-hover:text-gray-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z" />
                   </svg>
                   <div className="text-left">
                     <div className="text-[9px] uppercase leading-none text-gray-400">Download on</div>
                     <div className="text-sm font-bold font-sans leading-none mt-0.5">App Store</div>
                   </div>
                </button>
             </div>

             <div className="flex items-center text-xs text-gray-400 font-medium">
               <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               4.9/5 Rating from 10k+ reviews
             </div>
             
             <button 
               onClick={() => setIsOpen(false)}
               className="mt-6 text-gray-400 hover:text-gray-600 text-xs font-semibold tracking-wide uppercase transition-colors text-left md:hidden"
             >
               No thanks, continue to website
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdModal;