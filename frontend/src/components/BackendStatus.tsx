import { Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../api/client'

function BackendStatus() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['health'],
    queryFn: ({ signal }) => apiGet<{ status: string }>('/api/health/', signal),
    retry: false,
  })

  if (isPending)
    return (
      <Text size="xs" c="dimmed">
        backend: provjera...
      </Text>
    )
  if (!isError && data.status === 'ok')
    return (
      <Text size="xs" c="dimmed">
        backend: OK
      </Text>
    )
  return (
    <Text size="xs" c="red" role="alert">
      backend: nedostupan
    </Text>
  )
}

export default BackendStatus
