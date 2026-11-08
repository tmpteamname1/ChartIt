import { Button, EmptyState } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import { Link } from 'react-router'

function ForbiddenPage() {
  return (
    <EmptyState
      mt="xl"
      icon={<IconLock />}
      title="Nemate pristup"
      description="Ova stranica nije dostupna vašoj korisničkoj ulozi."
    >
      <Button component={Link} to="/">
        Na početnu
      </Button>
    </EmptyState>
  )
}

export default ForbiddenPage
