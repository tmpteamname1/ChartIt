from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Category, Port
from .serializers import CategorySerializer, PortSerializer


@extend_schema_view(
    list=extend_schema(summary='Popis kategorija plovila'),
    retrieve=extend_schema(summary='Detalji kategorije plovila'),
)
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None


@extend_schema_view(
    list=extend_schema(summary='Popis luka'),
    retrieve=extend_schema(summary='Detalji luke'),
)
class PortViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Port.objects.all()
    serializer_class = PortSerializer
    permission_classes = [AllowAny]
    pagination_class = None
