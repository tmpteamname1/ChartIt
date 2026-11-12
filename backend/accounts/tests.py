import importlib
from io import StringIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.db import IntegrityError, transaction
from django.test import TestCase, override_settings
from django.urls import clear_url_caches, path
from rest_framework import views
from rest_framework.response import Response

import config.urls
from companies.models import Company

from .permissions import IsCompanyEmployee, IsCompanyOwner, IsPlatformAdmin
from .seed import TEST_USERS

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


class SeedTestUsersTests(TestCase):
    def seed(self):
        call_command('seed_test_users', stdout=StringIO())

    def test_creates_a_test_user_for_each_role(self):
        self.seed()

        roles = set(User.objects.filter(username__in=TEST_USERS).values_list('role', flat=True))
        self.assertEqual(roles, set(User.Role))

    def test_staff_belong_to_test_companies(self):
        self.seed()

        users = {user.username: user for user in User.objects.select_related('company')}
        self.assertEqual(users['test-djelatnik'].company.name, 'Testna tvrtka d.o.o.')
        self.assertEqual(users['test-vlasnik'].company, users['test-djelatnik'].company)
        self.assertEqual(users['test-vlasnik-2'].company.name, 'Druga testna tvrtka d.o.o.')
        self.assertIsNone(users['test-korisnik'].company)
        self.assertIsNone(users['test-administrator'].company)

    def test_running_twice_creates_no_duplicates(self):
        self.seed()
        self.seed()

        self.assertEqual(User.objects.count(), len(TEST_USERS))
        self.assertEqual(Company.objects.count(), 2)

    def test_test_users_have_no_usable_password(self):
        self.seed()

        self.assertFalse(any(user.has_usable_password() for user in User.objects.all()))


def _reload_urls():
    # config.urls reads ENABLE_TEST_LOGIN once, when the module is imported.
    clear_url_caches()
    importlib.reload(config.urls)


class _TestLoginFlagMixin:
    enable_test_login = None

    def setUp(self):
        with self.settings(ENABLE_TEST_LOGIN=self.enable_test_login):
            _reload_urls()
        self.addCleanup(_reload_urls)


class TestLoginDisabledTests(_TestLoginFlagMixin, TestCase):
    enable_test_login = False

    def test_endpoints_do_not_exist(self):
        call_command('seed_test_users', stdout=StringIO())

        for url in ['/api/auth/test-login/', '/api/auth/test-logout/']:
            with self.subTest(url=url):
                response = self.client.post(url, {'username': 'test-administrator'})

                self.assertEqual(response.status_code, 404)
        self.assertNotIn('_auth_user_id', self.client.session)


class TestLoginEnabledTests(_TestLoginFlagMixin, TestCase):
    enable_test_login = True

    @classmethod
    def setUpTestData(cls):
        call_command('seed_test_users', stdout=StringIO())
        User.objects.create_user(username='ana', email='ana@example.com', password='x')

    def login(self, username):
        return self.client.post('/api/auth/test-login/', {'username': username})

    def test_lists_test_users(self):
        data = self.client.get('/api/auth/test-login/').json()

        self.assertEqual({user['username'] for user in data}, set(TEST_USERS))

    def test_each_role_can_log_in(self):
        for username, (_, _, role, _) in TEST_USERS.items():
            with self.subTest(username=username):
                response = self.login(username)

                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()['role'], role)
                self.assertEqual(
                    self.client.session['_auth_user_id'],
                    str(User.objects.get(username=username).pk),
                )

    def test_logout_ends_the_session(self):
        self.login('test-vlasnik')

        response = self.client.post('/api/auth/test-logout/')

        self.assertEqual(response.status_code, 204)
        self.assertNotIn('_auth_user_id', self.client.session)

    def test_real_user_cannot_be_logged_in(self):
        response = self.login('ana')

        self.assertEqual(response.status_code, 400)
        self.assertIn('username', response.json()['errors'])
        self.assertNotIn('_auth_user_id', self.client.session)
