import { Group, Loader, Text } from '@mantine/core'

// U-01: loading the whole page; the header and menu stay usable (docs/dizajn/58).
function PageLoader() {
  return (
    <Group gap="xs" mt="xl">
      <Loader size="sm" />
      <Text c="dimmed">Učitavanje podataka...</Text>
    </Group>
  )
}

export default PageLoader
