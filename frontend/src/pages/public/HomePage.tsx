import {
  Alert,
  Button,
  Container, //sirina stranice
  Grid,
  Group,
  NumberInput,
  Paper,
  Pagination,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { keepPreviousData, useQuery } from '@tanstack/react-query' //za dohvacivanje backenda
import { useSearchParams } from 'react-router' //citanje i mijenjanje parametra u URL adresi
import { VesselCard } from '../../components/VesselCard' //react komponenta za prikaz pojedinog plovila
import {
  catalogKeys,
  getCategories,
  getCompanies,
  getPorts,
  getVessels,
  type VesselFilters,
  type VesselOrdering,
} from '../../api/catalog'
import './HomePage.css'

const PAGE_SIZE = 20
const ORDERING_VALUES: VesselOrdering[] = [
  //nacini sortiranja
  'name',
  '-name',
  'daily_price',
  '-daily_price',
  'length_m',
  '-length_m',
]
//opcije sorttiranja
const orderingOptions = [
  { value: 'name', label: 'Naziv: A–Ž' },
  { value: '-name', label: 'Naziv: Ž–A' },
  { value: 'daily_price', label: 'Cijena: najniža prvo' },
  { value: '-daily_price', label: 'Cijena: najviša prvo' },
  { value: 'length_m', label: 'Duljina: najkraća prvo' },
  { value: '-length_m', label: 'Duljina: najduža prvo' },
]

//>0 i samo cijele brojeve
function positiveInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === '') {
    return undefined //ako je null ili prazan znak vracamo undefined
  }
  const number = Number(value) //tekst u broj

  return Number.isInteger(number) && number > 0 ? number : undefined
  //ako je intege i veccci od nule vrati 0 vrati ga inace ne
}

//prihvaca >= 0 i svi konacni brojevi
function NoNegativeNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === '') {
    return undefined
  }

  const number = Number(value)

  return Number.isFinite(number) && number >= 0 ? number : undefined
} //zbog cijene moramo cijele i decimalne za provjeru min i max cijene

//da li je odabrani nacin sortiranja dopusten
//prima string ili null
function validOrdering(value: string | null): value is VesselOrdering {
  if (value === null) {
    return false
  }

  if (ORDERING_VALUES.includes(value as VesselOrdering)) {
    return true
  }

  return false
}
//vraca vesselFilters
//http://localhost:5173/?port=1&people=6&ordering=name
//searchParams sadrzi parametre iz URL adrese
function readFilters(searchParams: URLSearchParams): VesselFilters {
  const ordering = searchParams.get('ordering')
  //http://localhost:5173/?search=Adriana
  const search = searchParams.get('search')?.trim()
  //ako nije null trimaj
  return {
    port: positiveInteger(searchParams.get('port')),
    category: positiveInteger(searchParams.get('category')),
    company: positiveInteger(searchParams.get('company')),
    people: positiveInteger(searchParams.get('people')),
    min_price: NoNegativeNumber(searchParams.get('min_price')),
    max_price: NoNegativeNumber(searchParams.get('max_price')),
    search: search || undefined, //tekst pretrage
    ordering: validOrdering(ordering) ? ordering : undefined,
    page: positiveInteger(searchParams.get('page')),
  }
}

