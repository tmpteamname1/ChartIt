from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Q
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

    # Customers and platform administrators have no company; staff and owners belong to one.
    # PROTECT: companies are deactivated, not deleted (4.6).
    company = models.ForeignKey(
        'companies.Company',
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name='employees',
        limit_choices_to={'is_active': True},
        verbose_name='tvrtka',
    )

    REQUIRED_FIELDS = ['email']

    class Meta:
        constraints = [
            # unique=True alone is case-sensitive in PostgreSQL (Ana@x.com != ana@x.com).
            models.UniqueConstraint(Lower('email'), name='accounts_user_email_ci_unique'),
            # Staff and owners belong to a company; customers and administrators don't.
            models.CheckConstraint(
                condition=(
                    Q(role__in=['DJELATNIK', 'VLASNIK'], company__isnull=False)
                    | Q(role__in=['KORISNIK', 'ADMINISTRATOR'], company__isnull=True)
                ),
                name='accounts_user_company_matches_role',
                violation_error_message='Djelatnici i vlasnici moraju imati tvrtku, a korisnici i administratori ne smiju je imati.',
            ),
        ]
