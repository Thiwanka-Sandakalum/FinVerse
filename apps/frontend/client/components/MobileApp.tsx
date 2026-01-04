import React from 'react';

const MobileApp: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#0A1A3B] rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px] flex items-center">
          
          {/* Background Pattern/Effects */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/4"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10 p-8 md:p-16 lg:p-20">
            
            {/* Left Content */}
            <div className="text-white space-y-8 max-w-xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
                 <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
                 <span className="text-xs font-bold tracking-widest uppercase text-accent-100">Mobile First Banking</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                Manage your wealth <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-blue-300">on the go.</span>
              </h2>
              
              <p className="text-lg text-brand-100 leading-relaxed">
                Experience the power of inVerse ONE. Real-time notifications, instant transfers, and AI-powered insights right in your pocket.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex items-center bg-white text-brand-900 px-6 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg" alt="Apple" className="w-6 h-6 mr-3 filter invert" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-60">Download on the</div>
                    <div className="text-base leading-none">App Store</div>
                  </div>
                </button>
                
                <button className="flex items-center bg-transparent border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all transform hover:-translate-y-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" alt="Android" className="w-6 h-6 mr-3 filter invert brightness-0 invert-100" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider opacity-60">Get it on</div>
                    <div className="text-base leading-none">Google Play</div>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-4 pt-4 text-sm text-brand-200 font-medium">
                <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-900 bg-gray-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                     </div>
                   ))}
                </div>
                <p>Join 2M+ users today</p>
              </div>
            </div>

            {/* Right Content: Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end items-center">
               
               {/* Phone Container */}
               <div className="relative w-[320px] h-[650px] bg-gray-900 rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-700 z-10 ring-1 ring-white/10">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-30"></div>
                  
                  {/* Screen Content */}
                  <div className="w-full h-full bg-brand-50 flex flex-col relative overflow-hidden">
                      
                      {/* App Header */}
                      <div className="pt-12 pb-6 px-6 bg-white shadow-sm z-10">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-white shadow-sm overflow-hidden">
                                   <img src="https://i.pravatar.cc/150?u=sarah" alt="Profile" />
                                </div>
                                <div>
                                   <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Welcome back</p>
                                   <p className="text-gray-900 font-bold text-lg">Sarah P.</p>
                                </div>
                             </div>
                             <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                               <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                             </button>
                          </div>
                      </div>

                      {/* Scrollable Body */}
                      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                          
                          {/* Balance Card */}
                          <div className="bg-gradient-to-br from-brand-800 to-brand-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-200 transform transition-transform hover:scale-[1.02]">
                              <div className="flex justify-between items-start mb-8">
                                 <div>
                                    <p className="text-brand-200 text-sm font-medium mb-1">Total Balance</p>
                                    <h3 className="text-3xl font-bold">LKR 45,250<span className="text-lg opacity-70">.00</span></h3>
                                 </div>
                                 <svg className="w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 10h16v2H4zm0-4h16v2H4zm0 8h16v2H4z"/></svg>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center cursor-pointer hover:bg-white/30 transition-colors">
                                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    <span className="text-xs font-bold">Add</span>
                                 </div>
                                 <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center cursor-pointer hover:bg-white/30 transition-colors">
                                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                    <span className="text-xs font-bold">Send</span>
                                 </div>
                                 <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center cursor-pointer hover:bg-white/30 transition-colors">
                                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                    <span className="text-xs font-bold">More</span>
                                 </div>
                              </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <p className="text-xs text-gray-500 font-bold">Income</p>
                                <p className="text-sm font-bold text-gray-900">+LKR 85k</p>
                             </div>
                             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                                </div>
                                <p className="text-xs text-gray-500 font-bold">Expense</p>
                                <p className="text-sm font-bold text-gray-900">-LKR 32k</p>
                             </div>
                          </div>

                          {/* Transactions */}
                          <div>
                             <h4 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                               Transactions <span className="text-brand-600 text-xs cursor-pointer">View All</span>
                             </h4>
                             <div className="space-y-3">
                                {[
                                  { title: "Netflix Subscription", sub: "Entertainment", price: "-LKR 1,200", icon: "N", color: "bg-red-500" },
                                  { title: "Keells Super", sub: "Groceries", price: "-LKR 5,450", icon: "K", color: "bg-green-600" },
                                  { title: "Uber Rides", sub: "Transport", price: "-LKR 850", icon: "U", color: "bg-black" },
                                ].map((t, i) => (
                                   <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                                      <div className="flex items-center gap-3">
                                         <div className={`w-10 h-10 rounded-xl ${t.color} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>{t.icon}</div>
                                         <div>
                                            <p className="font-bold text-gray-900 text-sm">{t.title}</p>
                                            <p className="text-xs text-gray-400">{t.sub}</p>
                                         </div>
                                      </div>
                                      <span className="font-bold text-gray-900 text-sm">{t.price}</span>
                                   </div>
                                ))}
                             </div>
                          </div>

                      </div>

                      {/* Bottom Nav */}
                      <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                          <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                          <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-accent-200 -mt-8 border-4 border-gray-50">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </div>
                          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                  </div>
               </div>

               {/* Second Phone (Back) - Decorative */}
               <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-12 -translate-y-1/2 scale-90 opacity-60 z-0">
                  <div className="w-[300px] h-[600px] bg-gray-800 rounded-[3rem] border-[8px] border-gray-700"></div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;