import { Button, EmptyState } from '@mantine/core'
import { IconMapQuestion } from '@tabler/icons-react'
import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <EmptyState
      mt="xl"
      icon={<IconMapQuestion />}
      title="Stranica ne postoji"
      description="Provjerite adresu ili se vratite na početnu stranicu."
    >
      <Button component={Link} to="/">
        Na početnu
      </Button>
    </EmptyState>
  )
}

export default NotFoundPage
