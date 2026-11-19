from rest_framework.exceptions import PermissionDenied

from accounts.permissions import HasActiveCompany


class CompanyScopedMixin:
    """Base for company panel views (ADR-02, docs 4.6, 4.9).

    Restricts the queryset to the logged-in user's company, so another company's object
    gives 404, and sets the company on create. Put it before the DRF base class:

        class XViewSet(CompanyScopedMixin, mixins.ListModelMixin, viewsets.GenericViewSet): ...
    """

    company_field = 'company'  # name of the FK to Company on the view's model

    def get_permissions(self):
        # The role comes from the view's permission_classes and is checked first
        # (anonymous 401, wrong role 403); HasActiveCompany is always added after it.
        return [*super().get_permissions(), HasActiveCompany()]

    def _user_company(self):
        company = self.request.user.company
        if company is None:
            raise PermissionDenied('Korisnik nema tvrtku.')
        return company

    def get_queryset(self):
        queryset = super().get_queryset()
        if getattr(
            self, 'swagger_fake_view', False
        ):  # drf-spectacular builds the schema without a user
            return queryset.none()
        return queryset.filter(**{self.company_field: self._user_company()})

    def perform_create(self, serializer):
        serializer.save(**{self.company_field: self._user_company()})
