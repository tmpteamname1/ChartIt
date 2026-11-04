import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type User } from './AuthContext'
import { ROLE_LABELS, ROLES, type Role } from './roles'

// Temporary: the role is kept in the browser so the layouts can be tried out before OAuth exists.
const STORAGE_KEY = 'chartit.fakeRole'

function readStoredUser(): User | null {
  try {
    const role = localStorage.getItem(STORAGE_KEY) as Role | null
    return role && ROLES.includes(role) ? { name: `Test ${ROLE_LABELS[role]}`, role } : null
  } catch {
    return null
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)

  const value = useMemo(
    () => ({
      user,
      loginAs: (role: Role) => {
        try {
          localStorage.setItem(STORAGE_KEY, role)
        } catch {
          // Storage can be blocked; the role then lasts until reload.
        }
        setUser({ name: `Test ${ROLE_LABELS[role]}`, role })
      },
      logout: () => {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          // Ignored, see above.
        }
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
