import { useSavedProducts } from '../context/SavedProductsContext';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ProductsService } from '../services/products';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutRef = useRef<any>(null);
  const location = useLocation();

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await ProductsService.getProductsCategories(undefined, undefined, true, 1, 50, 'level', 'asc');
        const parents = res.data.filter((cat: any) => cat.level === 0);
        setCategories(parents);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);


  const NAV_LINKS = {
    products: [
      categories.map((parent) => ({
        category: parent.name,
        icon: 'M5 13l4 4L19 7', // Placeholder icon
        items: parent.children ? parent.children.map((child: any) => child.name) : [],
      }))
    ],
    tools: [
      { name: 'Loan Calculator', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0 0l-3-3m3 3l3-3' },
      { name: 'Savings Planner', icon: 'M5 13l4 4L19 7' },
      { name: 'Budget Tracker', icon: 'M9 17v-6a2 2 0 012-2h6M9 7h6a2 2 0 012 2v6m-8 4h.01M15 11h.01M12 14h.01' },
    ],
  }


  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* 1. Brand / Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer group">
            <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center mr-2 shadow-lg group-hover:bg-brand-800 transition-colors">
              <span className="text-white font-serif font-bold text-xl">iV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-brand-900 tracking-tight leading-none">inVerse</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">Financial Companion</span>
            </div>
          </Link>

          {/* 2. Primary Navigation (Desktop) */}
          <nav className="hidden lg:flex space-x-1 items-center h-full">

            {/* Products Mega Menu - dynamic from API */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/marketplace"
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${isActive('/marketplace') ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-900 hover:bg-gray-50'}`}
              >
                Products
                <svg className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'products' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>

              {/* Mega Menu Dropdown */}
              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 w-[800px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 grid grid-cols-4 gap-6 animate-fade-in-up -ml-20">
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((parent) => (
                      <div key={parent.id} className="space-y-4">
                        <div className="flex items-center space-x-2 text-brand-600 border-b border-gray-100 pb-2">
                          {/* Optionally add an icon for each parent category */}
                          <h4 className="font-bold text-sm uppercase tracking-wide">{parent.name}</h4>
                        </div>
                        <ul className="space-y-2">
                          {Array.isArray(parent.children) && parent.children.length > 0 ? (
                            parent.children.map((child: any) => (
                              <li key={child.id}>
                                <button
                                  className="text-sm text-gray-500 hover:text-accent-500 hover:translate-x-1 transition-all block w-full text-left"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                    navigate(`/marketplace?categoryId=${child.id}`);
                                  }}
                                >
                                  {child.name}
                                </button>
                              </li>
                            ))
                          ) : (
                            <li>
                              <button
                                className="text-sm text-gray-500 hover:text-accent-500 hover:translate-x-1 transition-all block w-full text-left"
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setActiveDropdown(null);
                                  navigate(`/marketplace?categoryId=${parent.id}`);
                                }}
                              >
                                {parent.name}
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center text-gray-400 py-8">Loading categories...</div>
                  )}
                  <div className="col-span-4 bg-gray-50 rounded-xl p-4 flex justify-between items-center mt-2">
                    <div>
                      <h5 className="font-bold text-brand-900">Not sure what you need?</h5>
                      <p className="text-xs text-gray-500">Try our AI comparison tool to find the perfect match.</p>
                    </div>
                    <Link to="/chat" className="text-xs font-bold bg-brand-900 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">Ask AI Assistant</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Tools Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('tools')}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/tools"
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${isActive('/tools') ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-900 hover:bg-gray-50'}`}
              >
                Tools
                <svg className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>

              {activeDropdown === 'tools' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-fade-in-up">
                  {NAV_LINKS.tools.map((tool, idx) => (
                    <Link
                      key={idx}
                      to="/tools"
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 rounded-lg transition-colors group"
                    >
                      <span className="p-2 bg-brand-50 text-brand-400 rounded-lg mr-3 group-hover:bg-white group-hover:text-accent-500 shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} /></svg>
                      </span>
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/blog') ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-900 hover:bg-gray-50'}`}
            >
              Insights
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/about') ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-brand-900 hover:bg-gray-50'}`}
            >
              About Us
            </Link>
          </nav>

          {/* 3. Search Bar (Desktop) */}
          <div className="hidden xl:flex flex-1 max-w-xs mx-6">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-transparent group-hover:border-gray-200 text-gray-900 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent-500 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 group-hover:text-brand-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* 4. Call-to-Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* AI Assistant Button */}
            {isAuthenticated && (
              <Link
                to="/chat"
                className={`p-2.5 rounded-full transition-colors relative ${isActive('/chat') ? 'bg-accent-100 text-accent-700' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-600'}`}
                title="AI Assistant"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
              </Link>
            )}

            {/* Saved Products Icon (local) */}
            {(() => {
              const { saved } = useSavedProducts();
              return (
                <Link
                  to="/profile"
                  className="p-2.5 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors relative group"
                  title="Saved Products"
                  aria-label={`Saved Products (${saved.length})`}
                >
                  <svg className={`w-6 h-6 transition-colors ${saved.length > 0 ? 'text-red-500' : 'text-gray-400 group-hover:text-red-600'}`} fill={saved.length > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {saved.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow">{saved.length}</span>
                  )}
                </Link>
              );
            })()}

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* Profile / Login */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`flex items-center space-x-2 pl-1 pr-3 py-1 rounded-full border transition-all ${isActive('/profile') ? 'border-brand-200 bg-brand-50' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-xs shadow-md overflow-hidden">
                  {user && user.picture ? (
                    <img src={user.picture} alt={user.name || user.email || 'User'} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    (user && user.given_name && user.family_name
                      ? `${user.given_name[0] || ''}${user.family_name[0] || ''}`.toUpperCase()
                      : user && user.name
                        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                        : 'U')
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-gray-900 leading-none">{user && user.given_name ? user.given_name : 'Member'}</div>
                  <div className="text-[10px] text-gray-500 leading-none mt-0.5">Member</div>
                </div>
              </Link>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="flex items-center space-x-2 pl-1 pr-3 py-1 rounded-full border border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-600"
              >
                <div className="w-8 h-8 rounded-full bg-brand-900 text-white flex items-center justify-center font-bold text-xs shadow-md">?</div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-gray-900 leading-none">Login</div>
                  <div className="text-[10px] text-gray-500 leading-none mt-0.5">Required</div>
                </div>
              </button>
            )}

            {/* Sign Up */}
            <Link
              to="/signup"
              className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link
                to="/chat"
                className="p-2 text-gray-600 hover:text-accent-500 bg-gray-50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-brand-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 bg-gray-800/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`md:hidden fixed top-0 right-0 z-50 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-serif font-bold text-xl text-brand-900">Menu</h3>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-brand-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Mobile Nav Links */}
          <div className="space-y-1">
            <div className="py-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Products</p>
              {NAV_LINKS.products.map((cat: any, i) => (
                <div key={i} className="mb-4">
                  <p className="flex items-center text-brand-800 font-bold mb-2">
                    <svg className="w-4 h-4 mr-2 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} /></svg>
                    {cat.category}
                  </p>
                  <div className="pl-6 space-y-2 border-l-2 border-gray-100 ml-2">
                    {/* {cat.items.map((item, j) => (
                      <Link key={j} to="/marketplace" className="block text-sm text-gray-500 hover:text-brand-600 w-full">
                        {item}
                      </Link>
                    ))} */}
                  </div>
                </div>
              ))}
            </div>

            <div className="py-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-4">Tools & Resources</p>
              {NAV_LINKS.tools.map((tool, i) => (
                <Link key={i} to="/tools" className="flex items-center w-full py-2 text-gray-700 hover:text-brand-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} /></svg>
                  {tool.name}
                </Link>
              ))}
            </div>

            <div className="py-2 border-t border-gray-100">
              <Link to="/blog" className="flex items-center w-full py-3 font-bold text-brand-900">
                Blog & Insights
              </Link>
              <Link to="/about" className="flex items-center w-full py-3 font-bold text-brand-900">
                About Us
              </Link>
              <Link to="/institutions" className="flex items-center w-full py-3 font-bold text-brand-900">
                For Institutions
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <Link to="/signup" className="block w-full text-center bg-brand-600 text-white py-3 rounded-xl font-bold shadow-md">
              Get Started
            </Link>
            {isAuthenticated ? (
              <Link to="/profile" className="block w-full text-center bg-white border border-gray-200 text-brand-900 py-3 rounded-xl font-bold hover:bg-gray-50">
                Member Login
              </Link>
            ) : (
              <button onClick={() => loginWithRedirect()} className="block w-full text-center bg-white border border-gray-200 text-brand-900 py-3 rounded-xl font-bold hover:bg-gray-50">
                Member Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

