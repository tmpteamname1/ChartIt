// Simulate network latency and reject on abort like fetch does.
export async function mockDelay(signal?: AbortSignal): Promise<void> {
  signal?.throwIfAborted()

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, 400)

    function abort() {
      clearTimeout(timer)
      reject(signal?.reason)
    }

    signal?.addEventListener('abort', abort, { once: true })
  })
}
