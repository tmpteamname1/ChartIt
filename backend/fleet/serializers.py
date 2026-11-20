from datetime import date
from decimal import Decimal

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
    """Vessel card on the home page and in search results."""

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
        # Photos are already prefetched and ordered by sort_order, id; take the first one.
        photo = next(iter(obj.photos.all()), None)
        if photo is None or not photo.thumbnail:
            return None
        return self.context['request'].build_absolute_uri(photo.thumbnail.url)


class PhotoSerializer(serializers.ModelSerializer):
    """Vessel photo; image and thumbnail are absolute URLs."""

    class Meta:
        model = Photo
        fields = ['id', 'image', 'thumbnail', 'sort_order']


class CompanyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'address', 'email', 'phone']


class VesselDetailSerializer(VesselListSerializer):
    """Vessel details for the /plovila/:id page."""

    home_port = PortSerializer(read_only=True)
    company = CompanyContactSerializer(read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)
    # Declared explicitly: the model's MaxValueValidator(current_year) is a callable,
    # and drf-spectacular cannot turn it into a schema maximum.
    year_built = serializers.IntegerField(read_only=True)

    class Meta(VesselListSerializer.Meta):
        fields = [
            *VesselListSerializer.Meta.fields,
            'description',
            'equipment',
            'year_built',
            'photos',
        ]


class CompanyVesselSerializer(serializers.ModelSerializer):
    """Vessel in the company panel ("Flota" screen); includes inactive vessels."""

    category = CategoryBriefSerializer(read_only=True)
    home_port = PortBriefSerializer(read_only=True)
    # Same reason as in VesselDetailSerializer (callable MaxValueValidator).
    year_built = serializers.IntegerField(read_only=True)

    class Meta:
        model = Vessel
        fields = [
            'id',
            'name',
            'description',
            'equipment',
            'category',
            'home_port',
            'length_m',
            'max_people',
            'cabins',
            'year_built',
            'daily_price',
            'is_active',
        ]


class CompanyVesselCreateSerializer(serializers.ModelSerializer):
    """Input for POST /api/company/vessels/ (UC-04). Company and is_active are not input."""

    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    home_port = serializers.PrimaryKeyRelatedField(queryset=Port.objects.all())
    # Declared explicitly: the model's year validator is a callable (see above).
    year_built = serializers.IntegerField(min_value=1900)
    length_m = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=Decimal('0.01'))
    max_people = serializers.IntegerField(min_value=1, max_value=32767)
    cabins = serializers.IntegerField(min_value=0, max_value=32767)
    daily_price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)

    class Meta:
        model = Vessel
        fields = [
            'name',
            'description',
            'equipment',
            'category',
            'home_port',
            'length_m',
            'max_people',
            'cabins',
            'year_built',
            'daily_price',
        ]

    def validate_year_built(self, value):
        if value > date.today().year:
            raise serializers.ValidationError('Godina izgradnje ne može biti u budućnosti.')
        return value

    def to_representation(self, instance):
        # The response has the same shape as the details in the company panel.
        return CompanyVesselSerializer(instance, context=self.context).data
