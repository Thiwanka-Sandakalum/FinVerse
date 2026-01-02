export const config = (window as any).config;
import { OpenAPI as ProductsOpenAPI } from './src/api/products/core/OpenAPI';
import { OpenAPI as UsersOpenAPI } from './src/api/users/core/OpenAPI';

if (config?.API_BASE_URL) {
  ProductsOpenAPI.BASE = `${config.API_BASE_URL}/product-srv`;
  UsersOpenAPI.BASE = `${config.API_BASE_URL}/usermng`;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { ToastProvider } from './src/components/ui/common/Toast';
import App from './App';

function AppWithAuth0Token() {
  const { getAccessTokenSilently, isLoading } = useAuth0();

  React.useEffect(() => {
    ProductsOpenAPI.TOKEN = async () => {
      try {
        return await getAccessTokenSilently();
      } catch {
        return undefined;
      }
    };
    UsersOpenAPI.TOKEN = async () => {
      try {
        return await getAccessTokenSilently();
      } catch {
        return undefined;
      }
    };
  }, [getAccessTokenSilently]);

  if (isLoading) return null;
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.AUTH0_DOMAIN}
      clientId={config.AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: config.AUTH0_AUDIENCE,
      }}
    >
      <AppWithAuth0Token />
    </Auth0Provider>
  </React.StrictMode>
);