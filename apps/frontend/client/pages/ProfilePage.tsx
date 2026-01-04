import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import { ProductsService } from '../services/products/services/ProductsService';
import { useSavedProducts } from '../context/SavedProductsContext';
import { ProductCard } from './marketplace/ProductCard';

// Skeleton loader for product cards (copied from ProductList for consistency)
const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 w-16 bg-gray-200 rounded" />
      <div className="h-8 w-8 bg-gray-200 rounded-full" />
    </div>
    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-100 rounded mb-4" />
    <div className="h-8 w-1/3 bg-gray-200 rounded mb-4" />
    <div className="space-y-2 mb-6">
      <div className="h-4 w-5/6 bg-gray-100 rounded" />
      <div className="h-4 w-2/3 bg-gray-100 rounded" />
      <div className="h-4 w-1/2 bg-gray-100 rounded" />
    </div>
    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
      <div className="h-8 w-20 bg-gray-100 rounded" />
      <div className="h-8 w-8 bg-gray-100 rounded" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </div>
  </div>
);

interface ProfilePageProps {
  onProductSelect?: (productId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onProductSelect }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout, user } = useAuth0();
  const [financialGoal, setFinancialGoal] = useState('invest');
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [interests, setInterests] = useState(['loans', 'savings']);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Saved Products logic (now uses context)
  const { saved: savedProductIds, isSaved, add, remove } = useSavedProducts();
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  useEffect(() => {
    // Reset savedProducts when IDs change
    setSavedProducts([]);
    if (!savedProductIds || savedProductIds.length === 0) {
      setSavedLoading(false);
      return;
    }
    setSavedLoading(true);
    let isMounted = true;
    Promise.all(
      savedProductIds.map(async (id) => {
        try {
          return await ProductsService.getProducts1(id);
        } catch {
          return null;
        }
      })
    ).then(results => {
      if (isMounted) {
        setSavedProducts(results.filter(Boolean));
        setSavedLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [savedProductIds]);

  // Components for different sections
  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center text-3xl font-bold text-brand-600 border-4 border-white shadow-md overflow-hidden">
          {user && user.picture ? (
            <img
              src={user.picture}
              alt={user.name || user.email || 'User'}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>
              {user && user.given_name && user.family_name
                ? `${user.given_name[0] || ''}${user.family_name[0] || ''}`.toUpperCase()
                : user && user.name
                  ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'U'}
            </span>
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {user && (user.given_name || user.family_name)
              ? `${user.given_name || ''} ${user.family_name || ''}`.trim()
              : user && user.name
                ? user.name
                : 'User Name'}
          </h2>
          <p className="text-gray-500 mb-2">{user && user.email ? user.email : 'user@example.com'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">Individual Account</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">Verified Member</span>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Member Since</p>
          <p className="font-medium text-gray-700">September 2023</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">{savedProductIds.length}</span>
          </div>
          <p className="text-gray-500 font-medium">Saved Products</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">3</span>
          </div>
          <p className="text-gray-500 font-medium">Active Comparisons</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <span className="text-3xl font-bold text-gray-900">5</span>
          </div>
          <p className="text-gray-500 font-medium">Alerts Enabled</p>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in">
      <h3 className="font-bold text-xl text-gray-900 mb-6 pb-4 border-b border-gray-100">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
          <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <input type="email" disabled className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
          <p className="text-xs text-gray-400 mt-1">Contact support to change email</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
          <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">City / Location</label>
          <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white text-gray-900" />
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
        <button className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        <button className="px-6 py-2.5 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-sm">Save Changes</button>
      </div>
    </div>
  );

  const renderFinancialPreferences = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl flex items-start gap-3">
        <svg className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-sm text-brand-800">These preferences help our AI personalize recommendations just for you. Your data is private and secure.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="font-bold text-lg text-gray-900 mb-6">Primary Financial Goal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { id: 'save', label: 'Save Money', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'borrow', label: 'Borrow Wisely', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
            { id: 'invest', label: 'Grow Investments', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
            { id: 'manage', label: 'Manage Cash Flow', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          ].map(goal => (
            <div
              key={goal.id}
              onClick={() => setFinancialGoal(goal.id)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-3 ${financialGoal === goal.id ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-gray-100 hover:border-brand-200 hover:bg-gray-50'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${financialGoal === goal.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={goal.icon} /></svg>
              </div>
              <span className={`font-bold ${financialGoal === goal.id ? 'text-brand-900' : 'text-gray-600'}`}>{goal.label}</span>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-4">Risk Tolerance</h3>
        <div className="mb-8 px-2">
          <input
            type="range"
            min="0" max="100"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-sm font-medium text-gray-500 mt-2">
            <span>Conservative</span>
            <span>Moderate</span>
            <span>Aggressive</span>
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-4">Product Interests</h3>
        <div className="flex flex-wrap gap-3">
          {['Loans', 'Credit Cards', 'Savings', 'Fixed Deposits', 'Business Banking', 'Crypto'].map(item => (
            <label key={item} className={`inline-flex items-center px-4 py-2 rounded-full border cursor-pointer transition-all select-none ${interests.includes(item.toLowerCase()) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
              <input
                type="checkbox"
                className="hidden"
                checked={interests.includes(item.toLowerCase())}
                onChange={() => toggleInterest(item.toLowerCase())}
              />
              <span className="text-sm font-medium">{item}</span>
              {interests.includes(item.toLowerCase()) && <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </label>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button className="px-8 py-3 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-sm">Update Preferences</button>
        </div>
      </div>
    </div>
  );

  // Saved Products section (now receives data as props, no hooks inside)
  const renderSavedItems = (products: any[], loading: boolean) => (
    <div className="space-y-6 animate-fade-in">
      {/* Tabs inside Saved Items */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button className="px-6 py-2 bg-white text-gray-900 rounded-lg shadow-sm text-sm font-bold">Saved Products</button>
        <button className="px-6 py-2 text-gray-500 hover:text-gray-900 rounded-lg text-sm font-medium">Comparison Lists</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No saved products yet. Start saving products to see them here!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((apiResult, idx) => {
            const product = apiResult && apiResult.data ? apiResult.data : apiResult;
            return (
              <ProductCard
                key={product.id || idx}
                product={product}
                isInCompare={false}
                isDisabled={false}
                onCompareToggle={() => { }}
                onDetailClick={onProductSelect ? onProductSelect : () => { }}
                variant="grid"
              />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-brand-50 min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm font-medium text-gray-500">
          <span className="hover:text-brand-600 cursor-pointer">Dashboard</span>
          <span className="mx-2">/</span>
          <span className="text-brand-800">My Profile</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information, preferences, and saved items.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 sticky top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col p-2 space-y-1">
                {[
                  { id: 'overview', label: 'Profile Overview', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { id: 'info', label: 'Personal Information', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' },
                  { id: 'preferences', label: 'Financial Preferences', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
                  { id: 'saved', label: 'Saved & Comparisons', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
                  { id: 'activity', label: 'Activity Log', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
                  { id: 'security', label: 'Security & Privacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <svg className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-brand-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 mt-2 border-t border-gray-100">
                <button className="flex items-center text-red-500 text-sm font-bold hover:text-red-700 px-4" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'info' && renderPersonalInfo()}
            {activeTab === 'preferences' && renderFinancialPreferences()}
            {activeTab === 'saved' && renderSavedItems(savedProducts, savedLoading)}
            {/* Placeholders for other tabs */}
            {['activity', 'notifications', 'security'].includes(activeTab) && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 animate-fade-in">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Section Under Construction</h3>
                <p className="text-gray-500">We are currently updating this section of your profile. Please check back later.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
