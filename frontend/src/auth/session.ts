import type { QueryClient } from '@tanstack/react-query'
import type { CurrentUser } from '../api/auth'

// Query key of GET /api/auth/me/. The login state is not stored in the browser; the server
// session decides (4.4.3).
export const ME_KEY = ['auth', 'me'] as const

// ID of the logged-in user, read once a running login check has answered.
// The session cookie is shared by all tabs, so a login as someone else in another tab changes
// the user of this tab too. On return to the tab the login check and the refetches of other
// queries start together; a query whose answer depends on the user waits for this first.
export async function confirmedUserId(queryClient: QueryClient): Promise<number | null> {
  // Let every refetch of the same focus or reconnect event start, the login check included.
  await Promise.resolve()
  return new Promise((resolve) => {
    const unsubscribe = queryClient.getQueryCache().subscribe(check)
    check()

    function check() {
      const state = queryClient.getQueryState<CurrentUser | null>(ME_KEY)
      if (state && state.fetchStatus !== 'idle') return
      unsubscribe()
      resolve(state?.data?.id ?? null)
    }
  })
}
