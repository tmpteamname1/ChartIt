import { useMemo, useState, type ReactNode } from 'react'
import { TEST_LOGIN_ENABLED, testLogin, testLogout } from '../api/auth'
import { AuthContext, type User } from './AuthContext'
import { ROLE_LABELS, ROLES, type Role } from './roles'

// Temporary: the user is kept in the browser until /api/auth/me/ exists (#44).
const STORAGE_KEY = 'chartit.user'

function readStoredUser(): User | null {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as User | null
    return user && typeof user.name === 'string' && ROLES.includes(user.role) ? user : null
  } catch {
    return null
  }
}

function storeUser(user: User | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be blocked; the user then lasts until reload.
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)

  const value = useMemo(() => {
    const signIn = (next: User | null) => {
      storeUser(next)
      setUser(next)
    }
    return {
      user,
      loginAs: (role: Role) => signIn({ name: `Test ${ROLE_LABELS[role]}`, role }),
      loginAsTestUser: async (username: string) => {
        const { name, role } = await testLogin(username)
        const loggedIn = { name, role }
        signIn(loggedIn)
        return loggedIn
      },
      logout: () => {
        // Ends the server session too; errors are ignored because the browser state is cleared anyway.
        if (TEST_LOGIN_ENABLED) testLogout().catch(() => {})
        signIn(null)
      },
    }
  }, [user])

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
