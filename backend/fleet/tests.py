from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase
from rest_framework.test import APITestCase

from .models import Category, Port


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

    def test_ports_public_with_coordinates(self):
        Port.objects.create(name='Split', latitude=Decimal('43.508133'), longitude=Decimal('16.440193'))

        response = self.client.get('/api/ports/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.json()[0]), {'id', 'name', 'latitude', 'longitude'})
