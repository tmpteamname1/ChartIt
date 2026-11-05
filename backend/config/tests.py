import tempfile
from io import StringIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.db import OperationalError
from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import path, reverse
from rest_framework import generics, serializers, views
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

import config.urls
from config.api import DefaultPagination
from config.validators import IMAGE_VALIDATORS, MAX_IMAGE_SIZE_MB


class HealthCheckTests(TestCase):
    def test_returns_ok_when_database_is_available(self):
        response = self.client.get(reverse('health'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok', 'database': 'ok'})

    def test_returns_503_without_details_when_database_is_unavailable(self):
        with (
            patch('config.views.connection.cursor', side_effect=OperationalError('connection refused')),
            self.assertLogs('config.views', level='ERROR'),
        ):
            response = self.client.get(reverse('health'))

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json(), {'status': 'error', 'database': 'unavailable'})

    def test_rejects_non_get_methods(self):
        response = self.client.post(reverse('health'))

        self.assertEqual(response.status_code, 405)


# Views used only by the API convention tests below; real endpoints live in the apps.
class _UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username']


class _UserList(generics.ListCreateAPIView):
    queryset = get_user_model().objects.order_by('id')
    serializer_class = _UserSerializer
    permission_classes = [AllowAny]


class _NonFieldError(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raise serializers.ValidationError('Termin je zauzet.')


class _LoginRequired(views.APIView):
    def get(self, request):
        return Response({})


class _AdminOnly(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({})


urlpatterns = [
    path('api/test/users/', _UserList.as_view()),
    path('api/test/non-field-error/', _NonFieldError.as_view()),
    path('api/test/login-required/', _LoginRequired.as_view()),
    path('api/test/admin-only/', _AdminOnly.as_view()),
    *config.urls.urlpatterns,
]


@override_settings(ROOT_URLCONF='config.tests')
class PaginationTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        User = get_user_model()
        User.objects.bulk_create(User(username=f'user{i}', email=f'user{i}@example.com') for i in range(25))

    def test_list_is_paginated_by_default(self):
        data = self.client.get('/api/test/users/').json()

        self.assertEqual(set(data), {'count', 'next', 'previous', 'results'})
        self.assertEqual(data['count'], 25)
        self.assertEqual(len(data['results']), 20)
        self.assertIsNotNone(data['next'])
        self.assertIsNone(data['previous'])

    def test_client_can_choose_page_size_up_to_the_limit(self):
        self.assertEqual(len(self.client.get('/api/test/users/?page_size=5').json()['results']), 5)

        with patch.object(DefaultPagination, 'max_page_size', 10):
            self.assertEqual(len(self.client.get('/api/test/users/?page_size=500').json()['results']), 10)


@override_settings(ROOT_URLCONF='config.tests')
class ErrorFormatTests(TestCase):
    def test_validation_error_lists_errors_by_field(self):
        response = self.client.post('/api/test/users/', {}, content_type='application/json')

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(set(data), {'detail', 'code', 'errors'})
        self.assertEqual(data['code'], 'invalid')
        self.assertIn('username', data['errors'])

    def test_non_field_validation_error(self):
        response = self.client.post('/api/test/non-field-error/')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['errors'], {'non_field_errors': ['Termin je zauzet.']})

    def test_not_logged_in_returns_401(self):
        response = self.client.get('/api/test/login-required/')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['code'], 'not_authenticated')
        self.assertIsNone(response.json()['errors'])

    def test_logged_in_without_permission_returns_403(self):
        self.client.force_login(get_user_model().objects.create_user(username='ana', email='ana@example.com'))

        response = self.client.get('/api/test/admin-only/')

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()['code'], 'permission_denied')

    def test_unknown_api_path_returns_404_in_api_format(self):
        response = self.client.get('/api/does-not-exist/')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['code'], 'not_found')


class ApiSchemaTests(TestCase):
    def test_schema_and_swagger_ui_are_public(self):
        self.assertEqual(self.client.get(reverse('schema')).status_code, 200)
        self.assertEqual(self.client.get(reverse('swagger-ui')).status_code, 200)

    def test_schema_generates_without_warnings(self):
        # Fails when a view cannot be described, e.g. a serializer field without a known type.
        call_command('spectacular', '--validate', '--fail-on-warn', stdout=StringIO(), stderr=StringIO())


class MediaTests(SimpleTestCase):
    def setUp(self):
        media_root = tempfile.TemporaryDirectory()
        self.addCleanup(media_root.cleanup)
        settings_override = override_settings(MEDIA_ROOT=media_root.name)
        settings_override.enable()
        self.addCleanup(settings_override.disable)

    def test_uploaded_file_is_served_under_media_url(self):
        name = default_storage.save('vessels/photo.jpg', ContentFile(b'image bytes'))

        response = self.client.get(default_storage.url(name))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(b''.join(response.streaming_content), b'image bytes')

    def test_missing_file_returns_404_instead_of_the_react_app(self):
        self.assertEqual(self.client.get('/media/vessels/missing.jpg').status_code, 404)

    def test_paths_outside_media_root_are_rejected(self):
        # serve() raises SuspiciousFileOperation, which Django answers with 400.
        self.assertEqual(self.client.get('/media/../settings.py').status_code, 400)


class ImageValidatorTests(SimpleTestCase):
    def validate(self, name, size=100):
        file = SimpleUploadedFile(name, b'x' * size)
        for validator in IMAGE_VALIDATORS:
            validator(file)

    def test_accepts_allowed_image_types(self):
        for name in ['photo.jpg', 'photo.JPEG', 'photo.png', 'photo.webp']:
            with self.subTest(name=name):
                self.validate(name)

    def test_rejects_other_file_types(self):
        for name in ['photo.gif', 'image.svg', 'page.html', 'photo']:
            with self.subTest(name=name), self.assertRaises(ValidationError):
                self.validate(name)

    def test_rejects_files_over_the_size_limit(self):
        limit = MAX_IMAGE_SIZE_MB * 1024 * 1024
        self.validate('photo.jpg', size=limit)

        with self.assertRaises(ValidationError) as context:
            self.validate('photo.jpg', size=limit + 1)
        self.assertEqual(context.exception.code, 'file_too_large')
