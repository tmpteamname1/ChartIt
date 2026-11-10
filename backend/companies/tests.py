from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models.deletion import ProtectedError
from django.test import TestCase

from .models import Company

User = get_user_model()

# Oba OIB-a imaju ispravnu kontrolnu znamenku (ISO 7064, MOD 11,10).
VALID_OIB = '69435151530'
OTHER_VALID_OIB = '12345678903'


def company_data(**overrides):
    data = {
        'name': 'Test Charter',
        'oib': VALID_OIB,
        'address': 'Riva 1, 21000 Split',
        'email': 'test@example.com',
        'phone': '+385911234567',
    }
    data.update(overrides)
    return data


def build_company(**overrides):
    """Nespremljena tvrtka, za testove s full_clean()."""
    return Company(**company_data(**overrides))


def create_company(**overrides):
    return Company.objects.create(**company_data(**overrides))


class CompanyModelTests(TestCase):
    def test_company_string_representation(self):
        company = build_company(name='Adria Charter')

        self.assertEqual(str(company), 'Adria Charter')

    def test_company_is_active_by_default(self):
        company = create_company()

        self.assertTrue(company.is_active)

    def test_companies_are_ordered_by_name(self):
        create_company(name='Zeta', oib=VALID_OIB)
        create_company(name='Alfa', oib=OTHER_VALID_OIB)

        names = list(Company.objects.values_list('name', flat=True))

        self.assertEqual(names, ['Alfa', 'Zeta'])


class CompanyOibTests(TestCase):
    def assertOibRejected(self, oib):
        with self.assertRaises(ValidationError) as ctx:
            build_company(oib=oib).full_clean()

        self.assertIn('oib', ctx.exception.message_dict)

    def test_valid_oib_passes_validation(self):
        build_company().full_clean()

    def test_oib_must_have_exactly_11_digits(self):
        for oib in ['12345', '1234567890', '123456789012', '']:
            with self.subTest(oib=oib):
                self.assertOibRejected(oib)

    def test_oib_cannot_contain_letters_or_spaces(self):
        for oib in ['6943515153A', '69435 51530', '6943515153-']:
            with self.subTest(oib=oib):
                self.assertOibRejected(oib)

    def test_oib_with_wrong_check_digit_is_rejected(self):
        self.assertOibRejected('12345678901')

    def test_all_zero_oib_is_rejected(self):
        self.assertOibRejected('00000000000')

    def test_non_ascii_digit_is_rejected_without_crashing(self):
        # '²'.isdigit() je True, a int('²') bi bacio ValueError.
        self.assertOibRejected('6943515153²')

    def test_oib_is_unique_in_validation(self):
        create_company(oib=VALID_OIB)

        with self.assertRaises(ValidationError) as ctx:
            build_company(name='Druga tvrtka', oib=VALID_OIB).full_clean()

        self.assertIn('oib', ctx.exception.message_dict)

    def test_oib_is_unique_in_database(self):
        create_company(oib=VALID_OIB)

        with self.assertRaises(IntegrityError), transaction.atomic():
            create_company(name='Druga tvrtka', oib=VALID_OIB)


class CompanyUserRelationTests(TestCase):
    def test_user_can_be_created_without_company(self):
        user = User.objects.create_user(username='ana', email='ana@example.com')

        self.assertIsNone(user.company)

    def test_company_lists_its_employees(self):
        company = create_company()
        user = User.objects.create_user(
            username='ana',
            email='ana@example.com',
            company=company,
        )

        self.assertEqual(list(company.employees.all()), [user])

    def test_company_cannot_be_deleted_if_it_has_employees(self):
        company = create_company()
        User.objects.create_user(
            username='ana',
            email='ana@example.com',
            password='test123',
            company=company,
        )

        with self.assertRaises(ProtectedError):
            company.delete()

        self.assertTrue(Company.objects.filter(pk=company.pk).exists())

    def test_company_without_employees_can_be_deleted(self):
        company = create_company()

        company.delete()

        self.assertFalse(Company.objects.exists())