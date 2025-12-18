import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from "@auth0/auth0-react"
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

import './index.css'
import App from './App.tsx'
import AuthTokenProvider from './utils/AuthTokenProvider.tsx'

// Extend window interface for TypeScript
declare global {
  interface Window {
    FINVERSE_CONFIG: {
      AUTH0_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      API_BASE_URL: string;
      AUTH0_AUDIENCE: string;
    };
  }
}

const domain = window.FINVERSE_CONFIG?.AUTH0_DOMAIN;
const clientId = window.FINVERSE_CONFIG?.AUTH0_CLIENT_ID;
const apiBaseUrl = window.FINVERSE_CONFIG?.API_BASE_URL;

if (apiBaseUrl) {
  const { authService } = await import('./services/auth.service');
  authService.setApiBaseUrl(apiBaseUrl);
}

// Validate domain format
if (!domain.includes('.auth0.com') && !domain.includes('.us.auth0.com') && !domain.includes('.eu.auth0.com') && !domain.includes('.au.auth0.com')) {
  console.warn("Auth0 domain format might be incorrect. Expected format: your-domain.auth0.com");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: window.FINVERSE_CONFIG.AUTH0_AUDIENCE, // <-- "usermng-service"
        scope: "openid profile email read:timesheets create:timesheets",
      }}
    >

      <AuthTokenProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </StrictMode>,
)
