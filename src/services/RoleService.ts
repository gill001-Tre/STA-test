import { UserRole } from '../contexts/AuthContext'

interface RolePermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canViewAll: boolean
  canManageUsers: boolean
  canAccessPages: string[]
}

class RoleService {
  getPermissions(role: UserRole): RolePermissions {
    const permissions: Record<UserRole, RolePermissions> = {
      CTIO: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
        canManageUsers: true,
        canAccessPages: ['/', '/must-wins', '/key-activities', '/sub-tasks', '/settings'],
      },
      HeadOfDepartment: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
        canManageUsers: false,
        canAccessPages: ['/', '/must-wins', '/key-activities', '/sub-tasks'],
      },
      Teamchef: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
        canManageUsers: false,
        canAccessPages: ['/', '/must-wins', '/key-activities', '/sub-tasks'],
      },
      Employee: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canViewAll: false,
        canManageUsers: false,
        canAccessPages: ['/'],
      },
    }
    return permissions[role]
  }

  canAccessPage(role: UserRole, page: string): boolean {
    const permissions = this.getPermissions(role)
    return permissions.canAccessPages.includes(page)
  }

  canCreate(role: UserRole): boolean {
    return this.getPermissions(role).canCreate
  }

  canEdit(role: UserRole): boolean {
    return this.getPermissions(role).canEdit
  }

  canDelete(role: UserRole): boolean {
    return this.getPermissions(role).canDelete
  }

  canViewAllData(role: UserRole): boolean {
    return this.getPermissions(role).canViewAll
  }

  canManageUsers(role: UserRole): boolean {
    return this.getPermissions(role).canManageUsers
  }

  getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      CTIO: 'CTIO',
      HeadOfDepartment: 'HeadOf',
      Teamchef: 'TeamChef',
      Employee: 'Employee',
    }
    return labels[role]
  }
}

export const roleService = new RoleService()
