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
import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { PAGE_SIZE, type Paginated } from '../../api/catalog'
import { ApiError } from '../../api/client'
import { companyKeys, getCompanyVessels, type CompanyVessel } from '../../api/company'
import { formatPrice } from '../../utils/format'

const PAGINATION_LABELS = {
  first: 'Prva stranica',
  previous: 'Prethodna stranica',
  next: 'Sljedeća stranica',
  last: 'Zadnja stranica',
}

// Names the table for screen readers after the visible list heading.
const LIST_HEADING_ID = 'fleet-list-heading'

// Owners and admins type these names, so a name without spaces must still wrap.
// Only names get it: on headers or prices it would split words and amounts when space is short.
const WRAP_ANYWHERE = { overflowWrap: 'anywhere' } as const

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

// A long vessel name next to it must never squeeze the label into an ellipsis.
function VesselStatus({ active }: { active: boolean }) {
  return (
    <Badge color={active ? 'green' : 'gray'} variant="light" miw="max-content">
      {active ? 'Aktivno' : 'Neaktivno'}
    </Badge>
  )
}

function Detail({ label, value, wrap }: { label: string; value: ReactNode; wrap?: boolean }) {
  return (
    <div>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm" style={wrap ? WRAP_ANYWHERE : undefined}>
        {value}
      </Text>
    </div>
  )
}

// Wrapping anywhere lets the auto table layout shrink a column until ordinary words split,
// so every name column keeps room for one ordinary word.
function NameCell({ children }: { children: ReactNode }) {
  return (
    <Table.Td>
      <Box miw="6rem" style={WRAP_ANYWHERE}>
        {children}
      </Box>
    </Table.Td>
  )
}

function VesselTable({ vessels }: { vessels: CompanyVessel[] }) {
  return (
    <Table visibleFrom="md" tabularNums aria-labelledby={LIST_HEADING_ID}>
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
            <NameCell>{vessel.name}</NameCell>
            <NameCell>{vessel.category.name}</NameCell>
            <NameCell>{vessel.home_port.name}</NameCell>
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
            <Text fw={600} style={WRAP_ANYWHERE}>
              {vessel.name}
            </Text>
            <VesselStatus active={vessel.is_active} />
          </Group>
          <SimpleGrid cols={2} mt="sm">
            <Detail label="Kategorija" value={vessel.category.name} wrap />
            <Detail label="Matična luka" value={vessel.home_port.name} wrap />
            <Detail label="Broj osoba" value={vessel.max_people} />
            <Detail label="Cijena / dan" value={formatPrice(vessel.daily_price)} />
          </SimpleGrid>
        </Card>
      ))}
    </SimpleGrid>
  )
}

function VesselList({
  page,
  query,
  onPageChange,
}: {
  page: number
  query: UseQueryResult<Paginated<CompanyVessel>>
  onPageChange: (page: number) => void
}) {
  const { data, error, isPending, isPlaceholderData, refetch } = query

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

  return (
    <Stack>
      <Box opacity={isPlaceholderData ? 0.6 : 1} aria-busy={isPlaceholderData}>
        <VesselTable vessels={data.results} />
        <VesselCards vessels={data.results} />
      </Box>
      <Pagination
        total={Math.ceil(data.count / PAGE_SIZE)}
        value={page}
        onChange={onPageChange}
        getControlProps={(control) => ({ 'aria-label': PAGINATION_LABELS[control] })}
        hideWithOnePage
      />
    </Stack>
  )
}

function FleetPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = pageFromSearch(searchParams)
  const query = useQuery({
    queryKey: companyKeys.vessels(page),
    queryFn: ({ signal }) => getCompanyVessels(page, signal),
    // The current page stays on screen while the next one loads.
    placeholderData: keepPreviousData,
    // A 4xx answer, such as a page past the end, would not change on retry.
    retry: (failureCount, err) =>
      failureCount < 3 && !(err instanceof ApiError && err.status < 500),
  })

  const changePage = (next: number) => {
    setSearchParams(next === 1 ? {} : { page: String(next) })
    window.scrollTo({ top: 0 })
  }

  return (
    <Stack>
      <Title order={1}>Flota</Title>
      <Group justify="space-between">
        <Title order={2} size="h4" id={LIST_HEADING_ID}>
          Plovila vaše tvrtke
        </Title>
        {/* An empty fleet has this button in its empty state instead. */}
        {query.data?.count !== 0 && <NewVesselButton />}
      </Group>
      <VesselList page={page} query={query} onPageChange={changePage} />
    </Stack>
  )
}

export default FleetPage
