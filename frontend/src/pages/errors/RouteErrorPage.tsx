import { Button, EmptyState } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'

// Last resort when a page crashes while rendering; shown without the layout, which may be what failed.
function RouteErrorPage() {
  return (
    <EmptyState
      mt="xl"
      icon={<IconAlertTriangle />}
      color="red"
      title="Nešto je pošlo po zlu"
      description="Došlo je do neočekivane greške. Pokušajte ponovno učitati stranicu."
    >
      <Button component="a" href="/">Na početnu</Button>
    </EmptyState>
  )
}

export default RouteErrorPage
