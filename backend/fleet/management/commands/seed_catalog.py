from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from fleet.seed import reset_catalog, seed_catalog


class Command(BaseCommand):
    help = 'Creates the demo catalog: companies, ports, categories, vessels and photos.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete the catalog data created by this command and create it again.',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Allow running when DEBUG is off (never on the public instance).',
        )

    def handle(self, *args, **options):
        if not settings.DEBUG and not options['force']:
            raise CommandError('DEBUG is off. Use --force to run seed_catalog anyway.')

        with transaction.atomic():
            if options['reset']:
                reset_catalog()
            counts = seed_catalog()

        self.stdout.write(
            self.style.SUCCESS(
                'Created: {companies} companies, {ports} ports, {categories} categories, '
                '{vessels} vessels, {photos} photos'.format(**counts)
            )
        )
