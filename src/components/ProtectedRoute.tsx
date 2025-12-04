import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, UserRole } from '../contexts/AuthContext'
import { roleService } from '../services/RoleService'

interface ProtectedRouteProps {
  component: React.ComponentType<any>
  allowedRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  allowedRoles,
}) => {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500">Your role: {roleService.getRoleLabel(role)}</p>
        </div>
      </div>
    )
  }

  return <Component />
}
