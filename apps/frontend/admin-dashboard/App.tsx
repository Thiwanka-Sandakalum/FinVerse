import React, { } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './src/layouts/Layout';
import { Dashboard } from './src/pages/Dashboard';
import { Organizations } from './src/pages/Organizations';
import { Users } from './src/pages/Users';
import { Products } from './src/pages/Products';
import { Settings } from './src/pages/Settings';
import { ProductDetail } from './src/pages/products/ProductDetail';
import { ProductList } from './src/pages/products/ProductList';
import UserProfile from './src/pages/users/UserProfile';
import UserList from './src/pages/users/UserList';
import UserForm from './src/pages/users/UserForm';
import OrgList from './src/pages/organizations/OrgList';
import OrgForm from './src/pages/organizations/OrgForm';
import OrgProfile from './src/pages/organizations/OrgProfile';
import { useAuth0 } from '@auth0/auth0-react';
import ProductForm from './src/pages/products/ProductForm';
import OnboardingOrgForm from './src/pages/OnboardingOrgForm';
import { OnboardingGuard } from './src/pages/OnboardingGuard';
import { ProtectedRoute } from './src/components/ProtectedRoute';
import { UserRole } from './src/types/rbac.types';

function App() {
  const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuth0();

  // Redirect to login if not authenticated and not loading
  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  // Only render app if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Router>
      <Routes>
        {/* Onboarding route outside main layout */}
        <Route path="/onboarding" >
          <Route index element={<OnboardingOrgForm />} />
        </Route>
        {/* Main app routes, protected by onboarding guard */}
        <Route
          path="/*"
          element={
            <OnboardingGuard>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/organizations"
                    element={
                      <ProtectedRoute requiredRole={[UserRole.SUPER_ADMIN]}>
                        <Organizations />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<OrgList />} />
                    <Route path="create" element={<OrgForm />} />
                    <Route path=":orgId" element={<OrgProfile />} />
                  </Route>
                  <Route
                    path="/organizations/:orgId/edit"
                    element={
                      <ProtectedRoute requiredRole={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                        <OrgForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute requiredRole={[UserRole.SUPER_ADMIN, UserRole.ORG_ADMIN]}>
                        <Users />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<UserList />} />
                    <Route path="create" element={<UserForm />} />
                    <Route path=":userId" element={<UserProfile />} />
                    <Route path=":userId/edit" element={<UserForm />} />
                  </Route>
                  <Route path="/products" element={<Products />}>
                    <Route index element={<ProductList />} />
                    <Route path=":productId" element={<ProductDetail />} />
                    <Route path="create" element={<ProductForm />} />
                    <Route path=":productId/edit" element={<ProductForm />} />
                  </Route>
                  <Route
                    path="/organization"
                    element={
                      <ProtectedRoute requiredRole={[UserRole.ORG_ADMIN]}>
                        <OrgProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </OnboardingGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