function HomePage() {
  //parametri url adrese, mijenjanje tih parametra
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = readFilters(searchParams) //spremamo aktivne filtere u filters

  //dohvacanje sa backenda
  //pocetna luka sprem u portsQuery
  const portsQuery = useQuery({
    queryKey: catalogKeys.ports(),
    queryFn: ({ signal }) => getPorts(signal),
  })
  //dohvacanje kategorije
  const categoriesQuery = useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: ({ signal }) => getCategories(signal),
  })

  //kompanija

  const companiesQuery = useQuery({
    queryKey: catalogKeys.companies(),
    queryFn: ({ signal }) => getCompanies(signal),
  })

  //plovila
  const vesselsQuery = useQuery({
    queryKey: catalogKeys.vessels(filters),
    queryFn: ({ signal }) => getVessels(filters, signal),
    placeholderData: keepPreviousData,
  })

  //primamo key i vrijednost npr ('port', '3');
  //key naziv filtera koji zalimo mijenjati a value je nova vrijednost
  const updateFilter = (key: keyof VesselFilters, value: string | number | null) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current) //kopiramo postoji url kako ga ne bi izgubili
        if (value === null || value === '') {
          next.delete(key)
        } else {
          next.set(key, String(value))
        }
        next.delete('page') //krecemo od prve stranice
        return next
      },
      { replace: key === 'search' },
    )
  }

  //primjena stranice
  const updatePage = (page: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (page === 1) {
        next.delete('page')
      } else {
        next.set('page', String(page)) //stavi broj stranice u URL
      }
      return next
    })
  }

  const clearFilters = () => setSearchParams({}) //brise sve parametre
  const results = vesselsQuery.data //sprema dohvacene podatke o plovlima u results
  const pageCount = results ? Math.ceil(results.count / PAGE_SIZE) : 0 //ukupan broj stranica
  const lookupsFailed = portsQuery.isError || categoriesQuery.isError || companiesQuery.isError

  return (
    //py razmak gore dolje
    <Container className="home-page" size="xl" py="xl">
      <Stack gap="xl">
        <header className="home-page__intro">
          <Text c="blue.7" fw={700} size="sm" tt="uppercase">
            ChartIt · javna ponuda
          </Text>{' '}
          {/*naslov prve raznine*/}
          <Title order={1}>Pronađi plovilo</Title>
          <Text c="dimmed" maw={680}>
            Usporedi plovila različitih charter tvrtki i pronađi ono koje odgovara tvojem putovanju.
          </Text>
        </header>

        <Paper className="home-page__filters" p="lg" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <TextInput
                label="Pretraga po nazivu"
                placeholder="npr. Adriana"
                value={searchParams.get('search') ?? ''}
                onChange={(event) => updateFilter('search', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                clearable
                label="Polazna luka"
                placeholder={portsQuery.isPending ? 'Učitavanje luka…' : 'Sve luke'}
                data={(portsQuery.data ?? []).map((port) => ({
                  value: String(port.id),
                  label: port.name,
                }))} //ako je undefined onda null inace dodijeli string
                value={filters.port === undefined ? null : String(filters.port)}
                onChange={(value) => updateFilter('port', value)}
                disabled={portsQuery.isPending || portsQuery.isError}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                clearable
                label="Kategorija plovila"
                placeholder={
                  categoriesQuery.isPending ? 'Učitavanje kategorija…' : 'Sve kategorije'
                } //ako psotoje podaci o lukama koristi ih a ako ne postoje koristi prazan niz
                data={(categoriesQuery.data ?? []).map((category) => ({
                  value: String(category.id),
                  label: category.name,
                }))}
                value={filters.category === undefined ? null : String(filters.category)}
                onChange={(value) => updateFilter('category', value)}
                disabled={categoriesQuery.isPending || categoriesQuery.isError}
              />
            </Grid.Col>{' '}
            {/*bas na mobu  cijeli na manjim ekranima pola a na velikima 1/3 */}
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select
                clearable
                label="Tvrtka"
                placeholder={companiesQuery.isPending ? 'Učitavanje tvrtki…' : 'Sve tvrtke'}
                data={(companiesQuery.data?.results ?? []).map((company) => ({
                  value: String(company.id),
                  label: company.name,
                }))} //ako ne postoji ta firma daj null a ako postoji id u string
                value={filters.company === undefined ? null : String(filters.company)}
                onChange={(value) => updateFilter('company', value)}
                disabled={companiesQuery.isPending || companiesQuery.isError}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 2 }}>
              <NumberInput
                label="Najmanje osoba"
                min={1}
                allowDecimal={false}
                allowNegative={false}
                value={filters.people ?? ''}
                onChange={(value) => updateFilter('people', value === '' ? null : String(value))}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <NumberInput
                label="Najniža cijena (€ / dan)"
                min={0} //min cijena
                decimalScale={2}
                allowNegative={false}
                value={filters.min_price ?? ''}
                onChange={(value) => updateFilter('min_price', value === '' ? null : String(value))}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
              <NumberInput
                label="Najviša cijena (€ / dan)"
                min={0}
                decimalScale={2}
                allowNegative={false}
                value={filters.max_price ?? ''}
                onChange={(value) => updateFilter('max_price', value === '' ? null : String(value))}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Select //select sortiranje
                label="Sortiranje"
                data={orderingOptions}
                value={filters.ordering ?? 'name'}
                onChange={(value) => updateFilter('ordering', value)}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={clearFilters}>
              Ukloni filtre
            </Button>
          </Group>
          {lookupsFailed && (
            <Alert color="red" mt="md" title="Filtre nije moguće učitati" role="alert">
              <Group justify="space-between" align="center">
                <Text size="sm">Podatke nije moguće učitati. Pokušajte ponovno.</Text>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() => {
                    void portsQuery.refetch()
                    void categoriesQuery.refetch()
                    void companiesQuery.refetch()
                  }}
                >
                  Pokušaj ponovno
                </Button>
              </Group>
            </Alert>
          )}
        </Paper>

        <section aria-labelledby="search-results-title">
          <Group className="home-page__results-heading" justify="space-between" align="end" mb="md">
            <div>
              <Text c="dimmed" size="sm">
                Plovila koja odgovaraju kriterijima
              </Text>
              <Title id="search-results-title" order={2}>
                Rezultati pretrage
              </Title>
            </div>{' '}
            {/*samo ako rezz postoji i daje odredeni broj  */}
            {results && (
              <Text c="dimmed" size="sm" aria-live="polite">
                {results.count} {results.count === 1 ? 'plovilo' : 'plovila'}
              </Text>
            )}
          </Group>

          {vesselsQuery.isFetching && results && (
            <Text c="dimmed" size="sm" role="status" aria-live="polite">
              Učitavanje novih rezultata…
            </Text>
          )}

          {vesselsQuery.isFetching && !results && (
            <div className="home-page__loading" role="status" aria-live="polite">
              <Text c="dimmed">Učitavanje rezultata…</Text>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => (
                  <Paper key={index} p="sm" withBorder>
                    <Skeleton height={150} />
                    <Skeleton height={18} mt="md" width="65%" />
                    <Skeleton height={14} mt="sm" />
                    <Skeleton height={14} mt="xs" width="45%" />
                  </Paper>
                ))}
              </SimpleGrid>
            </div>
          )}

          {vesselsQuery.isError && !vesselsQuery.isFetching && (
            <Alert color="red" title="Pretraga nije uspjela" role="alert">
              <Group justify="space-between" align="center">
                <Text size="sm">Podatke nije moguće učitati. Pokušajte ponovno kasnije.</Text>
                <Button size="xs" variant="light" onClick={() => void vesselsQuery.refetch()}>
                  Pokušaj ponovno
                </Button>
              </Group>
            </Alert>
          )}

          {!vesselsQuery.isFetching && results?.count === 0 && (
            <Paper className="home-page__empty" p="xl" radius="md" withBorder>
              <Stack align="center" gap="xs">
                {' '}
                {/*aako su uvjeti zadovoljeni prikazi paper poruku */}
                <Title order={3}>Nema plovila za odabrane kriterije</Title>
                <Text c="dimmed">Promijenite filtre ili ih uklonite pa pokušajte ponovno.</Text>
                <Button variant="light" onClick={clearFilters}>
                  Ukloni filtre
                </Button>
              </Stack>
            </Paper>
          )}

          {!vesselsQuery.isFetching && results && results.count > 0 && (
            <>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {results.results.map((vessel) => (
                  //za svako plovilo zovemo VesselCard
                  <VesselCard key={vessel.id} vessel={vessel} />
                ))}
              </SimpleGrid>
              {pageCount > 1 && (
                <Group justify="center" mt="xl">
                  <Pagination
                    total={pageCount}
                    value={filters.page ?? 1}
                    onChange={updatePage}
                    aria-label="Stranice rezultata"
                  />
                </Group>
              )}
            </>
          )}
        </section>
      </Stack>
    </Container>
  )
}

export default HomePage
