import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import InstitutionsPage from './pages/InstitutionsPage';
import SignupPage from './pages/SignupPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ChatPage from './pages/ChatPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ToolsPage from './pages/ToolsPage';
import ComparisonView from './components/ComparisonView';
import AdModal from './components/AdModal';
import ComparisonBar from './components/ComparisonBar';
import ProtectedRoute from './components/ProtectedRoute';
import { ComparisonProvider } from './context/ComparisonContext';
import { ChatProvider } from './context/ChatContext';
import { useAuth0 } from '@auth0/auth0-react';
import { OpenAPI as ProductAPI } from './services/products';
import { OpenAPI as ChatAPI } from './services/chat';
import { SavedProductsProvider } from './context/SavedProductsContext';

const App: React.FC = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    const tokenFn = async () => {
      try {
        return await getAccessTokenSilently();
      } catch {
        return undefined;
      }
    };
    ProductAPI.TOKEN = tokenFn;
    ChatAPI.TOKEN = tokenFn;
  }, [isAuthenticated]);

  return (
    <SavedProductsProvider>
      <ComparisonProvider>
        <ChatProvider>
          <MainLayout>
            <AdModal />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/institutions" element={<InstitutionsPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:blogId" element={<BlogPostPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/compare" element={<ComparisonView />} />
            </Routes>
            <ComparisonBar onCompare={() => { }} />
          </MainLayout>
        </ChatProvider>
      </ComparisonProvider>
    </SavedProductsProvider>
  );
};

export default App;
