from django_filters import rest_framework as filters
from rest_framework import filters as drf_filters


from .models import Vessel


class VesselFilter(filters.FilterSet):
    port = filters.NumberFilter(field_name='home_port_id', help_text='Id matične luke.')
    category = filters.NumberFilter(field_name='category_id', help_text='Id kategorije plovila.')
    company = filters.NumberFilter(field_name='company_id', help_text='Id charter tvrtke.')
    people = filters.NumberFilter(
        field_name='max_people',
        lookup_expr='gte',
        help_text='Broj osoba; vraća plovila kojima je najveći broj osoba najmanje toliki.',
    )
    min_price = filters.NumberFilter(
        field_name='daily_price', lookup_expr='gte', help_text='Najmanja dnevna cijena (EUR).'
    )
    max_price = filters.NumberFilter(
        field_name='daily_price', lookup_expr='lte', help_text='Najveća dnevna cijena (EUR).'
    )

    class Meta:
        model = Vessel
        fields = []
        

class StableOrderingFilter(drf_filters.OrderingFilter):
    """OrderingFilter koji uvijek dodaje 'id' kao zadnji ključ, da straničenje bude stabilno."""

    def get_ordering(self, request, queryset, view):
        ordering = super().get_ordering(request, queryset, view)
        if ordering and 'id' not in ordering and '-id' not in ordering:
            ordering = [*ordering, 'id']
        return ordering
