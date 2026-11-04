import {
  IconAnchor,
  IconBuilding,
  IconBuildingStore,
  IconCalendarEvent,
  IconCategory,
  IconChartBar,
  IconInbox,
  IconListDetails,
  IconSailboat,
  IconSparkles,
  IconUsers,
  IconUserCog,
  type Icon,
} from '@tabler/icons-react'
import { COMPANY_ROLES, type Role } from '../auth/roles'

export interface NavItem {
  label: string
  to: string
  // Missing roles means the item is visible to everyone, including visitors.
  roles?: Role[]
  icon?: Icon
}

// Main menu per role, from the route map (docs, 4.8).
export const HEADER_LINKS: NavItem[] = [
  { label: 'Pretraga', to: '/' },
  { label: 'Moje rezervacije', to: '/moje-rezervacije', roles: ['KORISNIK'] },
  { label: 'Panel tvrtke', to: '/tvrtka', roles: COMPANY_ROLES },
  { label: 'Administracija', to: '/administracija', roles: ['ADMINISTRATOR'] },
]

export const COMPANY_NAV: NavItem[] = [
  { label: 'Zahtjevi', to: '/tvrtka/zahtjevi', roles: COMPANY_ROLES, icon: IconInbox },
  { label: 'Raspored', to: '/tvrtka/raspored', roles: COMPANY_ROLES, icon: IconCalendarEvent },
  { label: 'Rezervacije', to: '/tvrtka/rezervacije', roles: ['VLASNIK'], icon: IconListDetails },
  { label: 'Flota', to: '/tvrtka/flota', roles: ['VLASNIK'], icon: IconSailboat },
  { label: 'Dodatne usluge', to: '/tvrtka/usluge', roles: ['VLASNIK'], icon: IconSparkles },
  { label: 'Djelatnici', to: '/tvrtka/djelatnici', roles: ['VLASNIK'], icon: IconUsers },
  { label: 'Podaci o tvrtki', to: '/tvrtka/podaci', roles: ['VLASNIK'], icon: IconBuildingStore },
  { label: 'Statistika', to: '/tvrtka/statistika', roles: ['VLASNIK'], icon: IconChartBar },
]

export const ADMIN_NAV: NavItem[] = [
  { label: 'Tvrtke', to: '/administracija/tvrtke', roles: ['ADMINISTRATOR'], icon: IconBuilding },
  { label: 'Korisnici', to: '/administracija/korisnici', roles: ['ADMINISTRATOR'], icon: IconUserCog },
  { label: 'Kategorije', to: '/administracija/kategorije', roles: ['ADMINISTRATOR'], icon: IconCategory },
  { label: 'Luke', to: '/administracija/luke', roles: ['ADMINISTRATOR'], icon: IconAnchor },
]

export function visibleFor(items: NavItem[], role: Role | undefined) {
  return items.filter((item) => !item.roles || (role !== undefined && item.roles.includes(role)))
}

export function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}
