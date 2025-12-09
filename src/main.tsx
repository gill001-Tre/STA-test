import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { YearProvider } from './contexts/YearContext';
import App from './App';
import './index.css';

// NO MSAL - Using Azure Static Web Apps built-in authentication
// Authentication is handled by /.auth/* endpoints

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <YearProvider>
        <App />
      </YearProvider>
    </AuthProvider>
  </StrictMode>,
);
