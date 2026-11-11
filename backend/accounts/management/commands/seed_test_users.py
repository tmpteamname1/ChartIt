from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.seed import TEST_USERS, seed_test_users


class Command(BaseCommand):
    help = 'Creates a test user for each role and the test companies (local development).'

    def handle(self, *args, **options):
        with transaction.atomic():
            seed_test_users()
        self.stdout.write(self.style.SUCCESS(f'Test users ready: {", ".join(TEST_USERS)}'))
