// Test login without OAuth (issue #49, docs 4.7). The backend registers these endpoints only
// when ENABLE_TEST_LOGIN is on; VITE_ENABLE_TEST_LOGIN shows the menu on the login page.

import type { Role } from '../auth/roles'
import { apiGet, apiPost } from './client'

export const TEST_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_TEST_LOGIN === 'true'

export interface TestUser {
  username: string
  name: string
  role: Role
}

export function getTestUsers(signal?: AbortSignal): Promise<TestUser[]> {
  return apiGet<TestUser[]>('/api/auth/test-login/', signal)
}

export function testLogin(username: string): Promise<TestUser> {
  return apiPost<TestUser>('/api/auth/test-login/', { username })
}

export function testLogout(): Promise<void> {
  return apiPost<void>('/api/auth/test-logout/')
}
