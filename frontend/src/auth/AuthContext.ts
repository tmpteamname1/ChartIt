import { createContext, useContext } from 'react'
import type { Role } from './roles'

export interface User {
  name: string
  role: Role
}

export interface AuthContextValue {
  user: User | null
  // TODO: replace with the OAuth login from the auth epic; for now any role can be picked.
  loginAs: (role: Role) => void
  // Real session login as a seeded test user (#49), only when VITE_ENABLE_TEST_LOGIN is on.
  loginAsTestUser: (username: string) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
