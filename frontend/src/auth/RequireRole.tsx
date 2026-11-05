import { Navigate, Outlet, useLocation } from 'react-router'
import ForbiddenPage from '../pages/errors/ForbiddenPage'
import { useAuth } from './AuthContext'
import type { Role } from './roles'

// Hiding pages in the UI is not protection; the API checks permissions again (4.6).
function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/prijava" replace state={{ from: location.pathname }} />
  if (!roles.includes(user.role)) return <ForbiddenPage />
  return <Outlet />
}

export default RequireRole
