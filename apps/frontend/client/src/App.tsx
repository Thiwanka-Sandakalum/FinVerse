import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Paper, Text, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';


import { ComparisonProvider } from './context/ComparisonContext';
import AppShellLayout from './components/AppShellLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';


function App() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <Container size="sm" py="xl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper p="xl" shadow="md" radius="md" style={{ textAlign: 'center' }}>
          <Loader size="lg" mb="md" />
          <Text size="lg">Initializing FinVerse...</Text>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="sm" py="xl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Authentication Error"
          color="red"
          radius="md"
        >
          <Text mb="md">{error.message}</Text>
          <Text size="sm" c="dimmed">
            Please check your Auth0 configuration in the .env file or try refreshing the page.
          </Text>
        </Alert>
      </Container>
    );
  }

  return (
    <ComparisonProvider>
      <AppShellLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppShellLayout>
    </ComparisonProvider>
  );
}

export default App;
