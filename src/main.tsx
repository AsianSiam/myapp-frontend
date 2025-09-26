import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from "sonner"
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <CurrencyProvider>
          <LanguageProvider>
            <QueryClientProvider client={queryClient}>
              <Auth0ProviderWithNavigate>
                <CartProvider>
                  <AppRoutes />
                  <Toaster visibleToasts={1} position='top-right' richColors />
                </CartProvider>
              </Auth0ProviderWithNavigate>
            </QueryClientProvider>
          </LanguageProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
