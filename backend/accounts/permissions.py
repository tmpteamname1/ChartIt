"""DRF permission classes by user role (docs chapter 4.6, F-18).

Usage on a view: permission_classes = [IsCompanyOwner]. Each class replaces the project
default IsAuthenticated and already requires a logged-in, active user.

These classes check only the role, not which company the data belongs to. Company panel
views also restrict get_queryset() to request.user.company through a shared base class
(ADR-02, #101).
"""

from rest_framework.permissions import BasePermission

from .models import User


class _HasRole(BasePermission):
    roles = ()

    def has_permission(self, request, view):
        user = request.user
        # The role comes from the database (request.user), never from the request data.
        return bool(user and user.is_authenticated and user.is_active and user.role in self.roles)


class IsPlatformAdmin(_HasRole):
    """Platform administrator (role ADMINISTRATOR)."""

    roles = (User.Role.ADMINISTRATOR,)


class IsCompanyOwner(_HasRole):
    """Owner of a charter company (role VLASNIK)."""

    roles = (User.Role.VLASNIK,)


class IsCompanyEmployee(_HasRole):
    """Charter company staff (role DJELATNIK); owners can do everything employees can."""

    roles = (User.Role.DJELATNIK, User.Role.VLASNIK)


class HasActiveCompany(BasePermission):
    """The user belongs to a company and that company is active (ADR-02, 4.6)."""

    message = 'Korisnik nema aktivnu tvrtku.'

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        company = user.company  # one query, cached on the user for the rest of the request
        return company is not None and company.is_active
