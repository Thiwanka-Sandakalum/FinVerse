
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calculators from '../components/Calculators';

interface Tool {
  id: string;
  title: string;
  category: 'All' | 'Loans' | 'Cards' | 'Savings' | 'Business';
  description: string;
  icon: React.ReactNode;
  buttonText?: string;
}

const TOOLS: Tool[] = [
  {
    id: 'emi-calc',
    title: 'Loan EMI Calculator',
    category: 'Loans',
    description: 'Estimate your monthly loan payments, total interest, and amortization schedule for personal, home, or vehicle loans.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    buttonText: 'Open Calculator'
  },
  {
    id: 'affordability',
    title: 'Loan Affordability Checker',
    category: 'Loans',
    description: 'Calculate how much you can afford to borrow based on your income, expenses, and current debt obligations.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    id: 'card-match',
    title: 'Credit Card Match Tool',
    category: 'Cards',
    description: 'Find the perfect credit card that matches your spending habits, desired rewards, and credit score.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    buttonText: 'Find Matches'
  },
  {
    id: 'savings-goal',
    title: 'Savings Goal Calculator',
    category: 'Savings',
    description: 'Plan for your future goals. See how much you need to save monthly to reach your target by a specific date.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'fd-calc',
    title: 'Fixed Deposit Calculator',
    category: 'Savings',
    description: 'Calculate the maturity amount and interest earned on your fixed deposits across different banks.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'business-loan',
    title: 'Business Loan Estimator',
    category: 'Business',
    description: 'Estimate payments for business expansion loans, working capital, or equipment financing.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'cash-flow',
    title: 'Cash Flow Analyzer',
    category: 'Business',
    description: 'Analyze your business cash flow to better understand your financial health and capacity for debt.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    id: 'budget-planner',
    title: 'Personal Budget Planner',
    category: 'Savings',
    description: 'Create a monthly budget plan. Track income and expenses to identify saving opportunities.',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

const ToolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Loans' | 'Cards' | 'Savings' | 'Business'>('All');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const filteredTools = activeTab === 'All' ? TOOLS : TOOLS.filter(t => t.category === activeTab);

  const handleOpenTool = (toolId: string) => {
    setSelectedToolId(toolId);
  };

  const closeModal = () => {
    setSelectedToolId(null);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-gray-50 pb-20">

      {/* 1. Hero Section */}
      <section className="bg-brand-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500 rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Smart Financial Tools</h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-8">
            Calculate payments, plan your budget, and optimize your financial decisions with our suite of intelligent tools.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full transition-colors shadow-lg">
              Explore Tools
            </button>
          </div>
        </div>
      </section>

      {/* 2. Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-2 shadow-lg inline-flex flex-wrap justify-center sm:flex-nowrap w-full sm:w-auto mx-auto sm:mx-0 overflow-x-auto">
          {['All', 'Loans', 'Cards', 'Savings', 'Business'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Tool Grid */}
      <section id="tools-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map(tool => (
            <div key={tool.id} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${tool.category === 'Loans' ? 'bg-blue-500 text-white' :
                  tool.category === 'Cards' ? 'bg-purple-500 text-white' :
                    tool.category === 'Savings' ? 'bg-green-500 text-white' :
                      'bg-orange-500 text-white'
                }`}>
                {tool.icon}
              </div>

              <div className="mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${tool.category === 'Loans' ? 'bg-blue-50 text-blue-600' :
                    tool.category === 'Cards' ? 'bg-purple-50 text-purple-600' :
                      tool.category === 'Savings' ? 'bg-green-50 text-green-600' :
                        'bg-orange-50 text-orange-600'
                  }`}>
                  {tool.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">{tool.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                {tool.description}
              </p>

              <button
                onClick={() => handleOpenTool(tool.id)}
                className="w-full py-3 border border-gray-200 text-brand-700 font-bold rounded-xl hover:bg-brand-50 hover:border-brand-300 transition-colors flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600"
              >
                {tool.buttonText || 'Open Tool'}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Tool Modal */}
      {selectedToolId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-20">
              <h3 className="font-bold text-xl text-gray-900 flex items-center">
                {TOOLS.find(t => t.id === selectedToolId)?.title}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-8">
              {selectedToolId === 'emi-calc' ? (
                <Calculators embedded={true} />
              ) : (
                // Placeholder for other tools for MVP
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Coming Soon</h2>
                  <p className="text-gray-500 max-w-md mx-auto mb-8">
                    We are currently building this advanced calculator. In the meantime, try our Loan EMI Calculator or browse products.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => handleOpenTool('emi-calc')} className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">
                      Open EMI Calculator
                    </button>
                    <button onClick={() => navigate('/marketplace')} className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">
                      Browse Products
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Insight Footer (Mockup) */}
            <div className="p-6 bg-brand-50 border-t border-brand-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-200 rounded-full flex items-center justify-center flex-shrink-0 text-brand-700 font-bold text-xs">AI</div>
              <div>
                <p className="text-sm font-bold text-brand-900 mb-1">FinVerse Insight</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Calculators provide estimates only. Actual rates may vary based on your credit score and bank policies.
                  We recommend comparing at least 3 offers before making a decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ToolsPage;
