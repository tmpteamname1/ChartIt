from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from companies.models import Company

from .models import Category, Photo, Port, Vessel


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


class CategoryBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class VesselListSerializer(serializers.ModelSerializer):
    """Kartica plovila na početnoj stranici i u pretrazi."""

    category = CategoryBriefSerializer(read_only=True)
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


class PhotoSerializer(serializers.ModelSerializer):
    """Fotografija plovila; image i thumbnail su apsolutni URL-ovi."""

    class Meta:
        model = Photo
        fields = ['id', 'image', 'thumbnail', 'sort_order']


class CompanyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'address', 'email', 'phone']


class VesselDetailSerializer(VesselListSerializer):
    """Detalji plovila na stranici /plovila/:id."""

    home_port = PortSerializer(read_only=True)
    company = CompanyContactSerializer(read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)
    year_built = serializers.IntegerField(read_only=True)

    class Meta(VesselListSerializer.Meta):
        fields = [
            *VesselListSerializer.Meta.fields,
            'description',
            'equipment',
            'year_built',
            'photos',
        ]
