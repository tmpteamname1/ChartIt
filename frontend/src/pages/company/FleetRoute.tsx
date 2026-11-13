import { Alert, Stack } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import FleetPage from './FleetPage'

function FleetRoute() {
  const { state, pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const successName = (state as { createdVesselName?: string } | null)?.createdVesselName
  const [createdVesselName, setCreatedVesselName] = useState(successName)
  const confirmationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!successName) return
    window.scrollTo({ top: 0 })
    confirmationRef.current?.focus({ preventScroll: true })
    void navigate({ pathname, search, hash }, { replace: true, state: null })
  }, [hash, navigate, pathname, search, successName])

  return (
    <Stack>
      {createdVesselName && (
        <Alert
          ref={confirmationRef}
          tabIndex={-1}
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
