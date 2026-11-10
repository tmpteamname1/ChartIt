from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models


def validate_oib_checksum(value):
    """Provjera kontrolne znamenke OIB-a (ISO 7064, MOD 11,10)."""
    if len(value) != 11 or not (value.isascii() and value.isdigit()):
        return
    remainder = 10
    for digit in value[:10]:
        remainder = (remainder + int(digit)) % 10
        if remainder == 0:
            remainder = 10
        remainder = (remainder * 2) % 11
    check = 11 - remainder
    if check == 10:
        check = 0
    if check != int(value[10]):
        raise ValidationError(
            'OIB nije ispravan (neispravna kontrolna znamenka).',
            code='invalid_oib_checksum',
        )


class Company(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name='naziv',
    )
    oib = models.CharField(
        max_length=11,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[0-9]{11}$',
                message='OIB mora sadržavati točno 11 znamenki.',
                code='invalid_oib',
            ),
            validate_oib_checksum,
        ],
        verbose_name='OIB',
    )
    address = models.CharField(
        max_length=255,
        verbose_name='adresa',
    )
    email = models.EmailField(
        verbose_name='e-mail',
    )
    phone = models.CharField(
        max_length=30,
        verbose_name='telefon',
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='aktivna',
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'charter tvrtka'
        verbose_name_plural = 'charter tvrtke'

    def __str__(self):
        return self.name
