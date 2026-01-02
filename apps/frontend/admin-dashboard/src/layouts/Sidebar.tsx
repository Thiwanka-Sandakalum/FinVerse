import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { usePermission } from '../hooks/usePermission';
import { getNavigationItems } from '../config/navConfig';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const { userRole } = usePermission();

  // Get role-specific navigation items
  const navItems = getNavigationItems(userRole);

  return (
    <aside
      className={
        [
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
          !isOpen && "-translate-x-full"
        ].filter(Boolean).join(' ')
      }
    >
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white text-lg">F</span>
          </div>
          <span>Finverse</span>
        </div>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = item.disabled;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isDisabled ? "opacity-50 cursor-not-allowed" : "",
                    isActive && !isDisabled
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  ].filter(Boolean).join(' ')
                }
                end={item.path === '/dashboard'}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                  }
                }}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
        <button
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};