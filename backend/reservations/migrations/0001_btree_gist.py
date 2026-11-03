from django.contrib.postgres.operations import BtreeGistExtension
from django.db import migrations


class Migration(migrations.Migration):
    """Enable btree_gist, needed for the exclusion constraint that prevents overlapping reservations (ADR-03)."""

    initial = True

    dependencies = []

    operations = [
        BtreeGistExtension(),
    ]
