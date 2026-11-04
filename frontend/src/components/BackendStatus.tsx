import { useEffect, useState } from 'react'

type Status = 'loading' | 'ok' | 'error'

// Relative URL: the Vite proxy (dev) and Django (production) serve /api on the same origin
const HEALTH_URL = '/api/health/'

function BackendStatus() {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const controller = new AbortController()

    fetch(HEALTH_URL, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setStatus(data.status === 'ok' ? 'ok' : 'error'))
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error')
      })

    return () => controller.abort()
  }, [])

  if (status === 'loading') return <p>backend: provjera...</p>
  if (status === 'ok') return <p>backend: OK</p>
  return <p role="alert">backend: nedostupan</p>
}

export default BackendStatus
