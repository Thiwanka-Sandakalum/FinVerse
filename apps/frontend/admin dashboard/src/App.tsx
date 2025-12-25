import { Routes, Route, Navigate } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'

import { DummyDataProvider } from './context/DummyDataContext'
import { UIProvider } from './context/UIContext'
import DashboardLayout from './layout/DashboardLayout'
import ThemeProvider from './layout/ThemeProvider'
import { SuperAdminRoute, OrgAdminRoute, MemberRoute } from './components/guards/ProtectedRoute'
import AccessDenied from './pages/errors/AccessDenied'
import Analytics from './pages/analytics/Analytics'
import Dashboard from './pages/dashboard/Dashboard'
import CreateOrganization from './pages/organizations/CreateOrganization'
import OrganizationDetails from './pages/organizations/OrganizationDetails'
import OrganizationsList from './pages/organizations/OrganizationsList'
import CreateProduct from './pages/products/CreateProduct'
import EditProduct from './pages/products/EditProduct'
import ProductDetails from './pages/products/ProductDetails'
import ProductsList from './pages/products/ProductsList'
import Settings from './pages/settings/Settings'
import CreateUser from './pages/users/CreateUser'
import UsersList from './pages/users/UsersList'
import OrganizationProfile from './pages/profile/OrganizationProfile'
import UserProfile from './pages/profile/UserProfile'
import AuthWrapper from './components/AuthWrapper'

function App() {
  return (
    <MantineProvider>
      <UIProvider>
        <ThemeProvider>
          <ModalsProvider>
            <AuthWrapper>
              <DummyDataProvider>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/access-denied" element={<AccessDenied />} />
                  <Route path="/" element={<DashboardLayout />}>
                    {/* Dashboard - accessible to all authenticated users */}
                    <Route path="dashboard" element={
                      <MemberRoute>
                        <Dashboard />
                      </MemberRoute>
                    } />

                    {/* Organizations - super_admin and org_admin only */}
                    <Route path="organizations" element={
                      <OrgAdminRoute>
                        <OrganizationsList />
                      </OrgAdminRoute>
                    } />
                    <Route path="organizations/:id" element={
                      <OrgAdminRoute>
                        <OrganizationDetails />
                      </OrgAdminRoute>
                    } />
                    <Route path="organizations/create" element={
                      <SuperAdminRoute>
                        <CreateOrganization />
                      </SuperAdminRoute>
                    } />

                    {/* Users - super_admin and org_admin only */}
                    <Route path="users" element={
                      <OrgAdminRoute>
                        <UsersList />
                      </OrgAdminRoute>
                    } />
                    <Route path="users/create" element={
                      <OrgAdminRoute>
                        <CreateUser />
                      </OrgAdminRoute>
                    } />

                    {/* Products - accessible to all roles */}
                    <Route path="products" element={
                      <MemberRoute>
                        <ProductsList />
                      </MemberRoute>
                    } />
                    <Route path="products/:id" element={
                      <MemberRoute>
                        <ProductDetails />
                      </MemberRoute>
                    } />
                    <Route path="products/create" element={
                      <MemberRoute>
                        <CreateProduct />
                      </MemberRoute>
                    } />
                    <Route path="products/:id/edit" element={
                      <MemberRoute>
                        <EditProduct />
                      </MemberRoute>
                    } />

                    {/* Analytics - super_admin only */}
                    <Route path="analytics" element={
                      <SuperAdminRoute>
                        <Analytics />
                      </SuperAdminRoute>
                    } />

                    {/* Settings - super_admin only */}
                    <Route path="settings" element={
                      <SuperAdminRoute>
                        <Settings />
                      </SuperAdminRoute>
                    } />

                    {/* Profile routes - role-based */}
                    <Route path="profile/organization" element={
                      <OrgAdminRoute>
                        <OrganizationProfile />
                      </OrgAdminRoute>
                    } />
                    <Route path="profile/user" element={
                      <MemberRoute>
                        <UserProfile />
                      </MemberRoute>
                    } />
                  </Route>
                </Routes>
              </DummyDataProvider>
            </AuthWrapper>
          </ModalsProvider>
        </ThemeProvider>
      </UIProvider>
    </MantineProvider>
  )
}

export default App
