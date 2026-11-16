from io import BytesIO
from pathlib import PurePath

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

MAX_THUMBNAIL_SIDE = 800
THUMBNAIL_QUALITY = 80


def make_thumbnail(image_file):
    """Vraća WebP minijaturu (dulja stranica najviše 800 px) kao ContentFile."""
    with Image.open(image_file) as image:
        # Fotografije s mobitela često nose rotaciju u EXIF-u; ovdje je primjenjujemo.
        image = ImageOps.exif_transpose(image)
        # thumbnail() čuva omjer stranica i nikad ne povećava manje slike.
        image.thumbnail((MAX_THUMBNAIL_SIDE, MAX_THUMBNAIL_SIDE))
        if image.mode not in ('RGB', 'RGBA'):
            image = image.convert('RGB')
        buffer = BytesIO()
        image.save(buffer, format='WEBP', quality=THUMBNAIL_QUALITY)

    name = PurePath(image_file.name).stem + '.webp'
    return ContentFile(buffer.getvalue(), name=name)
