import { Alert, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import FleetPage from './FleetPage'

function FleetRoute() {
  const { state, pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const successName = (state as { createdVesselName?: string } | null)?.createdVesselName
  const [createdVesselName, setCreatedVesselName] = useState(successName)

  useEffect(() => {
    if (successName) void navigate({ pathname, search, hash }, { replace: true, state: null })
  }, [hash, navigate, pathname, search, successName])

  return (
    <Stack>
      {createdVesselName && (
        <Alert
          color="green"
          role="status"
          title="Plovilo je dodano u flotu."
          withCloseButton
          closeButtonLabel="Zatvori potvrdu"
          onClose={() => setCreatedVesselName(undefined)}
          style={{ overflowWrap: 'anywhere' }}
        >
          {createdVesselName}
        </Alert>
      )}
      <FleetPage />
    </Stack>
  )
}

export default FleetRoute
