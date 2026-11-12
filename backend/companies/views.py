from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Company
from .serializers import CompanySerializer


@extend_schema_view(
    list=extend_schema(summary='Popis aktivnih tvrtki'),
    retrieve=extend_schema(summary='Detalji aktivne tvrtke'),
)
class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.filter(is_active=True)
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
