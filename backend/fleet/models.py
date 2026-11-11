from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.functions import Lower


class Category(models.Model):
    name = models.CharField('naziv', max_length=100)

    class Meta:
        ordering = ['name']
        verbose_name = 'kategorija plovila'
        verbose_name_plural = 'kategorije plovila'
        constraints = [  # ne razlikuje velika i mala slova, Jedrilica i jedrilica ne mogu oboje biti dodani
            models.UniqueConstraint(Lower('name'), name='fleet_category_name_ci_unique'),
        ]

    def save(self, *args, **kwargs):
        self.name = self.name.strip()  # razmaci na rubovima ne smiju zaobići jedinstvenost
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Port(models.Model):
    name = models.CharField('naziv', max_length=100)
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
        constraints = [  # ne razlikuje velika i mala slova, Split i split ne mogu oboje biti dodani
            models.UniqueConstraint(Lower('name'), name='fleet_port_name_ci_unique'),
            models.CheckConstraint(
                condition=models.Q(latitude__gte=-90, latitude__lte=90),
                name='fleet_port_latitude_range',
            ),
            models.CheckConstraint(
                condition=models.Q(longitude__gte=-180, longitude__lte=180),
                name='fleet_port_longitude_range',
            ),
        ]

    def save(self, *args, **kwargs):
        self.name = self.name.strip()  # razmaci na rubovima ne smiju zaobići jedinstvenost
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
