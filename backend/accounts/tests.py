from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase

from companies.models import Company

User = get_user_model()


class UserModelTests(TestCase):
    def test_new_user_gets_korisnik_role_by_default(self):
        user = User.objects.create_user(username='ana', email='ana@example.com', password='x')

        self.assertEqual(user.role, User.Role.KORISNIK)

    def test_email_is_unique(self):
        User.objects.create_user(username='ana', email='ana@example.com')

        with self.assertRaises(IntegrityError):
            User.objects.create_user(username='ana2', email='ana@example.com')

    def test_email_is_unique_regardless_of_case(self):
        User.objects.create_user(username='ana', email='ana@example.com')

        with self.assertRaises(IntegrityError):
            User.objects.create_user(username='ana2', email='Ana@Example.com')

    def test_employee_must_have_company(self):
        with self.assertRaises(IntegrityError), transaction.atomic():
            User.objects.create_user(
                username='employee',
                email='employee@example.com',
                role=User.Role.DJELATNIK,
            )

    def test_customer_cannot_have_company(self):
        company = Company.objects.create(
            name='Test Charter',
            oib='12345678901',
            address='Split',
            email='test@example.com',
            phone='+385911234567',
        )

        with self.assertRaises(IntegrityError), transaction.atomic():
            User.objects.create_user(
                username='customer',
                email='customer@example.com',
                company=company,
            )
