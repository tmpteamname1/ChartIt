# Kept apart from config/api.py: DRF imports authentication classes while rest_framework.views
# is still loading, so this module must not import it (circular import).
from rest_framework import authentication


class SessionAuthentication(authentication.SessionAuthentication):
    """Session login that answers 401 instead of 403 when the user is not logged in.

    DRF only returns 401 when the authentication class names a WWW-Authenticate scheme.
    The client can then tell "log in first" (401) from "not allowed" (403).
    """

    def authenticate_header(self, request):
        return 'Session'
