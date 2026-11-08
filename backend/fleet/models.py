from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.functions import Lower


class Category(models.Model):
    """Vessel category shared by all companies (e.g. sailboat, catamaran)."""

    name = models.CharField('naziv', max_length=100, unique=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'kategorija plovila'
        verbose_name_plural = 'kategorije plovila'
        constraints = [
            # unique=True alone is case-sensitive in PostgreSQL.
            models.UniqueConstraint(Lower('name'), name='fleet_category_name_ci_unique'),
        ]

    def __str__(self):
        return self.name


class Port(models.Model):
    """Home port shared by all companies; coordinates are shown on the map."""

    name = models.CharField('naziv', max_length=100, unique=True)
    latitude = models.DecimalField(
        'geografska širina',
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
    )
    longitude = models.DecimalField(
        'geografska dužina',
        max_digits=9,
        decimal_places=6,
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'luka'
        verbose_name_plural = 'luke'
        constraints = [
            models.UniqueConstraint(Lower('name'), name='fleet_port_name_ci_unique'),
        ]

    def __str__(self):
        return self.name
