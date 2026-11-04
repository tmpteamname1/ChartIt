from django.db import connection
from django.test import TestCase


class DatabaseExtensionTests(TestCase):
    def test_btree_gist_extension_is_enabled(self):
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 FROM pg_extension WHERE extname = 'btree_gist'")
            self.assertIsNotNone(cursor.fetchone())
