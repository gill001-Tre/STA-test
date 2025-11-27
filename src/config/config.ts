// Azure AD B2C Configuration
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'YOUR_CLIENT_ID',
    authority: import.meta.env.VITE_AZURE_AUTHORITY || 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Scopes for token requests
export const loginRequest = {
  scopes: ['User.Read'],
};

// Azure Table Storage Configuration
export const azureStorageConfig = {
  accountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || 'YOUR_STORAGE_ACCOUNT',
  accountKey: import.meta.env.VITE_AZURE_STORAGE_KEY || 'YOUR_STORAGE_KEY',
  tableName: {
    strategyPillars: 'StrategyPillars',
    mustWins: 'MustWins',
    keyActivities: 'KeyActivities',
    subTasks: 'SubTasks',
    users: 'Users',
    kpis: 'KPIs',
  },
};

// App Configuration
export const appConfig = {
  appName: 'Tre Strategy Tracker',
  defaultYear: new Date().getFullYear(),
  progressThresholds: {
    onTrack: 60,
    inProgress: 30,
    needsAttention: 29,
  },
};
