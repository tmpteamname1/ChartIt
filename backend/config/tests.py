from unittest.mock import patch

from django.db import OperationalError
from django.test import TestCase
from django.urls import reverse


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
