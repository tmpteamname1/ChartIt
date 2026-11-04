// Relative URLs: the Vite proxy (dev) and Django (production) serve /api on the same origin.

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} failed with ${response.status}`)
  }
  return response.json() as Promise<T>
}
