import { Alert, Stack, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

function FleetPage() {
  const { state, pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const successName = (state as { createdVesselName?: string } | null)?.createdVesselName
  const [createdVesselName] = useState(successName)

  useEffect(() => {
    if (successName) void navigate({ pathname, search, hash }, { replace: true, state: null })
  }, [hash, navigate, pathname, search, successName])

  return (
    <Stack>
      <Title order={1}>Flota</Title>
      {createdVesselName && (
        <Alert color="green" role="status" title="Plovilo je dodano u flotu.">
          {createdVesselName}
        </Alert>
      )}
    </Stack>
  )
}

export default FleetPage
