from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny

from .filters import VesselFilter
from .models import Category, Photo, Port, Vessel
from .serializers import CategorySerializer, PortSerializer, VesselListSerializer


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


@extend_schema_view(
    list=extend_schema(
        summary='Popis plovila',
        description=(
            'Javni popis aktivnih plovila aktivnih tvrtki za početnu stranicu i pretragu. '
            'Podržava filtre, pretragu po nazivu (`search`), sortiranje (`ordering`) i straničenje.'
        ),
    ),
)
class VesselViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = (
        Vessel.objects.filter(is_active=True, company__is_active=True)
        .select_related('company', 'category', 'home_port')
        .prefetch_related(Prefetch('photos', queryset=Photo.objects.all()))
    )
    serializer_class = VesselListSerializer
    permission_classes = [AllowAny]
    filterset_class = VesselFilter
    search_fields = ['name']
    ordering_fields = ['daily_price', 'length_m', 'name']
    ordering = ['name', 'id']  # id kao drugi ključ da straničenje bude stabilno
