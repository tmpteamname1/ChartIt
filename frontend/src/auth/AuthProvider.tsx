import { useQuery, useQueryClient, type Query, type QueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, type ReactNode } from 'react'
import { getCurrentUser, logout, testLogin, type CurrentUser } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'
import { AuthContext, type AuthContextValue, type AuthStatus, type User } from './AuthContext'

// The login state is not stored in the browser; the server session decides (4.4.3).
const ME_KEY = ['auth', 'me'] as const

function toUser({ id, first_name, last_name, email, role }: CurrentUser): User {
  const name = `${first_name} ${last_name}`.trim()
  return { id, name: name || email, email, role }
}

// Every query except the login check holds data loaded for the current user.
const userData = { predicate: (query: Query) => query.queryKey[0] !== ME_KEY[0] }

// Data of the previous user must not stay in the cache for the next one.
function resetSession(queryClient: QueryClient) {
  queryClient.removeQueries(userData)
  queryClient.setQueryData(ME_KEY, null)
}

// The session cookie is shared by all tabs, so a login or logout in another tab changes the
// user of this one. When the check answers with another user (or nobody), the previous user's
// data is cleared before the new user is set, including a list that reached the cache while
// the check was running. Reset, not remove: an open page keeps its query and loads it again
// for the new session, while removing would leave it showing the removed data.
async function checkCurrentUser(queryClient: QueryClient, signal: AbortSignal) {
  const user = await getCurrentUser(signal)
  const previous = queryClient.getQueryData<CurrentUser | null>(ME_KEY)
  if (previous && previous.id !== user?.id) void queryClient.resetQueries(userData)
  return user
}

function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: ME_KEY,
    queryFn: ({ signal }) => checkCurrentUser(queryClient, signal),
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
