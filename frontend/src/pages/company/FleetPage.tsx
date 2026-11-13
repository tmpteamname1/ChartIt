import {
  Badge,
  Box,
  Button,
  Card,
  EmptyState,
  Group,
  Loader,
  Pagination,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconAlertTriangle, IconSailboat } from '@tabler/icons-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { PAGE_SIZE } from '../../api/catalog'
import { ApiError } from '../../api/client'
import { companyKeys, getCompanyVessels, type CompanyVessel } from '../../api/company'
import { formatPrice } from '../../utils/format'

const PAGINATION_LABELS = {
  first: 'Prva stranica',
  previous: 'Prethodna stranica',
  next: 'Sljedeća stranica',
  last: 'Zadnja stranica',
}

// The page lives in the URL (?page=2) so it survives a reload; anything else is the first page.
function pageFromSearch(searchParams: URLSearchParams): number {
  const page = Number(searchParams.get('page') ?? 1)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function NewVesselButton() {
  return (
    <Button component={Link} to="/tvrtka/flota/novo">
      Novo plovilo
    </Button>
  )
}

function VesselStatus({ active }: { active: boolean }) {
  return (
    <Badge color={active ? 'green' : 'gray'} variant="light">
      {active ? 'Aktivno' : 'Neaktivno'}
    </Badge>
  )
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </div>
  )
}

function VesselTable({ vessels }: { vessels: CompanyVessel[] }) {
  return (
    <Table visibleFrom="md" tabularNums>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Plovilo</Table.Th>
          <Table.Th>Kategorija</Table.Th>
          <Table.Th>Matična luka</Table.Th>
          <Table.Th>Broj osoba</Table.Th>
          <Table.Th>Cijena / dan</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {vessels.map((vessel) => (
          <Table.Tr key={vessel.id}>
            <Table.Td>{vessel.name}</Table.Td>
            <Table.Td>{vessel.category.name}</Table.Td>
            <Table.Td>{vessel.home_port.name}</Table.Td>
            <Table.Td>{vessel.max_people}</Table.Td>
            <Table.Td>{formatPrice(vessel.daily_price)}</Table.Td>
            <Table.Td>
              <VesselStatus active={vessel.is_active} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

// Rows become cards on smaller screens (docs 4.8, "Tablice"). Up to md the sidebar
// leaves too little width for six columns, so the switch is at md rather than sm.
function VesselCards({ vessels }: { vessels: CompanyVessel[] }) {
  return (
    <SimpleGrid hiddenFrom="md" cols={{ base: 1, sm: 2 }}>
      {vessels.map((vessel) => (
        <Card key={vessel.id} withBorder>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Text fw={600}>{vessel.name}</Text>
            <VesselStatus active={vessel.is_active} />
          </Group>
          <SimpleGrid cols={2} mt="sm">
            <Detail label="Kategorija" value={vessel.category.name} />
            <Detail label="Matična luka" value={vessel.home_port.name} />
            <Detail label="Broj osoba" value={vessel.max_people} />
            <Detail label="Cijena / dan" value={formatPrice(vessel.daily_price)} />
          </SimpleGrid>
        </Card>
      ))}
    </SimpleGrid>
  )
}

function VesselList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = pageFromSearch(searchParams)
  const { data, error, isPending, isPlaceholderData, refetch } = useQuery({
    queryKey: companyKeys.vessels(page),
    queryFn: ({ signal }) => getCompanyVessels(page, signal),
    // The current page stays on screen while the next one loads.
    placeholderData: keepPreviousData,
    // A 4xx answer, such as a page past the end, would not change on retry.
    retry: (failureCount, err) =>
      failureCount < 3 && !(err instanceof ApiError && err.status < 500),
  })

  // Loaded data stays on screen if a later background refetch fails.
  if (!data) {
    if (isPending) {
      return (
        <Group gap="sm">
          <Loader size="sm" />
          <Text c="dimmed">Učitavanje podataka...</Text>
        </Group>
      )
    }
    // An edited or outdated link can point past the last page.
    if (error instanceof ApiError && error.status === 404 && page > 1) {
      return <Navigate to="." replace />
    }
    return (
      <EmptyState
        icon={<IconAlertTriangle />}
        title="Podatke nije moguće učitati"
        description="Pokušajte ponovno kasnije."
      >
        <Button onClick={() => refetch()}>Pokušaj ponovno</Button>
      </EmptyState>
    )
  }

  if (data.count === 0) {
    return (
      <EmptyState
        icon={<IconSailboat />}
        title="Još nemate plovila"
        description="Dodajte prvo plovilo svoje tvrtke."
      >
        <NewVesselButton />
      </EmptyState>
    )
  }

  const changePage = (next: number) => {
    setSearchParams(next === 1 ? {} : { page: String(next) })
    window.scrollTo({ top: 0 })
  }

  return (
    <Stack>
      <Box opacity={isPlaceholderData ? 0.6 : 1} aria-busy={isPlaceholderData}>
        <VesselTable vessels={data.results} />
        <VesselCards vessels={data.results} />
      </Box>
      <Pagination
        total={Math.ceil(data.count / PAGE_SIZE)}
        value={page}
        onChange={changePage}
        getControlProps={(control) => ({ 'aria-label': PAGINATION_LABELS[control] })}
        hideWithOnePage
      />
    </Stack>
  )
}

function FleetPage() {
  return (
    <Stack>
      <Title order={1}>Flota</Title>
      <Group justify="space-between">
        <Title order={2} size="h4">
          Plovila vaše tvrtke
        </Title>
        <NewVesselButton />
      </Group>
      <VesselList />
    </Stack>
  )
}

export default FleetPage
