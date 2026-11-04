# Registered by being imported (config/urls.py), before the schema is generated.
from drf_spectacular.authentication import SessionScheme


class ChartItSessionScheme(SessionScheme):
    """Describe config.authentication.SessionAuthentication in the schema like DRF's session login."""

    target_class = 'config.authentication.SessionAuthentication'
