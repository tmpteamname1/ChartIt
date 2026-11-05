from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.functions import Lower


class User(AbstractUser):
    """Single user table for all roles (ER diagram, 4.3.1).

    Users are deactivated with is_active = False instead of being deleted (4.6).
    """

    class Role(models.TextChoices):
        KORISNIK = 'KORISNIK', 'Korisnik'
        DJELATNIK = 'DJELATNIK', 'Djelatnik'
        VLASNIK = 'VLASNIK', 'Vlasnik'
        ADMINISTRATOR = 'ADMINISTRATOR', 'Administrator'

    # Unique because OAuth accounts are linked to users by e-mail.
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.KORISNIK)

    # TODO: nullable foreign key company, added once the companies app exists.

    REQUIRED_FIELDS = ['email']

    class Meta:
        constraints = [
            # unique=True alone is case-sensitive in PostgreSQL (Ana@x.com != ana@x.com).
            models.UniqueConstraint(Lower('email'), name='accounts_user_email_ci_unique'),
        ]
