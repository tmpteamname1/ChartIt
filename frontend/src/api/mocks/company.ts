import type { NamedRef, Paginated } from '../catalog'
import { ApiError, toQueryString } from '../client'
import type { CompanyVessel, VesselCreate } from '../company'
import { mockCategories, mockPorts } from './catalog'

const PAGE_SIZE = 20
const MAX_SMALL_INTEGER = 32_767

type VesselRow = [
  name: string,
  category: number,
  port: number,
  length: string,
  people: number,
  cabins: number,
  year: number,
  price: string,
  active?: false,
]

const rows: VesselRow[] = [
  ['Akvamarin', 3, 6, '12.40', 8, 4, 2019, '180.00'],
  ['Barka', 2, 4, '6.50', 6, 0, 2022, '75.00'],
  ['Bonaca', 4, 6, '13.70', 10, 4, 2018, '420.00'],
  ['Ćuk', 3, 4, '9.20', 4, 2, 2008, '95.00', false],
  ['Delfin', 2, 5, '7.40', 8, 0, 2021, '110.00'],
  ['Gajeta', 3, 2, '10.60', 6, 3, 2014, '135.00'],
  ['Hridi', 5, 4, '15.20', 8, 3, 2017, '890.00'],
  ['Istra', 4, 2, '12.80', 8, 4, 2020, '380.00'],
  ['Jedro', 3, 6, '11.70', 6, 3, 2015, '145.00'],
  ['Koralj', 1, 3, '24.00', 12, 6, 2009, '1450.00'],
  ['Lanterna', 3, 5, '13.40', 8, 4, 2016, '195.00'],
  ['Marea', 5, 3, '18.30', 10, 4, 2020, '1200.00'],
  ['Neretva', 2, 1, '5.80', 5, 0, 2023, '65.00'],
  ['Orada', 3, 6, '12.90', 8, 4, 2018, '170.00'],
  ['Periska', 4, 3, '14.50', 12, 6, 2019, '540.00'],
  ['Ruža vjetrova', 3, 4, '15.80', 10, 5, 2021, '260.00'],
  ['Salpa', 5, 1, '16.10', 8, 3, 2015, '980.00'],
  ['Škoj', 3, 3, '8.90', 4, 2, 2007, '88.50', false],
  ['Tamaris', 4, 1, '13.90', 10, 5, 2022, '460.00'],
  ['Uvala', 1, 5, '26.00', 14, 7, 2012, '1750.00'],
  ['Val', 3, 2, '10.90', 6, 3, 2019, '140.00'],
  ['Zefir', 3, 6, '15.10', 10, 5, 2020, '240.00'],
]

function findRef(items: NamedRef[], id: number): NamedRef | undefined {
  const item = items.find((candidate) => candidate.id === id)
  return item && { id: item.id, name: item.name }
}

const vessels: CompanyVessel[] = rows.map(
  ([name, category, port, length, people, cabins, year, price, active], index) => ({
    id: index + 1,
    name,
    description: '',
    equipment: 'VHF radio, prsluci za spašavanje',
    category: findRef(mockCategories, category)!,
    home_port: findRef(mockPorts, port)!,
    length_m: length,
    max_people: people,
    cabins,
    year_built: year,
    daily_price: price,
    is_active: active ?? true,
  }),
)

export function queryMockCompanyVessels(page: number): Paginated<CompanyVessel> {
  const count = vessels.length
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE))
  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    throw new ApiError(404, 'Invalid page.', 'not_found')
  }

  const pageUrl = (target: number) =>
    `/api/company/vessels/${toQueryString({ page: target === 1 ? undefined : target })}`
  const sorted = [...vessels].sort((a, b) => a.name.localeCompare(b.name, 'hr') || a.id - b.id)

  return {
    count,
    next: page < pageCount ? pageUrl(page + 1) : null,
    previous: page > 1 ? pageUrl(page - 1) : null,
    results: structuredClone(sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)),
  }
}

const requiredFields = [
  'name',
  'category',
  'home_port',
  'length_m',
  'max_people',
  'cabins',
  'year_built',
  'daily_price',
] as const

// Keep decimals in string form, including when validating and padding to two places.
function decimal(value: string, maxWholeDigits?: number): string | undefined {
  if (typeof value !== 'string') return

  const match = /^([+-]?)(\d*)(?:\.(\d{0,2}))?$/.exec(value.trim())
  if (!match) return

  const [, sign, whole, fraction = ''] = match
  if (!whole && !fraction) return

  const integer = whole.replace(/^0+/, '') || '0'
  if (maxWholeDigits !== undefined && integer.length > maxWholeDigits) return

  const digits = fraction.padEnd(2, '0')
  const negative = sign === '-' && (integer !== '0' || digits !== '00')
  return `${negative ? '-' : ''}${integer}.${digits}`
}

export function createMockVessel(data: VesselCreate): CompanyVessel {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new ApiError(400, 'Uneseni podaci nisu ispravni.', 'invalid', {
      non_field_errors: ['Pošaljite podatke o plovilu kao objekt.'],
    })
  }

  const errors: Record<string, string[]> = {}
  const setError = (field: keyof VesselCreate, message: string) => {
    errors[field] ??= [message]
  }

  for (const field of requiredFields) {
    const value = data[field]
    if (value == null || (typeof value === 'string' && value.trim() === '')) {
      setError(field, 'Ovo je polje obavezno.')
    }
  }

  for (const field of ['name', 'description', 'equipment'] as const) {
    const value = data[field]
    if (value !== undefined && typeof value !== 'string') {
      setError(field, 'Unesite tekst.')
    }
  }

  const category = findRef(mockCategories, data.category)
  const homePort = findRef(mockPorts, data.home_port)
  if (!category) setError('category', 'Odabrana kategorija ne postoji.')
  if (!homePort) setError('home_port', 'Odabrana luka ne postoji.')

  const length = decimal(data.length_m)
  if (!length || length.startsWith('-') || length === '0.00') {
    setError('length_m', 'Unesite duljinu veću od 0 s najviše dvije decimale.')
  }

  const price = decimal(data.daily_price, 8)
  if (!price || price.startsWith('-')) {
    setError('daily_price', 'Unesite cijenu od 0 do 99999999,99 s najviše dvije decimale.')
  }

  const { max_people, cabins, year_built } = data
  if (!Number.isInteger(max_people) || max_people < 1 || max_people > MAX_SMALL_INTEGER) {
    setError('max_people', `Unesite cijeli broj od 1 do ${MAX_SMALL_INTEGER}.`)
  }
  if (!Number.isInteger(cabins) || cabins < 0 || cabins > MAX_SMALL_INTEGER) {
    setError('cabins', `Unesite cijeli broj od 0 do ${MAX_SMALL_INTEGER}.`)
  }
  const currentYear = new Date().getFullYear()
  if (!Number.isInteger(year_built) || year_built < 1900 || year_built > currentYear) {
    setError('year_built', `Unesite cijelu godinu od 1900 do ${currentYear}.`)
  }

  if (!category || !homePort || !length || !price || Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Uneseni podaci nisu ispravni.', 'invalid', errors)
  }

  const vessel: CompanyVessel = {
    id: vessels.length + 1,
    name: data.name.trim(),
    description: data.description?.trim() ?? '',
    equipment: data.equipment?.trim() ?? '',
    category,
    home_port: homePort,
    length_m: length,
    max_people,
    cabins,
    year_built,
    daily_price: price,
    is_active: true,
  }
  vessels.push(vessel)
  return structuredClone(vessel)
}
