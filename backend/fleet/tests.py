from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase, override_settings
from rest_framework.test import APITestCase

from companies.models import Company

from .models import Category, Port, Vessel


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
