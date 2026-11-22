import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, type ReactNode } from 'react'
import { getCurrentUser, logout, testLogin, type CurrentUser } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'
import { AuthContext, type AuthContextValue, type AuthStatus, type User } from './AuthContext'
import { ME_KEY } from './session'

function toUser({ id, first_name, last_name, email, role }: CurrentUser): User {
  const name = `${first_name} ${last_name}`.trim()
  return { id, name: name || email, email, role }
}

// Data of the previous user must not stay in the cache for the next one.
function resetSession(queryClient: QueryClient) {
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== ME_KEY[0] })
  queryClient.setQueryData(ME_KEY, null)
}

function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: ME_KEY,
    queryFn: ({ signal }) => getCurrentUser(signal),
    // Login and logout in this tab update it here, and a 401 below resets it.
    staleTime: Infinity,
    // Login or logout in another tab: checked again when the user comes back to this one.
    // Runs in the background, so the page does not show the loader again.
    refetchOnWindowFocus: 'always',
    // If the server cannot be reached, the app continues as for a visitor.
    retry: 1,
  })

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (queryClient.getQueryData(ME_KEY)) resetSession(queryClient)
    })
    return () => setUnauthorizedHandler(null)
  }, [queryClient])

  const value = useMemo<AuthContextValue>(() => {
    const user = data ? toUser(data) : null
    const status: AuthStatus = isPending ? 'loading' : user ? 'authenticated' : 'anonymous'
    return {
      status,
      user,
      loginAsTestUser: async (username: string) => {
        await testLogin(username)
        resetSession(queryClient)
        const me = await queryClient.fetchQuery({
          queryKey: ME_KEY,
          queryFn: () => getCurrentUser(),
        })
        if (!me) throw new Error('Test login did not create a session')
        return toUser(me)
      },
      logout: async () => {
        try {
          await logout()
        } finally {
          resetSession(queryClient)
        }
      },
    }
  }, [data, isPending, queryClient])

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
