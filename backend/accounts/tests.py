from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from django.urls import path
from rest_framework import views
from rest_framework.response import Response

from companies.models import Company

from .permissions import IsCompanyEmployee, IsCompanyOwner, IsPlatformAdmin

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


# Views used only by the permission tests below.
def _view_with(permission_class):
    class _View(views.APIView):
        permission_classes = [permission_class]

        def get(self, request):
            return Response({})

    return _View.as_view()


urlpatterns = [
    path('api/test/platform-admin/', _view_with(IsPlatformAdmin)),
    path('api/test/company-owner/', _view_with(IsCompanyOwner)),
    path('api/test/company-employee/', _view_with(IsCompanyEmployee)),
]


@override_settings(ROOT_URLCONF='accounts.tests')
class RolePermissionTests(TestCase):
    # Expected status for each endpoint and role.
    EXPECTED = {
        '/api/test/platform-admin/': {
            User.Role.KORISNIK: 403,
            User.Role.DJELATNIK: 403,
            User.Role.VLASNIK: 403,
            User.Role.ADMINISTRATOR: 200,
        },
        '/api/test/company-owner/': {
            User.Role.KORISNIK: 403,
            User.Role.DJELATNIK: 403,
            User.Role.VLASNIK: 200,
            User.Role.ADMINISTRATOR: 403,
        },
        '/api/test/company-employee/': {
            User.Role.KORISNIK: 403,
            User.Role.DJELATNIK: 200,
            User.Role.VLASNIK: 200,
            User.Role.ADMINISTRATOR: 403,
        },
    }

    @classmethod
    def setUpTestData(cls):
        company = Company.objects.create(
            name='Test Charter',
            oib='69435151530',
            address='Split',
            email='test@example.com',
            phone='+385911234567',
        )
        cls.users = {
            role: User.objects.create_user(
                username=role.lower(),
                email=f'{role.lower()}@example.com',
                role=role,
                company=company if role in (User.Role.DJELATNIK, User.Role.VLASNIK) else None,
            )
            for role in User.Role
        }

    def test_each_role_gets_expected_status(self):
        for url, expected in self.EXPECTED.items():
            for role, status in expected.items():
                with self.subTest(url=url, role=role):
                    self.client.force_login(self.users[role])

                    self.assertEqual(self.client.get(url).status_code, status)

    def test_anonymous_user_gets_401(self):
        for url in self.EXPECTED:
            with self.subTest(url=url):
                response = self.client.get(url)

                self.assertEqual(response.status_code, 401)
                self.assertEqual(response.json()['code'], 'not_authenticated')

    def test_deactivated_user_is_rejected(self):
        user = self.users[User.Role.ADMINISTRATOR]
        self.client.force_login(user)
        user.is_active = False
        user.save()

        response = self.client.get('/api/test/platform-admin/')

        # The session no longer authenticates an inactive user, so the request counts as anonymous.
        self.assertEqual(response.status_code, 401)

    def test_role_is_read_from_the_database_not_the_request(self):
        self.client.force_login(self.users[User.Role.KORISNIK])

        response = self.client.get('/api/test/platform-admin/', {'role': 'ADMINISTRATOR'})

        self.assertEqual(response.status_code, 403)
