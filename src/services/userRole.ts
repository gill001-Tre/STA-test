/**
 * ============================================
 * USER ROLE SERVICE
 * ============================================
 * 
 * Manages user roles stored in Azure Table Storage.
 * NOT in Entra ID - custom roles only.
 */

import { tableStorageService, UserRoleEntity } from './tableStorage';
import { AuthUser } from './swaAuth';

export type UserRole = 'CTIO' | 'HeadOfDepartment' | 'Teamchef' | 'Employee';

export const ROLES: Record<string, UserRole> = {
  CTIO: 'CTIO',
  HEAD_OF_DEPARTMENT: 'HeadOfDepartment',
  TEAM_CHIEF: 'Teamchef',
  EMPLOYEE: 'Employee'
};

export interface RoleInfo {
  title: string;
  fullTitle: string;
  description: string;
  level: number;
}

export const ROLE_INFO: Record<UserRole, RoleInfo> = {
  CTIO: {
    title: 'CTIO',
    fullTitle: 'Chief Technology & Innovation Officer',
    description: 'Executive leadership with full system access',
    level: 4
  },
  HeadOfDepartment: {
    title: 'Head of Department',
    fullTitle: 'Head of Department',
    description: 'Department leadership with department-wide access',
    level: 3
  },
  Teamchef: {
    title: 'Team Chief',
    fullTitle: 'Team Chief',
    description: 'Team leadership with team-level access',
    level: 2
  },
  Employee: {
    title: 'Employee',
    fullTitle: 'Employee',
    description: 'Standard employee access',
    level: 1
  }
};

const PARTITION_KEY = 'UserRoles';

class UserRoleService {
  /**
   * Check if user exists in role table
   */
  async userExists(userId: string): Promise<boolean> {
    const entity = await tableStorageService.getEntity(PARTITION_KEY, userId);
    return entity !== null;
  }

  /**
   * Get user's role from storage
   */
  async getUserRole(userId: string): Promise<UserRoleEntity | null> {
    return await tableStorageService.getEntity(PARTITION_KEY, userId);
  }

  /**
   * Save user's role to storage
   */
  async saveUserRole(userId: string, role: UserRole, userInfo: Partial<AuthUser>): Promise<boolean> {
    const now = new Date().toISOString();
    
    // Check if exists to preserve CreatedAt
    const existing = await tableStorageService.getEntity(PARTITION_KEY, userId);

    const entity: UserRoleEntity = {
      PartitionKey: PARTITION_KEY,
      RowKey: userId,
      Role: role,
      Email: userInfo.email || '',
      DisplayName: userInfo.displayName || '',
      CreatedAt: existing?.CreatedAt || now,
      UpdatedAt: now
    };

    return await tableStorageService.upsertEntity(entity);
  }

  /**
   * Get role display info
   */
  getRoleInfo(role: UserRole): RoleInfo {
    return ROLE_INFO[role] || ROLE_INFO.Employee;
  }

  /**
   * Check if user has minimum role level
   */
  hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const userLevel = ROLE_INFO[userRole]?.level || 0;
    const requiredLevel = ROLE_INFO[requiredRole]?.level || 0;
    return userLevel >= requiredLevel;
  }
}

export const userRoleService = new UserRoleService();
export default UserRoleService;
