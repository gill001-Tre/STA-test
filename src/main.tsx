import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MsalProvider } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './config/config'
import { AuthProvider } from './contexts/AuthContext'
import { YearProvider } from './contexts/YearContext'
import App from './App'
import './index.css'

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <YearProvider>
          <App />
        </YearProvider>
      </AuthProvider>
    </MsalProvider>
  </StrictMode>,
)
