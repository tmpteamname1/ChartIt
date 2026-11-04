// Mirrors User.Role in backend/accounts/models.py.
export type Role = 'KORISNIK' | 'DJELATNIK' | 'VLASNIK' | 'ADMINISTRATOR'

export const ROLES: Role[] = ['KORISNIK', 'DJELATNIK', 'VLASNIK', 'ADMINISTRATOR']

export const ROLE_LABELS: Record<Role, string> = {
  KORISNIK: 'Korisnik',
  DJELATNIK: 'Djelatnik',
  VLASNIK: 'Vlasnik',
  ADMINISTRATOR: 'Administrator',
}

export const COMPANY_ROLES: Role[] = ['DJELATNIK', 'VLASNIK']

// Where a user lands after login when they did not come from a protected page.
export const HOME_BY_ROLE: Record<Role, string> = {
  KORISNIK: '/',
  DJELATNIK: '/tvrtka',
  VLASNIK: '/tvrtka',
  ADMINISTRATOR: '/administracija',
}
