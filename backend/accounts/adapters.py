from allauth.core.exceptions import ImmediateHttpResponse
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from django.shortcuts import redirect

from .models import User


def _login_error_redirect(code):
    return redirect(f'{settings.FRONTEND_URL}/prijava?greska={code}')


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        # First name, last name and e-mail come from the provider data.
        user = super().populate_user(request, sociallogin, data)
        # The role is never taken from the provider or the client.
        user.role = User.Role.KORISNIK
        return user

    def pre_social_login(self, request, sociallogin):
        # is_existing: this Google account is already linked to a user (lookup is by
        # provider + uid, not by name), so a repeat login never creates a duplicate.
        if sociallogin.is_existing and not sociallogin.user.is_active:
            raise ImmediateHttpResponse(_login_error_redirect('racun_deaktiviran'))

    def on_authentication_error(
        self, request, provider, error=None, exception=None, extra_context=None
    ):
        # The user cancelled or the provider failed. Always the same short code for the
        # frontend, whatever the callback_url sent by the client; no technical details.
        raise ImmediateHttpResponse(_login_error_redirect('prijava_nije_uspjela'))
