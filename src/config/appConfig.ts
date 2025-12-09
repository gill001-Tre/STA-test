/**
 * ============================================
 * APPLICATION CONFIGURATION
 * ============================================
 * 
 * Configure your Azure Table Storage connection here.
 * Set by the developer, NOT by end users.
 */

export const CONFIG = {
  // ============================================
  // DEMO MODE
  // ============================================
  // Set to true for local testing without Azure
  // Set to false for production
  DEMO_MODE: true,  // Change to false for production

  // ============================================
  // AZURE TABLE STORAGE CONFIGURATION
  // ============================================
  AZURE_STORAGE: {
    // Storage account name
    accountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || '',
    
    // SAS token with Table permissions
    sasToken: import.meta.env.VITE_AZURE_STORAGE_SAS || '',
    
    // Table for user roles
    userRolesTable: 'UserRoles'
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
