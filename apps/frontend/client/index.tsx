import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { OpenAPI as ProductAPI } from './services/products';
import { OpenAPI as ChatAPI } from './services/chat';

export const config = (window as any).config;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

ProductAPI.BASE = `${config.API_BASE_URL}/product-srv`;
ChatAPI.BASE = `${config.API_BASE_URL}/chat`;

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
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);