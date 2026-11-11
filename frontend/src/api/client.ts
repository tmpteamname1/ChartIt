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
  const response = await fetch(path, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) {
    const body = await readErrorBody(response)
    throw new ApiError(
      response.status,
      body?.detail ?? `GET ${path} failed with ${response.status}`,
      body?.code,
      body?.errors ?? null,
    )
  }
  return response.json() as Promise<T>
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
