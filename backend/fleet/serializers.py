from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from companies.models import Company

from .models import Category, Port, Vessel


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class PortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = ['id', 'name', 'latitude', 'longitude']


class PortBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Port
        fields = ['id', 'name']


class CompanyBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']


class VesselListSerializer(serializers.ModelSerializer):
    """Kartica plovila na početnoj stranici i u pretrazi."""

    category = CategorySerializer(read_only=True)
    home_port = PortBriefSerializer(read_only=True)
    company = CompanyBriefSerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Vessel
        fields = [
            'id',
            'name',
            'category',
            'home_port',
            'company',
            'max_people',
            'cabins',
            'length_m',
            'daily_price',
            'thumbnail',
        ]

    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_thumbnail(self, obj):
        # Fotografije su već dohvaćene (prefetch) i poredane po sort_order, id; uzimamo prvu.
        photo = next(iter(obj.photos.all()), None)
        if photo is None or not photo.thumbnail:
            return None
        return self.context['request'].build_absolute_uri(photo.thumbnail.url)
