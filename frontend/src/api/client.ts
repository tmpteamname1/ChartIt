// Relative URLs: the Vite proxy (dev) and Django (production) serve /api on the same origin.

// Error body of every API endpoint (docs chapter 4.9).
interface ApiErrorBody {
  detail: string
  code: string
  errors: Record<string, string[]> | null
}

export class ApiError extends Error {
  readonly status: number
  // Stable machine code from the error body, 'error' when the response had none (e.g. a plain 500).
  readonly code: string
  // Per-field messages, only for validation errors.
  readonly errors: Record<string, string[]> | null

  constructor(
    status: number,
    message: string,
    code = 'error',
    errors: Record<string, string[]> | null = null,
  ) {
    super(message)
    this.status = status
    this.code = code
    this.errors = errors
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await request('GET', path, { signal, headers: { Accept: 'application/json' } })
  return response.json() as Promise<T>
}

// Returns undefined for an empty response (204 No Content).
export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  const response = await request('POST', path, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // Django rejects changes from a logged-in session without the token (docs 4.9).
      'X-CSRFToken': readCookie('csrftoken') ?? '',
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
  return (response.status === 204 ? undefined : response.json()) as Promise<T>
}

async function request(method: string, path: string, init: RequestInit): Promise<Response> {
  const response = await fetch(path, { ...init, method })
  if (!response.ok) {
    const body = await readErrorBody(response)
    throw new ApiError(
      response.status,
      body?.detail ?? `${method} ${path} failed with ${response.status}`,
      body?.code,
      body?.errors ?? null,
    )
  }
  return response
}

// The token changes on login, so it is read for every request.
function readCookie(name: string): string | null {
  const prefix = `${name}=`
  const cookie = document.cookie.split('; ').find((part) => part.startsWith(prefix))
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

async function readErrorBody(response: Response): Promise<ApiErrorBody | null> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object' && 'code' in body && 'detail' in body) {
      return body as ApiErrorBody
    }
  } catch {
    // Not JSON, e.g. an HTML error page from a proxy.
  }
  return null
}

// Builds "?a=1&b=2" from an object, leaving out undefined, null and empty values.
export function toQueryString(params: object): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, String(value))
    }
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}
