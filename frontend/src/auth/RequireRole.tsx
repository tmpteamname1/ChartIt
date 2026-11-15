import { Navigate, Outlet, useLocation } from 'react-router'
import PageLoader from '../components/PageLoader'
import ForbiddenPage from '../pages/errors/ForbiddenPage'
import { useAuth } from './AuthContext'
import type { Role } from './roles'

// Protected route: a visitor goes to /prijava and comes back here after logging in.
// Without roles any logged-in user may enter.
// Hiding pages in the UI is not protection; the API checks permissions again (4.6).
function RequireRole({ roles }: { roles?: Role[] }) {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <PageLoader />
  if (!user) {
    const from = location.pathname + location.search
    return <Navigate to="/prijava" replace state={{ from }} />
  }
  if (roles && !roles.includes(user.role)) return <ForbiddenPage />
  return <Outlet />
}

export default RequireRole
