// Public catalogue API (#74, #75, #96). DRF returns DecimalField values as strings.

import { apiGet, toQueryString } from './client'

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

// Results per page when the request has no page_size (docs chapter 4.9).
export const PAGE_SIZE = 20

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
  return apiGet<Paginated<VesselListItem>>(`/api/vessels/${toQueryString(filters)}`, signal)
}

// GET /api/categories/ (not paginated)
export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  return apiGet<Category[]>('/api/categories/', signal)
}

// GET /api/ports/ (not paginated)
export async function getPorts(signal?: AbortSignal): Promise<Port[]> {
  return apiGet<Port[]>('/api/ports/', signal)
}

// GET /api/companies/
export async function getCompanies(signal?: AbortSignal): Promise<Paginated<Company>> {
  return apiGet<Paginated<Company>>('/api/companies/', signal)
}
