import React from 'react';
import Features from '../components/Features';

const InstitutionsPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
       <div className="bg-brand-900 text-white py-16 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Partner with inVerse</h1>
          <p className="text-brand-100">Connect with qualified prospects and showcase your products.</p>
       </div>
       <Features /> 
    </div>
  );
};

export default InstitutionsPage;