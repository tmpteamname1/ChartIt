import tempfile
from datetime import date
from decimal import Decimal
from io import BytesIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.request import Request
from rest_framework.test import APITestCase, APIRequestFactory

from companies.models import Company

from .images import make_thumbnail
from .models import Category, Photo, Port, Vessel
from .filters import StableOrderingFilter
from .views import VesselViewSet


class CategoryTests(TestCase):
    def test_str_returns_name(self):
        self.assertEqual(str(Category(name='Jedrilica')), 'Jedrilica')

    def test_duplicate_name_rejected(self):
        Category.objects.create(name='Jedrilica')
        # atomic - kod greške, promjene u bazi se ponište tako da se test nastavi normalno
        with self.assertRaises(IntegrityError), transaction.atomic():
            Category.objects.create(name='Jedrilica')

    def test_duplicate_name_rejected_case_insensitive(self):
        Category.objects.create(name='Jedrilica')
        with self.assertRaises(IntegrityError), transaction.atomic():
            Category.objects.create(name='jedrilica')

    def test_duplicate_name_with_spaces_rejected(self):
        Category.objects.create(name='Jedrilica')
        with self.assertRaises(IntegrityError), transaction.atomic():
            Category.objects.create(name=' Jedrilica ')

    def test_ordering_by_name(self):
        Category.objects.create(name='Katamaran')
        Category.objects.create(name='Jedrilica')
        names = list(Category.objects.values_list('name', flat=True))
        self.assertEqual(names, ['Jedrilica', 'Katamaran'])


