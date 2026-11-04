import { createBrowserRouter, Navigate } from 'react-router'
import RequireRole from './auth/RequireRole'
import { COMPANY_ROLES } from './auth/roles'
import AppLayout from './layouts/AppLayout'
import { ADMIN_NAV, COMPANY_NAV } from './layouts/navigation'
import CategoriesPage from './pages/admin/CategoriesPage'
import CompaniesPage from './pages/admin/CompaniesPage'
import CompanyFormPage from './pages/admin/CompanyFormPage'
import PortsPage from './pages/admin/PortsPage'
import UsersPage from './pages/admin/UsersPage'
import CompanyProfilePage from './pages/company/CompanyProfilePage'
import CompanyReservationDetailsPage from './pages/company/CompanyReservationDetailsPage'
import CompanyReservationsPage from './pages/company/CompanyReservationsPage'
import EmployeesPage from './pages/company/EmployeesPage'
import FleetPage from './pages/company/FleetPage'
import RequestsPage from './pages/company/RequestsPage'
import SchedulePage from './pages/company/SchedulePage'
import ServicesPage from './pages/company/ServicesPage'
import StatisticsPage from './pages/company/StatisticsPage'
import UnavailabilityPage from './pages/company/UnavailabilityPage'
import VesselFormPage from './pages/company/VesselFormPage'
import NotFoundPage from './pages/errors/NotFoundPage'
import RouteErrorPage from './pages/errors/RouteErrorPage'
import CompanyPage from './pages/public/CompanyPage'
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import VesselDetailsPage from './pages/public/VesselDetailsPage'
import MyReservationDetailsPage from './pages/user/MyReservationDetailsPage'
import MyReservationsPage from './pages/user/MyReservationsPage'
import ReservationRequestPage from './pages/user/ReservationRequestPage'

// Routes follow the route map in docs/4-Arhitektura-i-oblikovanje.md (4.8).
// /admin belongs to Django, so platform administration lives under /administracija.
export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        // Public and user parts
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'plovila/:id', element: <VesselDetailsPage /> },
          { path: 'tvrtke/:id', element: <CompanyPage /> },
          { path: 'prijava', element: <LoginPage /> },
          {
            element: <RequireRole roles={['KORISNIK']} />,
            children: [
              { path: 'plovila/:id/rezervacija', element: <ReservationRequestPage /> },
              { path: 'moje-rezervacije', element: <MyReservationsPage /> },
              { path: 'moje-rezervacije/:id', element: <MyReservationDetailsPage /> },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        path: 'tvrtka',
        element: <AppLayout sidebar={COMPANY_NAV} />,
        children: [
          {
            element: <RequireRole roles={COMPANY_ROLES} />,
            children: [
              { index: true, element: <Navigate to="zahtjevi" replace /> },
              { path: 'zahtjevi', element: <RequestsPage /> },
              { path: 'raspored', element: <SchedulePage /> },
              { path: 'rezervacije/:id', element: <CompanyReservationDetailsPage /> },
              {
                element: <RequireRole roles={['VLASNIK']} />,
                children: [
                  { path: 'rezervacije', element: <CompanyReservationsPage /> },
                  { path: 'flota', element: <FleetPage /> },
                  { path: 'flota/novo', element: <VesselFormPage /> },
                  { path: 'flota/:id', element: <VesselFormPage /> },
                  { path: 'flota/:id/nedostupnost', element: <UnavailabilityPage /> },
                  { path: 'usluge', element: <ServicesPage /> },
                  { path: 'djelatnici', element: <EmployeesPage /> },
                  { path: 'podaci', element: <CompanyProfilePage /> },
                  { path: 'statistika', element: <StatisticsPage /> },
                ],
              },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
      {
        path: 'administracija',
        element: <AppLayout sidebar={ADMIN_NAV} />,
        children: [
          {
            element: <RequireRole roles={['ADMINISTRATOR']} />,
            children: [
              { index: true, element: <Navigate to="tvrtke" replace /> },
              { path: 'tvrtke', element: <CompaniesPage /> },
              { path: 'tvrtke/nova', element: <CompanyFormPage /> },
              { path: 'tvrtke/:id', element: <CompanyFormPage /> },
              { path: 'korisnici', element: <UsersPage /> },
              { path: 'kategorije', element: <CategoriesPage /> },
              { path: 'luke', element: <PortsPage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])
