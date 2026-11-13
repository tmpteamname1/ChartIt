// Public catalogue (issues #74, #75): the only place the search screen gets its data from.
// Field names and types follow the API responses exactly; DRF returns DecimalField as a string.
// Until the backend endpoints exist, the functions return mock data with the same signature.

import { mockCategories, mockCompanies, mockPorts, queryMockVessels } from './mocks/catalog'
import { mockDelay } from './mocks/delay'

export interface Category {
  id: number
  name: string
}

export interface Port {
  id: number
  name: string
  latitude: string
  longitude: string
}

export interface Company {
  id: number
  name: string
  address: string
  email: string
  phone: string
}

// Nested reference in a vessel card.
export interface NamedRef {
  id: number
  name: string
}

export interface VesselListItem {
  id: number
  name: string
  category: NamedRef
  home_port: NamedRef
  company: NamedRef
  max_people: number
  cabins: number
  length_m: string
  daily_price: string
  thumbnail: string | null
}

// Response of every paginated list endpoint (docs chapter 4.9).
export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type VesselOrdering =
  'name' | '-name' | 'daily_price' | '-daily_price' | 'length_m' | '-length_m'

// Query parameters of GET /api/vessels/ (#75).
export interface VesselFilters {
  port?: number
  category?: number
  company?: number
  people?: number
  min_price?: number
  max_price?: number
  search?: string
  ordering?: VesselOrdering
  page?: number
}

export const catalogKeys = {
  all: ['catalog'] as const,
  vessels: (filters: VesselFilters) => [...catalogKeys.all, 'vessels', filters] as const,
  categories: () => [...catalogKeys.all, 'categories'] as const,
  ports: () => [...catalogKeys.all, 'ports'] as const,
  companies: () => [...catalogKeys.all, 'companies'] as const,
}

// GET /api/vessels/ + toQueryString(filters)
export async function getVessels(
  filters: VesselFilters,
  signal?: AbortSignal,
): Promise<Paginated<VesselListItem>> {
  await mockDelay(signal)
  return queryMockVessels(filters)
}

// GET /api/categories/ (not paginated)
export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  await mockDelay(signal)
  return mockCategories
}

// GET /api/ports/ (not paginated)
export async function getPorts(signal?: AbortSignal): Promise<Port[]> {
  await mockDelay(signal)
  return mockPorts
}

// GET /api/companies/
export async function getCompanies(signal?: AbortSignal): Promise<Paginated<Company>> {
  await mockDelay(signal)
  return { count: mockCompanies.length, next: null, previous: null, results: mockCompanies }
}
