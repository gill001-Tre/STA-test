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
      ctio: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
        canManageUsers: true,
        canAccessPages: ['/', '/must-wins', '/key-activities', '/sub-tasks', '/settings'],
      },
      head_of_department: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
        canManageUsers: false,
        canAccessPages: ['/', '/must-wins', '/key-activities', '/sub-tasks'],
      },
      team_chef: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canViewAll: true,
        canManageUsers: false,
        canAccessPages: ['/', '/must-wins', '/key-activities', '/sub-tasks'],
      },
      employee: {
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
      ctio: 'CTIO',
      head_of_department: 'HeadOf',
      team_chef: 'TeamChef',
      employee: 'Employee',
    }
    return labels[role]
  }
}

export const roleService = new RoleService()
