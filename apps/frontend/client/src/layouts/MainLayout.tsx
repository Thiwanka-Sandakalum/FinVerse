import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIChat from '../components/AIChat';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Header />

      <main>
        {children}
      </main>

      <AIChat />
      <Footer />
    </div>
  );
};

export default MainLayout;