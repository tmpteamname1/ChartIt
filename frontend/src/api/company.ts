import type { NamedRef, Paginated } from './catalog'
import { createMockVessel, queryMockCompanyVessels } from './mocks/company'
import { mockDelay } from './mocks/delay'

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
export const companyKeys = {
  all: ['company'] as const,
  vessels: (page: number) => [...companyKeys.all, 'vessels', page] as const,
}

// GET /api/company/vessels/
export async function getCompanyVessels(
  page = 1,
  signal?: AbortSignal,
): Promise<Paginated<CompanyVessel>> {
  await mockDelay(signal)
  return queryMockCompanyVessels(page)
}

// POST /api/company/vessels/ (201 Created)
export async function createVessel(data: VesselCreate): Promise<CompanyVessel> {
  await mockDelay()
  return createMockVessel(data)
}
