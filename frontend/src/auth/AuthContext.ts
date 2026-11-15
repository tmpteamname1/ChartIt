import { createContext, useContext } from 'react'
import type { Role } from './roles'

export interface User {
  id: number
  // Full name, or the e-mail when the account has no name.
  name: string
  email: string
  role: Role
}

// 'loading' until GET /api/auth/me/ answers, so the UI never flickers between states (NF-05).
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  status: AuthStatus
  user: User | null
  // Real session login as a seeded test user (#49), only when VITE_ENABLE_TEST_LOGIN is on.
  loginAsTestUser: (username: string) => Promise<User>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
