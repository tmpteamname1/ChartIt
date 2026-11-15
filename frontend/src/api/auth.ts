// Login state and logout (#44, #47) and the test login without OAuth (#49, docs 4.7).

import type { Role } from '../auth/roles'
import { ApiError, apiGet, apiPost, readCookie } from './client'

// GET /api/auth/me/
export interface CurrentUser {
  id: number
  first_name: string
  last_name: string
  email: string
  role: Role
}

// Returns null when nobody is logged in (401); other errors are thrown.
export async function getCurrentUser(signal?: AbortSignal): Promise<CurrentUser | null> {
  try {
    return await apiGet<CurrentUser>('/api/auth/me/', signal)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null
    throw err
  }
}

// Ends the server session. Works for Google and test logins alike.
export function logout(): Promise<void> {
  return apiPost<void>('/api/auth/logout/')
}

// Starts the Google login (ADR-06, sequence diagram in 4.4.3). It must be a real form submit,
// not fetch: the backend answers with a redirect that takes the browser to Google. After the
// login Google and the backend send the browser back to returnTo.
export function startGoogleLogin(returnTo: string) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = '/_allauth/browser/v1/auth/provider/redirect'
  const fields = {
    provider: 'google',
    process: 'login',
    // Absolute: locally the Google callback is handled on Django's port, not on Vite's.
    callback_url: new URL(returnTo, window.location.origin).href,
    // Set by GET /api/auth/me/, read now because it changes on every login.
    csrfmiddlewaretoken: readCookie('csrftoken') ?? '',
  }
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.append(input)
  }
  document.body.append(form)
  form.submit()
}

// Test login: the backend registers these endpoints only when ENABLE_TEST_LOGIN is on;
// VITE_ENABLE_TEST_LOGIN shows the menu on the login page.
// Case-insensitive, like ENABLE_TEST_LOGIN in Django, so both can be written as True in .env.
export const TEST_LOGIN_ENABLED = import.meta.env.VITE_ENABLE_TEST_LOGIN?.toLowerCase() === 'true'

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
