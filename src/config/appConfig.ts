/**
 * ============================================
 * APPLICATION CONFIGURATION
 * ============================================
 *
 * Configure your Azure Table Storage connection here.
 * Environment variables are set in Azure Static Web Apps Configuration.
 */

export const CONFIG = {
  // ============================================
  // DEMO MODE
  // ============================================
  // Automatically uses demo mode on localhost, production mode on Azure
  DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true' || typeof window !== 'undefined' && window.location.hostname === 'localhost',

  // ============================================
  // AZURE TABLE STORAGE CONFIGURATION
  // ============================================
  AZURE_STORAGE: {
    // Storage account name (set in Azure: VITE_STORAGE_ACCOUNT_NAME)
    accountName: import.meta.env.VITE_STORAGE_ACCOUNT_NAME || '',
    
    // SAS token with Table permissions (set in Azure: VITE_STORAGE_SAS_TOKEN)
    sasToken: import.meta.env.VITE_STORAGE_SAS_TOKEN || '',

    // Table for user roles
    userRolesTable: import.meta.env.VITE_STORAGE_TABLE_NAME || 'UserRoles'
  },

  // ============================================
  // APP SETTINGS
  // ============================================
  APP: {
    name: 'Tre Strategy Tracker',
    showDebugInfo: import.meta.env.DEV,
  }
};

export function isConfigValid(): boolean {
  if (CONFIG.DEMO_MODE) return true;
  return !!(CONFIG.AZURE_STORAGE.accountName && CONFIG.AZURE_STORAGE.sasToken);
}
