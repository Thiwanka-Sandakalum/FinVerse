
import React, { useState } from 'react';

interface CalculatorsProps {
  embedded?: boolean;
}

const Calculators: React.FC<CalculatorsProps> = ({ embedded = false }) => {
  const [activeTab, setActiveTab] = useState<'leasing' | 'personal' | 'housing' | 'hybrid'>('leasing');
  const [amount, setAmount] = useState<number>(5000000);
  const [period, setPeriod] = useState<number>(12);
  const [downPayment, setDownPayment] = useState<string>('');
  const [rate, setRate] = useState<number>(18.5);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const handleCalculate = () => {
    // Standard amortization formula for estimation
    // P = Loan Amount, r = monthly interest rate, n = total number of months
    const principal = amount - (Number(downPayment) || 0);
    if (principal <= 0) return;
    
    const r = rate / 100 / 12;
    const n = period;
    
    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const payment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(payment);
  };

  const handleReset = () => {
    setAmount(5000000);
    setPeriod(12);
    setDownPayment('');
    setRate(18.5);
    setMonthlyPayment(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(val);
  };

  return (
    <section className={`${embedded ? 'py-4' : 'py-20'} bg-white`}>
      <div className={`${embedded ? 'max-w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Calculator Widget */}
          <div className={`${embedded ? 'lg:col-span-12' : 'lg:col-span-8'} bg-gray-50 rounded-3xl p-8 shadow-sm border border-gray-100`}>
            
            {/* Header */}
            <div className="flex items-start mb-8">
              <div className="w-16 h-16 mr-6 flex-shrink-0">
                <img 
                   src="https://cdn-icons-png.flaticon.com/512/2643/2643126.png" 
                   alt="Calculator" 
                   className="w-full h-full object-contain opacity-80"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Leasing Calculator</h2>
                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                  Interested in a lease facility? Check the lease calculator to understand your monthly payments. 
                  Make informed leasing choices and stay within your budget with ease!
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-nowrap overflow-x-auto gap-4 mb-8 pb-2 no-scrollbar items-center">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>

              <button 
                onClick={() => setActiveTab('leasing')}
                className={`flex flex-col items-center justify-center w-32 h-24 rounded-lg flex-shrink-0 transition-all ${activeTab === 'leasing' ? 'bg-accent-500 text-white shadow-lg' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                <span className="text-sm font-semibold">Leasing</span>
              </button>

              <button 
                onClick={() => setActiveTab('personal')}
                className={`flex flex-col items-center justify-center w-32 h-24 rounded-lg flex-shrink-0 transition-all ${activeTab === 'personal' ? 'bg-accent-500 text-white shadow-lg' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
              >
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="text-sm font-semibold">Personal Loan</span>
              </button>

              <button 
                onClick={() => setActiveTab('housing')}
                className={`flex flex-col items-center justify-center w-32 h-24 rounded-lg flex-shrink-0 transition-all ${activeTab === 'housing' ? 'bg-accent-500 text-white shadow-lg' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
              >
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span className="text-sm font-semibold">Housing Loan</span>
              </button>

              <button 
                onClick={() => setActiveTab('hybrid')}
                className={`flex flex-col items-center justify-center w-36 h-24 rounded-lg flex-shrink-0 transition-all ${activeTab === 'hybrid' ? 'bg-accent-500 text-white shadow-lg' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
              >
                <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-sm font-semibold text-center leading-tight">Hybrid Garusaru<br/>Loan</span>
              </button>
              
               <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-8">
              {/* Lease Amount */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Lease Amount</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-12 border border-gray-300 rounded-lg pl-4 pr-12 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-gray-700 font-medium bg-white"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium bg-gray-100 px-2 rounded">LKR</span>
                </div>
              </div>

              {/* Lease Period Slider */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-4">Lease Period</label>
                <div className="relative pt-6 pb-2">
                   <div className="absolute top-0 left-0 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm transform -translate-x-1/2" style={{ left: `${((period - 12) / (96 - 12)) * 100}%` }}>
                      {period} Months
                   </div>
                  <input 
                    type="range" 
                    min="12" 
                    max="96" 
                    step="12"
                    value={period}
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="flex justify-between text-xs font-medium text-gray-500 mt-2">
                    <span>12 Months</span>
                    <span>96 Months</span>
                  </div>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Down payments <span className="text-gray-400 font-normal">(Enter number of Down payments (0-5 months))</span></label>
                <input 
                  type="number"
                  placeholder="0"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-gray-700 bg-white"
                />
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">With an interest rate of</label>
                 <div className="relative">
                  <input 
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full h-12 border border-gray-300 rounded-lg pl-4 pr-16 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none text-gray-700 font-medium bg-white"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 font-medium bg-gray-100 px-2 rounded">% p.a.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row items-center justify-between pt-6">
                <div className="flex space-x-4 mb-4 md:mb-0 w-full md:w-auto">
                  <button 
                    onClick={handleReset}
                    className="flex-1 md:flex-none px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={handleCalculate}
                    className="flex-1 md:flex-none px-8 py-3 rounded-full bg-accent-500 text-white font-bold hover:bg-accent-600 shadow-md transition-colors"
                  >
                    Calculate
                  </button>
                </div>
                
                <div className="flex space-x-3">
                   <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                   </button>
                   <button className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                   </button>
                </div>
              </div>

              {monthlyPayment !== null && (
                 <div className="mt-6 p-6 bg-accent-500/10 border border-accent-500 rounded-xl text-center animate-fade-in-up">
                    <p className="text-gray-600 mb-2 font-medium">Estimated Monthly Installment</p>
                    <p className="text-4xl font-bold text-accent-500 font-sans">{formatCurrency(monthlyPayment)}</p>
                 </div>
              )}
            </div>

          </div>

          {/* Right Column: Exchange Rate CTA - Hide if embedded */}
          {!embedded && (
            <div className="lg:col-span-4 mt-8 lg:mt-0">
               <div className="flex items-center space-x-4 cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-brand-100 shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
                     <div className="relative">
                        <svg className="w-8 h-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <svg className="w-4 h-4 text-accent-500 absolute -top-1 -right-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent-500 transition-colors">
                        Check The <span className="font-normal">Latest Exchange</span><br/>Rates
                     </h3>
                  </div>
               </div>
               
               <div className="mt-12 bg-gradient-to-br from-brand-900 to-brand-700 rounded-3xl p-8 text-white relative overflow-hidden hidden lg:block">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <h4 className="font-serif font-bold text-2xl mb-4 relative z-10">Need Help?</h4>
                  <p className="text-brand-100 mb-6 text-sm relative z-10">
                     Our financial advisors are ready to help you plan your next big step.
                  </p>
                  <button className="text-sm font-bold bg-white text-brand-900 py-2 px-6 rounded-full hover:bg-brand-50 transition-colors relative z-10">
                     Contact Us
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Calculators;
