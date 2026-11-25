// Company fleet list and creation API (#101, #102), only for the owner (VLASNIK).
// The backend limits both calls to the logged-in user's company (ADR-02).
// Both request and response keep DecimalField values as strings.

import type { NamedRef, Paginated } from './catalog'
import { apiGet, apiPost, toQueryString } from './client'

export interface CompanyVessel {
  id: number
  name: string
  description: string
  equipment: string
  category: NamedRef
  home_port: NamedRef
  length_m: string
  max_people: number
  cabins: number
  year_built: number
  daily_price: string
  is_active: boolean
}

export interface VesselCreate {
  name: string
  description?: string
  equipment?: string
  category: number
  home_port: number
  length_m: string
  max_people: number
  cabins: number
  year_built: number
  daily_price: string
}

// Invalidate companyKeys.all after creating a vessel to refresh every page.
// AuthProvider removes these when the logged-in user changes, so the keys need no user ID.
export const companyKeys = {
  all: ['company'] as const,
  vessels: (page: number) => [...companyKeys.all, 'vessels', page] as const,
}

// GET /api/company/vessels/?page=N, active and inactive vessels sorted by name.
// A page past the last one answers 404.
export function getCompanyVessels(
  page = 1,
  signal?: AbortSignal,
): Promise<Paginated<CompanyVessel>> {
  const query = toQueryString({ page: page === 1 ? undefined : page })
  return apiGet<Paginated<CompanyVessel>>(`/api/company/vessels/${query}`, signal)
}

// POST /api/company/vessels/ (201 Created). Invalid input answers 400 with per-field errors.
export function createVessel(data: VesselCreate): Promise<CompanyVessel> {
  return apiPost<CompanyVessel>('/api/company/vessels/', data)
}
