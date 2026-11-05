from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

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
