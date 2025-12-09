import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { swaAuthService, AuthUser } from '@/services/swaAuth';
import { userRoleService, UserRole, ROLE_INFO } from '@/services/userRole';

export type { UserRole } from '@/services/userRole';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loading: boolean;
  needsRoleSelection: boolean;
  login: () => void;
  logout: () => void;
  selectRole: (role: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [swaUser, setSwaUser] = useState<AuthUser | null>(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    try {
      // Get user from SWA /.auth/me (or demo mode)
      const authUser = await swaAuthService.getCurrentUser();
      
      if (!authUser) {
        // Not authenticated
        setUser(null);
        setLoading(false);
        return;
      }

      setSwaUser(authUser);

      // Check if user has a role in Table Storage
      const roleEntity = await userRoleService.getUserRole(authUser.userId);
      
      if (!roleEntity) {
        // First-time user - needs to select role
        setNeedsRoleSelection(true);
        setLoading(false);
        return;
      }

      // Returning user - load their role
      const appUser: User = {
        id: authUser.userId,
        name: authUser.displayName,
        email: authUser.email,
        role: roleEntity.Role as UserRole,
        avatar: authUser.displayName.substring(0, 2).toUpperCase()
      };

      setUser(appUser);
      setNeedsRoleSelection(false);

    } catch (error) {
      console.error('[AuthContext] Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    swaAuthService.login();
  };

  const logout = () => {
    setUser(null);
    setSwaUser(null);
    setNeedsRoleSelection(false);
    swaAuthService.logout();
  };

  const selectRole = async (role: UserRole) => {
    if (!swaUser) return;

    try {
      // Save role to Table Storage
      await userRoleService.saveUserRole(swaUser.userId, role, {
        email: swaUser.email,
        displayName: swaUser.displayName
      });

      // Set user with selected role
      const appUser: User = {
        id: swaUser.userId,
        name: swaUser.displayName,
        email: swaUser.email,
        role: role,
        avatar: swaUser.displayName.substring(0, 2).toUpperCase()
      };

      setUser(appUser);
      setNeedsRoleSelection(false);

    } catch (error) {
      console.error('[AuthContext] Error saving role:', error);
      throw error;
    }
  };

  const switchRole = async (role: UserRole) => {
    if (!user || !swaUser) return;

    try {
      await userRoleService.saveUserRole(swaUser.userId, role, {
        email: swaUser.email,
        displayName: swaUser.displayName
      });

      setUser({ ...user, role });

    } catch (error) {
      console.error('[AuthContext] Error switching role:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        needsRoleSelection,
        login,
        logout,
        selectRole,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Export role info for UI
export { ROLE_INFO } from '@/services/userRole';
