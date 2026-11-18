"""Storage for uploaded files (vessel photos), docs chapter 6.

Production (Render) has no persistent disk, so photos go to an S3 compatible bucket
(Cloudflare R2) when MEDIA_S3_BUCKET is set. Otherwise they stay on the local disk in
MEDIA_ROOT, so local development, Docker and CI need no account or secret.
"""

from django.core.exceptions import ImproperlyConfigured

S3_VARIABLES = (
    'MEDIA_S3_BUCKET',
    'MEDIA_S3_ENDPOINT_URL',
    'MEDIA_S3_ACCESS_KEY_ID',
    'MEDIA_S3_SECRET_ACCESS_KEY',
    'MEDIA_S3_PUBLIC_URL',
)


def media_storage(environ):
    """Return the STORAGES['default'] entry for the given environment variables."""
    if not environ.get('MEDIA_S3_BUCKET'):
        return {'BACKEND': 'django.core.files.storage.FileSystemStorage'}

    # A half-configured bucket would fail on the first upload; fail on startup instead.
    missing = [name for name in S3_VARIABLES if not environ.get(name)]
    if missing:
        raise ImproperlyConfigured(
            f'MEDIA_S3_BUCKET is set, but these are not: {", ".join(missing)}'
        )

    public_url = environ['MEDIA_S3_PUBLIC_URL']
    if not public_url.startswith('https://'):
        raise ImproperlyConfigured('MEDIA_S3_PUBLIC_URL must start with https://')

    return {
        'BACKEND': 'storages.backends.s3.S3Storage',
        'OPTIONS': {
            'bucket_name': environ['MEDIA_S3_BUCKET'],
            'endpoint_url': environ['MEDIA_S3_ENDPOINT_URL'],
            'access_key': environ['MEDIA_S3_ACCESS_KEY_ID'],
            'secret_key': environ['MEDIA_S3_SECRET_ACCESS_KEY'],
            # R2 has no regions; its S3 API expects "auto".
            'region_name': 'auto',
            # Public read is set on the bucket itself; R2 does not support object ACLs.
            'default_acl': None,
            # Plain, permanent URLs on the public bucket host instead of signed URLs that expire.
            'custom_domain': public_url.removeprefix('https://').rstrip('/'),
            'querystring_auth': False,
            # The default (True) would let a second IMG_0001.jpg of the same vessel replace the first.
            'file_overwrite': False,
        },
    }