class PortTests(TestCase):
    def make_port(self, name='Split', lat='43.508133', lon='16.440193'):
        return Port(name=name, latitude=Decimal(lat), longitude=Decimal(lon))

    def test_valid_port_passes_validation(self):
        self.make_port().full_clean()  # full_clean() sam pokreće validatore

    def test_latitude_above_range_rejected(self):
        with self.assertRaises(ValidationError):
            self.make_port(lat='90.5').full_clean()

    def test_latitude_below_range_rejected(self):
        with self.assertRaises(ValidationError):
            self.make_port(lat='-90.5').full_clean()

    def test_longitude_above_range_rejected(self):
        with self.assertRaises(ValidationError):
            self.make_port(lon='180.5').full_clean()

    def test_longitude_below_range_rejected(self):
        with self.assertRaises(ValidationError):
            self.make_port(lon='-180.5').full_clean()

    def test_latitude_out_of_range_rejected_by_database(self):
        # baza mora odbiti krive koordinate i bez full_clean()
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.make_port(lat='123').save()

    def test_longitude_out_of_range_rejected_by_database(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.make_port(lon='500').save()

    def test_duplicate_name_rejected(self):
        self.make_port().save()
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.make_port().save()

    def test_duplicate_name_rejected_case_insensitive(self):
        self.make_port().save()
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.make_port(name='split').save()

    def test_coordinates_keep_precision(self):
        self.make_port().save()
        port = Port.objects.get(name='Split')
        self.assertEqual(port.latitude, Decimal('43.508133'))
        self.assertEqual(port.longitude, Decimal('16.440193'))


class PublicApiTests(APITestCase):
    def test_categories_public_sorted_not_paginated(self):
        Category.objects.create(name='Katamaran')
        Category.objects.create(name='Jedrilica')

        response = self.client.get('/api/categories/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual([c['name'] for c in response.json()], ['Jedrilica', 'Katamaran'])

    def test_ports_public_sorted_with_coordinates(self):
        Port.objects.create(
            name='Zadar', latitude=Decimal('44.119371'), longitude=Decimal('15.231365')
        )
        Port.objects.create(
            name='Split', latitude=Decimal('43.508133'), longitude=Decimal('16.440193')
        )
        Port.objects.create(
            name='Pula', latitude=Decimal('44.866623'), longitude=Decimal('13.849578')
        )

        response = self.client.get('/api/ports/')

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual([p['name'] for p in data], ['Pula', 'Split', 'Zadar'])
        self.assertEqual(set(data[0]), {'id', 'name', 'latitude', 'longitude'})


class VesselTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(
            name='Adria Charter',
            oib='69435151530',
            address='Riva 1, Split',
            email='info@adria.example',
            phone='+385911234567',
        )
        self.category = Category.objects.create(name='Jedrilica')
        self.port = Port.objects.create(
            name='Split', latitude=Decimal('43.508133'), longitude=Decimal('16.440193')
        )

    def make_vessel(self, **overrides):
        data = {
            'company': self.company,
            'category': self.category,
            'home_port': self.port,
            'name': 'Bonaca',
            'length_m': Decimal('12.50'),
            'max_people': 8,
            'cabins': 3,
            'year_built': 2015,
            'daily_price': Decimal('250.00'),
        }
        data.update(overrides)
        return Vessel(**data)

    def create_vessel(self, **overrides):
        vessel = self.make_vessel(**overrides)
        vessel.save()
        return vessel

    def test_str_shows_name_and_company(self):
        self.assertEqual(str(self.make_vessel()), 'Bonaca (Adria Charter)')

    def test_is_active_by_default(self):
        self.assertTrue(self.create_vessel().is_active)

    def test_description_and_equipment_can_be_blank(self):
        self.make_vessel(description='', equipment='').full_clean()

    def test_ordering_by_name(self):
        self.create_vessel(name='Zeta')
        self.create_vessel(name='Alfa')
        names = list(Vessel.objects.values_list('name', flat=True))
        self.assertEqual(names, ['Alfa', 'Zeta'])

    def test_negative_price_rejected_by_database(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.create_vessel(daily_price=Decimal('-0.01'))

    def test_zero_price_allowed(self):
        self.create_vessel(daily_price=Decimal('0.00'))

    def test_zero_max_people_rejected_by_database(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.create_vessel(max_people=0)

    def test_zero_length_rejected_by_database(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            self.create_vessel(length_m=Decimal('0.00'))

    def test_year_built_before_1900_rejected(self):
        with self.assertRaises(ValidationError) as ctx:
            self.make_vessel(year_built=1899).full_clean()
        self.assertIn('year_built', ctx.exception.message_dict)

    def test_year_built_in_future_rejected(self):
        with self.assertRaises(ValidationError) as ctx:
            self.make_vessel(year_built=date.today().year + 1).full_clean()
        self.assertIn('year_built', ctx.exception.message_dict)

    def test_year_built_current_year_allowed(self):
        self.make_vessel(year_built=date.today().year).full_clean()

    def test_company_with_vessels_cannot_be_deleted(self):
        self.create_vessel()
        with self.assertRaises(ProtectedError):
            self.company.delete()

    def test_category_with_vessels_cannot_be_deleted(self):
        self.create_vessel()
        with self.assertRaises(ProtectedError):
            self.category.delete()

    def test_port_with_vessels_cannot_be_deleted(self):
        self.create_vessel()
        with self.assertRaises(ProtectedError):
            self.port.delete()

    def test_related_name_vessels(self):
        vessel = self.create_vessel()
        self.assertEqual(list(self.company.vessels.all()), [vessel])
        self.assertEqual(list(self.category.vessels.all()), [vessel])
        self.assertEqual(list(self.port.vessels.all()), [vessel])


@override_settings(
    STORAGES={
        'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
        'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
    }
)
class VesselAdminTests(TestCase):
    def setUp(self):
        User = get_user_model()
        admin = User.objects.create_superuser('admin', 'admin@example.com', 'x')
        self.client.force_login(admin)

    def test_changelist_and_add_form_load(self):
        for url in ('/admin/fleet/vessel/', '/admin/fleet/vessel/add/'):
            with self.subTest(url=url):
                self.assertEqual(self.client.get(url, secure=True).status_code, 200)


def make_image_file(name='photo.jpg', size=(2000, 1000), fmt='JPEG'):
    """Testna slika izrađena u kodu, bez datoteka u repozitoriju."""
    buffer = BytesIO()
    Image.new('RGB', size).save(buffer, format=fmt)
    return SimpleUploadedFile(name, buffer.getvalue())


class MakeThumbnailTests(TestCase):
    def open_result(self, result):
        result.seek(0)
        return Image.open(BytesIO(result.read()))

    def test_thumbnail_is_webp_with_longer_side_800_and_same_ratio(self):
        result = make_thumbnail(make_image_file(size=(2000, 1000)))

        image = self.open_result(result)
        self.assertEqual(image.format, 'WEBP')
        self.assertEqual(image.size, (800, 400))
        self.assertTrue(result.name.endswith('.webp'))

    def test_small_image_is_not_enlarged(self):
        result = make_thumbnail(make_image_file(size=(300, 200)))

        self.assertEqual(self.open_result(result).size, (300, 200))


class PhotoTests(TestCase):
    def setUp(self):
        # Datoteke iz testova idu u privremenu mapu, ne u backend/media.
        media_root = tempfile.TemporaryDirectory()
        self.addCleanup(media_root.cleanup)
        media_override = override_settings(MEDIA_ROOT=media_root.name)
        media_override.enable()
        self.addCleanup(media_override.disable)

        company = Company.objects.create(
            name='Test Charter',
            oib='69435151530',
            address='Riva 1, Split',
            email='test@example.com',
            phone='+385911234567',
        )
        category = Category.objects.create(name='Jedrilica')
        port = Port.objects.create(
            name='Split', latitude=Decimal('43.508133'), longitude=Decimal('16.440193')
        )
        self.vessel = Vessel.objects.create(
            company=company,
            category=category,
            home_port=port,
            name='Adria',
            length_m=Decimal(12),
            max_people=8,
            cabins=3,
            year_built=2020,
            daily_price=Decimal(250),
        )

    def make_photo(self, **kwargs):
        return Photo.objects.create(vessel=self.vessel, image=make_image_file(), **kwargs)

    def test_saving_photo_creates_thumbnail(self):
        photo = self.make_photo()

        self.assertTrue(photo.thumbnail.name.endswith('.webp'))
        self.assertTrue(default_storage.exists(photo.image.name))
        self.assertTrue(default_storage.exists(photo.thumbnail.name))
        self.assertTrue(photo.image.name.startswith(f'vessels/{self.vessel.id}/'))

    def test_changing_only_sort_order_does_not_recreate_thumbnail(self):
        photo = Photo.objects.get(pk=self.make_photo().pk)
        thumbnail_name = photo.thumbnail.name

        with patch('fleet.models.make_thumbnail') as mocked:
            photo.sort_order = 5
            photo.save()

        mocked.assert_not_called()
        photo.refresh_from_db()
        self.assertEqual(photo.thumbnail.name, thumbnail_name)
        self.assertEqual(photo.sort_order, 5)

    def test_deleting_photo_deletes_files(self):
        photo = self.make_photo()
        image_name, thumbnail_name = photo.image.name, photo.thumbnail.name

        photo.delete()

        self.assertFalse(default_storage.exists(image_name))
        self.assertFalse(default_storage.exists(thumbnail_name))

    def test_deleting_vessel_deletes_photo_files(self):
        photo = self.make_photo()
        image_name, thumbnail_name = photo.image.name, photo.thumbnail.name

        self.vessel.delete()

        self.assertFalse(default_storage.exists(image_name))
        self.assertFalse(default_storage.exists(thumbnail_name))

    def test_photos_are_ordered_by_sort_order(self):
        second = self.make_photo(sort_order=2)
        first = self.make_photo(sort_order=1)

        self.assertEqual(list(self.vessel.photos.all()), [first, second])

    def test_non_image_extension_is_rejected(self):
        photo = Photo(vessel=self.vessel, image=make_image_file('photo.gif', fmt='GIF'))

        with self.assertRaises(ValidationError):
            photo.full_clean()

    def test_replacing_image_deletes_old_files(self):
        photo = Photo.objects.get(pk=self.make_photo().pk)
        old_image, old_thumbnail = photo.image.name, photo.thumbnail.name

        photo.image = make_image_file('new.jpg')
        photo.save()

        self.assertFalse(default_storage.exists(old_image))
        self.assertFalse(default_storage.exists(old_thumbnail))
        self.assertTrue(default_storage.exists(photo.image.name))


class VesselListApiTests(APITestCase):
    URL = '/api/vessels/'

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls._media = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls._media.cleanup)
        override = override_settings(MEDIA_ROOT=cls._media.name)
        override.enable()
        cls.addClassCleanup(override.disable)

    def setUp(self):
        self.company = self.make_company('Adria Charter', '69435151530')
        self.category = Category.objects.create(name='Jedrilica')
        self.port = Port.objects.create(
            name='Split', latitude=Decimal('43.508133'), longitude=Decimal('16.440193')
        )
        self.counter = 0

    def make_company(self, name, oib, **kwargs):
        return Company.objects.create(
            name=name,
            oib=oib,
            address='Riva 1, Split',
            email='info@example.com',
            phone='+385911234567',
            **kwargs,
        )

    def make_vessel(self, **overrides):
        self.counter += 1
        data = {
            'company': self.company,
            'category': self.category,
            'home_port': self.port,
            'name': f'Plovilo {self.counter:02d}',
            'length_m': Decimal('12.50'),
            'max_people': 8,
            'cabins': 3,
            'year_built': 2015,
            'daily_price': Decimal('150.00'),
        }
        data.update(overrides)
        return Vessel.objects.create(**data)

    def make_photo(self, vessel, **kwargs):
        return Photo.objects.create(vessel=vessel, image=make_image_file(size=(100, 50)), **kwargs)

    def get(self, **params):
        response = self.client.get(self.URL, params)
        self.assertEqual(response.status_code, 200)
        return response.json()

    def names(self, **params):
        return [item['name'] for item in self.get(**params)['results']]

    # Oblik odgovora

    def test_endpoint_is_public_and_paginated(self):
        self.make_vessel()

        data = self.get()

        self.assertEqual(set(data), {'count', 'next', 'previous', 'results'})
        self.assertEqual(data['count'], 1)

    def test_card_fields(self):
        vessel = self.make_vessel(name='Bonaca')

        card = self.get()['results'][0]

        self.assertEqual(
            card,
            {
                'id': vessel.id,
                'name': 'Bonaca',
                'category': {'id': self.category.id, 'name': 'Jedrilica'},
                'home_port': {'id': self.port.id, 'name': 'Split'},
                'company': {'id': self.company.id, 'name': 'Adria Charter'},
                'max_people': 8,
                'cabins': 3,
                'length_m': '12.50',
                'daily_price': '150.00',
                'thumbnail': None,
            },
        )

    def test_default_page_size_is_20(self):
        for _ in range(21):
            self.make_vessel()

        data = self.get()

        self.assertEqual(data['count'], 21)
        self.assertEqual(len(data['results']), 20)
        self.assertIsNotNone(data['next'])

    # Vidljivost

    def test_inactive_vessel_is_hidden(self):
        self.make_vessel(name='Aktivno')
        self.make_vessel(name='Neaktivno', is_active=False)

        self.assertEqual(self.names(), ['Aktivno'])

    def test_vessel_of_inactive_company_is_hidden(self):
        inactive = self.make_company('Zatvorena', '12345678903', is_active=False)
        self.make_vessel(name='Aktivno')
        self.make_vessel(name='Tuđe', company=inactive)

        self.assertEqual(self.names(), ['Aktivno'])

    # Filtri

    def test_filter_by_port(self):
        other = Port.objects.create(
            name='Zadar', latitude=Decimal('44.1'), longitude=Decimal('15.2')
        )
        self.make_vessel(name='Split')
        self.make_vessel(name='Zadar', home_port=other)

        self.assertEqual(self.names(port=other.id), ['Zadar'])

    def test_filter_by_category(self):
        other = Category.objects.create(name='Katamaran')
        self.make_vessel(name='Jedrilica')
        self.make_vessel(name='Katamaran', category=other)

        self.assertEqual(self.names(category=other.id), ['Katamaran'])

    def test_filter_by_company(self):
        other = self.make_company('Druga tvrtka', '12345678903')
        self.make_vessel(name='Moje')
        self.make_vessel(name='Tuđe', company=other)

        self.assertEqual(self.names(company=other.id), ['Tuđe'])

    def test_filter_by_people_is_minimum_capacity(self):
        self.make_vessel(name='Za 4', max_people=4)
        self.make_vessel(name='Za 8', max_people=8)
        self.make_vessel(name='Za 12', max_people=12)

        self.assertEqual(self.names(people=8), ['Za 12', 'Za 8'])

    def test_filter_by_min_price(self):
        self.make_vessel(name='Jeftino', daily_price=Decimal(100))
        self.make_vessel(name='Skupo', daily_price=Decimal(300))

        self.assertEqual(self.names(min_price=200), ['Skupo'])

    def test_filter_by_max_price(self):
        self.make_vessel(name='Jeftino', daily_price=Decimal(100))
        self.make_vessel(name='Skupo', daily_price=Decimal(300))

        self.assertEqual(self.names(max_price=200), ['Jeftino'])

    def test_price_range_is_inclusive(self):
        self.make_vessel(name='A', daily_price=Decimal(100))
        self.make_vessel(name='B', daily_price=Decimal(200))
        self.make_vessel(name='C', daily_price=Decimal(300))

        self.assertEqual(self.names(min_price=100, max_price=200), ['A', 'B'])

    def test_filters_combine(self):
        self.make_vessel(name='Pogodak', max_people=8, daily_price=Decimal(150))
        self.make_vessel(name='Premalo osoba', max_people=2, daily_price=Decimal(150))
        self.make_vessel(name='Preskupo', max_people=8, daily_price=Decimal(900))

        self.assertEqual(self.names(people=6, max_price=200), ['Pogodak'])

    def test_invalid_filter_value_returns_400(self):
        response = self.client.get(self.URL, {'port': 'abc'})

        self.assertEqual(response.status_code, 400)

    # Pretraga i sortiranje

    def test_search_by_name_ignores_case(self):
        self.make_vessel(name='Bonaca')
        self.make_vessel(name='Maestral')

        self.assertEqual(self.names(search='bona'), ['Bonaca'])

    def test_default_ordering_is_by_name(self):
        self.make_vessel(name='Zeta')
        self.make_vessel(name='Alfa')

        self.assertEqual(self.names(), ['Alfa', 'Zeta'])

    def test_ordering_by_daily_price(self):
        self.make_vessel(name='Skupo', daily_price=Decimal(300))
        self.make_vessel(name='Jeftino', daily_price=Decimal(100))

        self.assertEqual(self.names(ordering='daily_price'), ['Jeftino', 'Skupo'])
        self.assertEqual(self.names(ordering='-daily_price'), ['Skupo', 'Jeftino'])

    def test_ordering_by_length(self):
        self.make_vessel(name='Dugo', length_m=Decimal(20))
        self.make_vessel(name='Kratko', length_m=Decimal(8))

        self.assertEqual(self.names(ordering='length_m'), ['Kratko', 'Dugo'])
        self.assertEqual(self.names(ordering='-length_m'), ['Dugo', 'Kratko'])

    def test_ordering_by_name(self):
        self.make_vessel(name='Alfa')
        self.make_vessel(name='Zeta')

        self.assertEqual(self.names(ordering='-name'), ['Zeta', 'Alfa'])

    # Minijatura

    def test_thumbnail_is_full_url_of_first_photo_by_sort_order(self):
        vessel = self.make_vessel()
        self.make_photo(vessel, sort_order=5)
        first = self.make_photo(vessel, sort_order=1)

        thumbnail = self.get()['results'][0]['thumbnail']

        self.assertEqual(thumbnail, 'http://testserver' + first.thumbnail.url)
        self.assertTrue(thumbnail.endswith('.webp'))

    # Broj upita

    def test_query_count_does_not_depend_on_number_of_vessels(self):
        for _ in range(2):
            self.make_photo(self.make_vessel())
        with self.assertNumQueries(3):  # count, plovila, fotografije
            self.client.get(self.URL)

        for _ in range(18):
            self.make_photo(self.make_vessel())
        with self.assertNumQueries(3):
            self.client.get(self.URL)

    def test_ordering_by_equal_price_has_stable_pagination(self):
        # 21 plovila iste cijene, pa se po cijeni ne mogu razlikovati
        for _ in range(21):
            self.make_vessel(daily_price=Decimal('150.00'))

        page1 = self.get(ordering='daily_price')
        page2 = self.get(ordering='daily_price', page=2)

        ids1 = [v['id'] for v in page1['results']]
        ids2 = [v['id'] for v in page2['results']]
        self.assertEqual(len(ids1), 20)
        self.assertEqual(len(ids2), 1)
        self.assertFalse(set(ids1) & set(ids2))  # stranice se ne preklapaju
        self.assertEqual(len(set(ids1 + ids2)), 21)  # nijedno plovilo ne nedostaje

    def test_ordering_always_ends_with_id(self):
        # Ne ovisi o redoslijedu koji baza vrati, pa pada bez StableOrderingFilter-a
        view = VesselViewSet()
        for param, expected in [
            ('daily_price', ['daily_price', 'id']),
            ('-length_m', ['-length_m', 'id']),
            ('name', ['name', 'id']),
        ]:
            with self.subTest(ordering=param):
                request = Request(APIRequestFactory().get(self.URL, {'ordering': param}))
                ordering = StableOrderingFilter().get_ordering(
                    request, Vessel.objects.all(), view
                )
                self.assertEqual(ordering, expected)
