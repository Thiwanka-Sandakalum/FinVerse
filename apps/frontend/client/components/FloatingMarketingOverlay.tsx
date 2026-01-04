import React from 'react';

const FloatingMarketingOverlay: React.FC<{ loginWithRedirect: () => void }> = ({ loginWithRedirect }) => {
    const [visible, setVisible] = React.useState(true);
    if (!visible) return null;
    return (
        <div className="fixed bottom-28 right-10 z-50 max-w-xs w-full bg-white border border-accent-200 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center animate-fade-in">
            <button
                onClick={() => setVisible(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 rounded-full p-1 focus:outline-none"
                aria-label="Close"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-lg font-bold text-brand-900 mb-1">Unlock More Features!</h3>
            <p className="text-gray-700 mb-3 text-sm">Sign up or log in to access premium features like product comparison, AI chat assistant, and your personalized profile dashboard.</p>
            <button
                onClick={loginWithRedirect}
                className="px-6 py-2 bg-brand-600 text-white font-bold rounded-full shadow hover:bg-brand-700 transition-colors text-sm"
            >
                Get Started Free
            </button>
        </div>
    );
};

export default FloatingMarketingOverlay;
