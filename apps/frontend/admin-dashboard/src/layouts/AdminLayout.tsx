import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Page } from '../types/common.types';
import { AiAssistant } from '../components/AiAssistant';
import { useAuth0 } from '@auth0/auth0-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export const AdminLayout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, getAccessTokenSilently } = useAuth0();

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await getAccessTokenSilently();
      console.log(token);
    };
    fetchToken();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          onNavigate(page);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onNavigate={onNavigate}
          onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>

        {/* AI Assistant Floating Widget */}
        <AiAssistant />
      </div>
    </div>
  );
};