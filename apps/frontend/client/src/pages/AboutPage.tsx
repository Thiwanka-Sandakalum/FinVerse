
import React, { useState } from 'react';

const AboutPage: React.FC = () => {
  const [formState, setFormState] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    inquiryType: 'Product listing',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry. Our team will contact you shortly.');
    setFormState({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      inquiryType: 'Product listing',
      message: ''
    });
  };

  return (
    <div className="animate-fade-in bg-white">
      
      {/* 1. Hero / Intro Section */}
      <section className="relative bg-brand-50 pt-20 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-white border border-brand-100 rounded-full text-brand-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            About FinVerse
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-900 mb-6 leading-tight">
            Making finance simple, <br/>
            <span className="text-accent-500">smart, and accessible.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            FinVerse is an AI-powered financial marketplace that helps individuals and businesses discover, compare, and access the best financial products from trusted institutions.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-brand-900 rounded-3xl p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
                 <p className="text-brand-100 text-lg leading-relaxed">
                   Empower people and businesses to make confident financial decisions through transparency, intelligence, and personalization.
                 </p>
               </div>
            </div>

            <div className="bg-brand-50 rounded-3xl p-10 text-brand-900 border border-brand-100 relative overflow-hidden group">
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-brand-200 rounded-xl flex items-center justify-center mb-6 text-brand-700">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 </div>
                 <h2 className="text-3xl font-serif font-bold mb-4">Our Vision</h2>
                 <p className="text-gray-600 text-lg leading-relaxed">
                   To become the most trusted financial discovery and comparison platform globally, setting the standard for digital financial services.
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Do */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">What We Do</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A comprehensive ecosystem connecting you to the financial world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Product Discovery", desc: "Compare loans, cards, savings, and banking products.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
              { title: "AI-Powered Insights", desc: "Personalized recommendations and real-time guidance.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Personal Financial Hub", desc: "Save, organize, and track financial decisions.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
              { title: "Institutional Marketplace", desc: "Connect financial institutions with qualified customers.", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <h3 className="font-bold text-xl text-brand-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who FinVerse Is For */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">Who FinVerse Is For</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Solutions tailored for every stakeholder in the financial economy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Individuals */}
             <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:border-accent-400 transition-colors group">
                <div className="mb-6 inline-block p-3 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-100 transition-colors">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4">Individuals</h3>
                <ul className="space-y-3">
                   {["Compare personal finance products", "Understand complex terms", "Make smarter money decisions"].map((li, idx) => (
                     <li key={idx} className="flex items-start text-gray-600 text-sm">
                       <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       {li}
                     </li>
                   ))}
                </ul>
             </div>

             {/* Businesses */}
             <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:border-blue-400 transition-colors group">
                <div className="mb-6 inline-block p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-100 transition-colors">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4">Businesses</h3>
                <ul className="space-y-3">
                   {["Discover business loans", "Compare cash-flow products", "Optimize financial operations"].map((li, idx) => (
                     <li key={idx} className="flex items-start text-gray-600 text-sm">
                       <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       {li}
                     </li>
                   ))}
                </ul>
             </div>

             {/* Financial Institutions */}
             <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:border-brand-400 transition-colors group">
                <div className="mb-6 inline-block p-3 bg-brand-50 text-brand-600 rounded-2xl group-hover:bg-brand-100 transition-colors">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4">Institutions</h3>
                <ul className="space-y-3">
                   {["Showcase products", "Reach high-intent users", "Gain analytics & insights"].map((li, idx) => (
                     <li key={idx} className="flex items-start text-gray-600 text-sm">
                       <svg className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                       {li}
                     </li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Trust, Security & Compliance */}
      <section className="py-16 bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 </div>
                 <h3 className="text-lg font-bold mb-2">Bank-Level Security</h3>
                 <p className="text-brand-200 text-sm">256-bit encryption ensuring your data remains private and secure.</p>
              </div>
              <div className="p-6">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 </div>
                 <h3 className="text-lg font-bold mb-2">Privacy First</h3>
                 <p className="text-brand-200 text-sm">We never sell your personal data. Your financial journey belongs to you.</p>
              </div>
              <div className="p-6">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h3 className="text-lg font-bold mb-2">Fully Compliant</h3>
                 <p className="text-brand-200 text-sm">Adhering to global financial data standards and local regulations.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 6. Business Inquiries Form */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-brand-900 p-8 md:p-12 text-center text-white">
                 <h2 className="text-3xl font-serif font-bold mb-4">Business & Partnership Inquiries</h2>
                 <p className="text-brand-100">Are you a financial institution, fintech company, or partner? We'd love to hear from you.</p>
              </div>
              
              <div className="p-8 md:p-12">
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                          <input 
                            required
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-gray-900"
                            value={formState.companyName}
                            onChange={e => setFormState({...formState, companyName: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person</label>
                          <input 
                            required
                            type="text" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-gray-900"
                            value={formState.contactPerson}
                            onChange={e => setFormState({...formState, contactPerson: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Business Email</label>
                          <input 
                            required
                            type="email" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-gray-900"
                            value={formState.email}
                            onChange={e => setFormState({...formState, email: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                          <input 
                            type="tel" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-gray-900"
                            value={formState.phone}
                            onChange={e => setFormState({...formState, phone: e.target.value})}
                          />
                       </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Inquiry Type</label>
                        <select 
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-gray-900"
                          value={formState.inquiryType}
                          onChange={e => setFormState({...formState, inquiryType: e.target.value})}
                        >
                           <option>Product listing</option>
                           <option>Partnership</option>
                           <option>Advertising</option>
                           <option>API access</option>
                        </select>
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                       <textarea 
                         required
                         rows={4}
                         className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none bg-white text-gray-900"
                         value={formState.message}
                         onChange={e => setFormState({...formState, message: e.target.value})}
                       ></textarea>
                    </div>

                    <div className="text-center pt-4">
                       <button type="submit" className="px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-full transition-all shadow-lg transform hover:-translate-y-1">
                          Submit Inquiry
                       </button>
                    </div>
                 </form>
                 
                 <div className="mt-8 text-center border-t border-gray-100 pt-8">
                    <p className="text-gray-500 text-sm">Prefer email? Contact us directly at <a href="mailto:business@finverse.com" className="text-brand-600 font-bold hover:underline">business@finverse.com</a></p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 7. Contact & Support */}
      <section className="py-20 bg-white border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-serif font-bold text-brand-900 mb-4">We're here to help</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">AI Assistant</h3>
                  <p className="text-gray-500 text-sm mb-4">Get instant answers to your questions 24/7.</p>
                  <button className="text-brand-600 font-bold hover:underline text-sm">Start Chat</button>
               </div>
               
               <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-500 text-sm mb-4">For general inquiries and user support.</p>
                  <a href="mailto:support@finverse.com" className="text-brand-600 font-bold hover:underline text-sm">support@finverse.com</a>
               </div>

               <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Help Center</h3>
                  <p className="text-gray-500 text-sm mb-4">Browse guides, FAQs, and tutorials.</p>
                  <button className="text-brand-600 font-bold hover:underline text-sm">Visit Help Center</button>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default AboutPage;
