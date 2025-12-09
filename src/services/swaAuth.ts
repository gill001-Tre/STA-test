/**
 * ============================================
 * AZURE STATIC WEB APPS AUTHENTICATION SERVICE
 * ============================================
 * 
 * Uses Azure Static Web Apps built-in authentication.
 * NO MSAL, NO SDK - just the built-in /.auth/* endpoints.
 * 
 * Endpoints provided automatically:
 * - /.auth/login/aad     → Microsoft (Azure AD) login
 * - /.auth/me            → Get current user's identity
 * - /.auth/logout        → Log out the current user
 */

export interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims?: Array<{ typ: string; val: string }>;
}

export interface AuthUser {
  userId: string;
  displayName: string;
  email: string;
  identityProvider: string;
  isAuthenticated: boolean;
  roles: string[];
}

const DEMO_USER_KEY = 'swa_demo_user';

class SwaAuthService {
  private demoMode: boolean = false;

  constructor() {
    // Auto-enable demo mode on localhost
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      this.demoMode = true;
    }
  }

  /**
   * Check if running in demo mode (localhost)
   */
  isDemoMode(): boolean {
    return this.demoMode || localStorage.getItem(DEMO_USER_KEY) !== null;
  }

  /**
   * Get login URL for Microsoft authentication
   */
  getLoginUrl(redirectUrl: string = '/'): string {
    return `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }

  /**
   * Get logout URL
   */
  getLogoutUrl(redirectUrl: string = '/'): string {
    return `/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(redirectUrl)}`;
  }

  /**
   * Redirect to Microsoft login
   * In demo mode, creates a mock user
   */
  login(): void {
    if (this.isDemoMode()) {
      // Demo mode: create mock user and reload
      const mockUser: AuthUser = {
        userId: 'demo-' + Math.random().toString(36).substring(2, 9),
        displayName: 'Demo User',
        email: 'demo.user@example.com',
        identityProvider: 'demo',
        isAuthenticated: true,
        roles: ['authenticated']
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
      window.location.reload();
      return;
    }

    window.location.href = this.getLoginUrl(window.location.pathname);
  }

  /**
   * Log out the current user
   */
  logout(): void {
    if (this.isDemoMode()) {
      localStorage.removeItem(DEMO_USER_KEY);
      // Clear any demo role data
      const keys = Object.keys(localStorage).filter(k => k.startsWith('demo'));
      keys.forEach(k => localStorage.removeItem(k));
      window.location.reload();
      return;
    }

    window.location.href = this.getLogoutUrl('/');
  }

  /**
   * Get the current user from /.auth/me endpoint
   * In demo mode, returns mock user from localStorage
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    // Check for demo user first
    const demoUserStr = localStorage.getItem(DEMO_USER_KEY);
    if (demoUserStr) {
      try {
        return JSON.parse(demoUserStr);
      } catch {
        localStorage.removeItem(DEMO_USER_KEY);
      }
    }

    // If in demo mode but no user, return null
    if (this.demoMode) {
      return null;
    }

    try {
      const response = await fetch('/.auth/me', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const principal: ClientPrincipal | null = data.clientPrincipal;

      if (!principal) {
        return null;
      }

      // Extract email from claims
      let email = '';
      if (principal.claims) {
        const emailClaim = principal.claims.find(c =>
          c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' ||
          c.typ === 'emails' ||
          c.typ === 'email' ||
          c.typ === 'preferred_username'
        );
        if (emailClaim) {
          email = emailClaim.val;
        }
      }

      // Fallback: userDetails might be email
      if (!email && principal.userDetails?.includes('@')) {
        email = principal.userDetails;
      }

      return {
        userId: principal.userId,
        displayName: principal.userDetails || email || 'User',
        email: email,
        identityProvider: principal.identityProvider,
        isAuthenticated: true,
        roles: principal.userRoles || ['authenticated']
      };

    } catch (error) {
      console.error('[SwaAuth] Error fetching user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null && user.isAuthenticated;
  }
}

export const swaAuthService = new SwaAuthService();
export default SwaAuthService;
