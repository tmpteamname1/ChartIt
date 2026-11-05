"""Validators shared by the apps, e.g. for uploaded images (docs chapter 6)."""

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']
MAX_IMAGE_SIZE_MB = 5


def validate_image_size(file):
    if file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise ValidationError(
            f'Datoteka je prevelika. Najveća dopuštena veličina je {MAX_IMAGE_SIZE_MB} MB.',
            code='file_too_large',
        )


# Usage: models.ImageField(upload_to=..., validators=IMAGE_VALIDATORS).
# Admin forms and DRF serializers also open the file with Pillow and reject anything that is
# not a real image, whatever its extension.
IMAGE_VALIDATORS = [FileExtensionValidator(ALLOWED_IMAGE_EXTENSIONS), validate_image_size]
