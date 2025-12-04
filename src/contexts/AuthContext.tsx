import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { STORAGE_KEYS, loadFromYearStorage, saveToYearStorage } from '@/utils/storageHelper'

export type UserRole = 'CTIO' | 'HeadOfDepartment' | 'Teamchef' | 'Employee'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  role: UserRole | null
  loading: boolean
  login: (email: string, name: string, role: UserRole) => void
  logout: () => void
  switchRole: (role: UserRole) => void
  switchUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Test users following the test flow (CTIO, Head of Department, Teamchef, Employee)
const MOCK_USERS: Record<string, User> = {
  'ctio@tre.se': {
    id: '1',
    name: 'CTIO',
    email: 'ctio@tre.se',
    role: 'CTIO',
    avatar: 'CT'
  },
  'hod@tre.se': {
    id: '2',
    name: 'Head of Department',
    email: 'hod@tre.se',
    role: 'HeadOfDepartment',
    avatar: 'HD'
  },
  'chef@tre.se': {
    id: '3',
    name: 'Teamchef',
    email: 'chef@tre.se',
    role: 'Teamchef',
    avatar: 'TC'
  },
  'employee@tre.se': {
    id: '4',
    name: 'Employee',
    email: 'employee@tre.se',
    role: 'Employee',
    avatar: 'EM'
  },
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from year-aware localStorage on mount
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const stored = loadFromYearStorage(STORAGE_KEYS.AUTH_USER, currentYear)
    
    if (stored) {
      try {
        setUser(stored)
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    } else {
      // Default to CTIO for development/testing
      const defaultUser = Object.values(MOCK_USERS)[0]
      setUser(defaultUser)
      saveToYearStorage(STORAGE_KEYS.AUTH_USER, defaultUser, currentYear)
    }
    setLoading(false)
  }, [])

  const login = (email: string, name: string, role: UserRole) => {
    const currentYear = new Date().getFullYear()
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      avatar: name.substring(0, 2).toUpperCase()
    }
    setUser(newUser)
    saveToYearStorage(STORAGE_KEYS.AUTH_USER, newUser, currentYear)
  }

  const logout = () => {
    const currentYear = new Date().getFullYear()
    setUser(null)
    localStorage.removeItem(`${STORAGE_KEYS.AUTH_USER}-${currentYear}`)
  }

  const switchRole = (role: UserRole) => {
    if (user) {
      const currentYear = new Date().getFullYear()
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      saveToYearStorage(STORAGE_KEYS.AUTH_USER, updatedUser, currentYear)
    }
  }

  const switchUser = (newUser: User) => {
    const currentYear = new Date().getFullYear()
    setUser(newUser)
    saveToYearStorage(STORAGE_KEYS.AUTH_USER, newUser, currentYear)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loading,
        login,
        logout,
        switchRole,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * Get all test users for development/testing
 */
export const getTestUsers = (): User[] => {
  return Object.values(MOCK_USERS)
}

/**
 * Get user by role
 */
export const getUserByRole = (role: UserRole): User | undefined => {
  return Object.values(MOCK_USERS).find(user => user.role === role)
}

export { MOCK_USERS }
