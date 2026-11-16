from datetime import date

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.functions import Lower
from django.db.models.signals import post_delete
from django.dispatch import receiver

from config.validators import IMAGE_VALIDATORS

from .images import make_thumbnail


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


def current_year():
    return date.today().year


class Vessel(models.Model):
    company = models.ForeignKey(
        'companies.Company',
        verbose_name='tvrtka',
        on_delete=models.PROTECT,
        related_name='vessels',
    )
    category = models.ForeignKey(
        Category,
        verbose_name='kategorija',
        on_delete=models.PROTECT,
        related_name='vessels',
    )
    home_port = models.ForeignKey(
        Port,
        verbose_name='matična luka',
        on_delete=models.PROTECT,
        related_name='vessels',
    )
    name = models.CharField('naziv', max_length=255)
    description = models.TextField('opis', blank=True)
    equipment = models.TextField('oprema', blank=True)
    length_m = models.DecimalField('duljina (m)', max_digits=5, decimal_places=2)
    max_people = models.PositiveSmallIntegerField('najveći broj osoba')
    cabins = models.PositiveSmallIntegerField('broj kabina')
    year_built = models.PositiveSmallIntegerField(
        'godina izgradnje',
        validators=[MinValueValidator(1900), MaxValueValidator(current_year)],
    )
    # Iznos u eurima; za novac se nikad ne koristi FloatField (ADR-04, 4.6).
    daily_price = models.DecimalField('dnevna cijena (EUR)', max_digits=10, decimal_places=2)
    is_active = models.BooleanField(
        'aktivno', default=True
    )  # plovila se deaktiviraju, ne brišu (4.6)

    class Meta:
        ordering = ['name']
        verbose_name = 'plovilo'
        verbose_name_plural = 'plovila'
        constraints = [
            models.CheckConstraint(
                condition=models.Q(daily_price__gte=0),
                name='fleet_vessel_daily_price_gte_0',
            ),
            models.CheckConstraint(
                condition=models.Q(max_people__gte=1),
                name='fleet_vessel_max_people_gte_1',
            ),
            models.CheckConstraint(
                condition=models.Q(length_m__gt=0),
                name='fleet_vessel_length_m_gt_0',
            ),
        ]

    def __str__(self):
        return f'{self.name} ({self.company})'


def vessel_photo_path(instance, filename):
    return f'vessels/{instance.vessel_id}/{filename}'


def vessel_thumbnail_path(instance, filename):
    return f'vessels/{instance.vessel_id}/thumbs/{filename}'


class Photo(models.Model):
    vessel = models.ForeignKey(
        Vessel,
        verbose_name='plovilo',
        on_delete=models.CASCADE,
        related_name='photos',
    )
    image = models.ImageField(
        'fotografija', upload_to=vessel_photo_path, validators=IMAGE_VALIDATORS
    )
    thumbnail = models.ImageField(
        'minijatura', upload_to=vessel_thumbnail_path, editable=False, blank=True
    )
    sort_order = models.PositiveSmallIntegerField('redoslijed', default=0)

    class Meta:
        ordering = ['sort_order', 'id']
        verbose_name = 'fotografija plovila'
        verbose_name_plural = 'fotografije plovila'

    def __str__(self):
        return f'Fotografija {self.pk} ({self.vessel})'

    def save(self, *args, **kwargs):
        # Minijaturu izrađujemo samo kad je slika nova ili promijenjena,
        # ne pri svakom spremanju (npr. promjena redoslijeda).
        if self._image_changed():
            self.thumbnail = make_thumbnail(self.image)
        super().save(*args, **kwargs)

    def _image_changed(self):
        if not self.image:
            return False
        if self.pk is None or not self.thumbnail:
            return True
        old = Photo.objects.filter(pk=self.pk).values_list('image', flat=True).first()
        return old != self.image.name


@receiver(post_delete, sender=Photo)
def delete_photo_files(sender, instance, **kwargs):
    # Signal radi i kod kaskadnog brisanja plovila, kad se delete() fotografije ne poziva.
    for field in (instance.image, instance.thumbnail):
        if field:
            field.delete(save=False)
