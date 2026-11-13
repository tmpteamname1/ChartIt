// Mock catalogue data in the exact shape of the API responses (#74, #75).
// Only modules under src/api import mocks. The fleet mock shares the category and port lookups.

import type { Category, Company, Paginated, Port, VesselFilters, VesselListItem } from '../catalog'
import { ApiError, toQueryString } from '../client'

const PAGE_SIZE = 20

export const mockCategories: Category[] = [
  { id: 1, name: 'Gulet' },
  { id: 2, name: 'Gumenjak' },
  { id: 3, name: 'Jedrilica' },
  { id: 4, name: 'Katamaran' },
  { id: 5, name: 'Motorna jahta' },
]

export const mockPorts: Port[] = [
  { id: 1, name: 'Dubrovnik', latitude: '42.650700', longitude: '18.094400' },
  { id: 2, name: 'Pula', latitude: '44.866600', longitude: '13.849600' },
  { id: 3, name: 'Split', latitude: '43.508100', longitude: '16.440200' },
  { id: 4, name: 'Šibenik', latitude: '43.735000', longitude: '15.895200' },
  { id: 5, name: 'Trogir', latitude: '43.517000', longitude: '16.251200' },
  { id: 6, name: 'Zadar', latitude: '44.119400', longitude: '15.231400' },
]

export const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Adria Sail',
    address: 'Obala kneza Branimira 12, 23000 Zadar',
    email: 'info@adria-sail.example',
    phone: '+385 23 555 0101',
  },
  {
    id: 2,
    name: 'Dalmacija Yachting',
    address: 'Uvala Baluni 8, 21000 Split',
    email: 'booking@dalmacija-yachting.example',
    phone: '+385 21 555 0202',
  },
  {
    id: 3,
    name: 'Južni Vjetar Charter',
    address: 'Obala Stjepana Radića 25, 20000 Dubrovnik',
    email: 'kontakt@juzni-vjetar.example',
    phone: '+385 20 555 0303',
  },
]

// [name, category, home port, company, max people, cabins, length (m), daily price (EUR)]
type VesselRow = [string, number, number, number, number, number, string, string]

const vesselRows: VesselRow[] = [
  ['Adriana', 3, 6, 1, 8, 4, '12.40', '180.00'],
  ['Bura', 3, 6, 1, 6, 3, '10.60', '135.00'],
  ['Galeb', 3, 4, 1, 4, 2, '9.20', '95.00'],
  ['Jugo', 4, 6, 1, 10, 4, '13.70', '420.00'],
  ['Kornati Star', 5, 4, 1, 8, 3, '15.20', '890.00'],
  ['Lastavica', 2, 6, 1, 6, 0, '6.50', '75.00'],
  ['Maestral', 3, 4, 1, 10, 5, '15.80', '260.00'],
  ['Morska Vila', 1, 6, 1, 12, 6, '24.00', '1450.00'],
  ['Pelegrin', 3, 2, 1, 8, 4, '12.90', '170.00'],
  ['Arija', 4, 3, 2, 8, 4, '12.00', '380.00'],
  ['Biokovo', 5, 3, 2, 6, 2, '11.80', '650.00'],
  ['Dupin', 2, 5, 2, 8, 0, '7.40', '110.00'],
  ['Hvar Breeze', 4, 3, 2, 12, 6, '14.50', '540.00'],
  ['Kaštela', 3, 5, 2, 6, 3, '11.00', '150.00'],
  ['Levant', 3, 3, 2, 8, 4, '13.40', '195.00'],
  ['Marjan', 5, 3, 2, 10, 4, '18.30', '1200.00'],
  ['Neptun', 1, 5, 2, 16, 8, '28.50', '2100.00'],
  ['Tramontana', 3, 3, 2, 4, 2, '8.90', '88.50'],
  ['Elafiti', 4, 1, 3, 10, 5, '13.90', '460.00'],
  ['Gruž', 2, 1, 3, 5, 0, '5.80', '65.00'],
  ['Lapad', 3, 1, 3, 8, 4, '12.20', '175.00'],
  ['Lokrum', 5, 1, 3, 8, 3, '16.10', '980.00'],
  ['Mljet', 3, 1, 3, 6, 3, '10.90', '140.00'],
  ['Ombla', 1, 1, 3, 14, 7, '26.00', '1750.00'],
  ['Srđ', 3, 1, 3, 10, 5, '15.10', '240.00'],
]

// Vessels without a photo, to show the placeholder on the card.
const withoutPhoto = new Set([6, 20])

function refOf(items: { id: number; name: string }[], id: number) {
  const item = items.find((candidate) => candidate.id === id)!
  return { id: item.id, name: item.name }
}

export const mockVessels: VesselListItem[] = vesselRows.map(
  ([name, category, port, company, maxPeople, cabins, length, price], index) => {
    const id = index + 1
    return {
      id,
      name,
      category: refOf(mockCategories, category),
      home_port: refOf(mockPorts, port),
      company: refOf(mockCompanies, company),
      max_people: maxPeople,
      cabins,
      length_m: length,
      daily_price: price,
      thumbnail: withoutPhoto.has(id) ? null : `https://picsum.photos/seed/chartit-${id}/400/300`,
    }
  },
)

// Mimics GET /api/vessels/: filters, search, ordering and pagination over the array.
export function queryMockVessels(filters: VesselFilters): Paginated<VesselListItem> {
  const { port, category, company, people, min_price, max_price, search, ordering } = filters
  const needle = search?.trim().toLowerCase()

  const matches = mockVessels.filter(
    (vessel) =>
      (port === undefined || vessel.home_port.id === port) &&
      (category === undefined || vessel.category.id === category) &&
      (company === undefined || vessel.company.id === company) &&
      (people === undefined || vessel.max_people >= people) &&
      (min_price === undefined || Number(vessel.daily_price) >= min_price) &&
      (max_price === undefined || Number(vessel.daily_price) <= max_price) &&
      (!needle || vessel.name.toLowerCase().includes(needle)),
  )

  const field = (ordering ?? 'name').replace('-', '') as 'name' | 'daily_price' | 'length_m'
  const direction = ordering?.startsWith('-') ? -1 : 1
  matches.sort((a, b) => {
    const result =
      field === 'name' ? a.name.localeCompare(b.name, 'hr') : Number(a[field]) - Number(b[field])
    return result * direction
  })

  const page = filters.page ?? 1
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    throw new ApiError(404, 'Invalid page.', 'not_found')
  }

  // Like DRF, the link to the first page has no page parameter.
  const pageUrl = (target: number) =>
    `/api/vessels/${toQueryString({ ...filters, page: target === 1 ? undefined : target })}`

  return {
    count: matches.length,
    next: page < pageCount ? pageUrl(page + 1) : null,
    previous: page > 1 ? pageUrl(page - 1) : null,
    results: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
  }
}
