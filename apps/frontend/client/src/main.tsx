import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Auth0Provider } from '@auth0/auth0-react';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';

import './index.css';
import './styles/animations.css';
import App from './App.tsx';
import { theme, globalStyles } from './theme';
import AuthTokenProvider from './utils/AuthTokenProvider.tsx';

const config = (window as any).FINVERSE_CONFIG || {};
const domain = config.AUTH0_DOMAIN;
const clientId = config.AUTH0_CLIENT_ID;


// Inject global styles
const styleElement = document.createElement('style');
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);


// Mount React app
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <BrowserRouter>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications position="top-right" />
            <AuthTokenProvider>
              <App />
            </AuthTokenProvider>
          </ModalsProvider>
        </MantineProvider>
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);
