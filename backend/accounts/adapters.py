from allauth.account.adapter import DefaultAccountAdapter
from allauth.core.exceptions import ImmediateHttpResponse
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings
from django.shortcuts import redirect

from .models import User


def _login_error_redirect(code):
    return redirect(f'{settings.FRONTEND_URL}/prijava?greska={code}')


class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        return False  # accounts are created only through Google (F-18)


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(self, request, sociallogin):
        return True  # Google signup stays open

    def populate_user(self, request, sociallogin, data):
        # First name, last name and e-mail come from the provider data.
        user = super().populate_user(request, sociallogin, data)
        # The role is never taken from the provider or the client.
        user.role = User.Role.KORISNIK
        return user

    def pre_social_login(self, request, sociallogin):
        # ADR-06: only an address that Google marks as verified is accepted.
        verified = [a.email for a in sociallogin.email_addresses if a.verified]
        if not verified:
            raise ImmediateHttpResponse(_login_error_redirect('prijava_nije_uspjela'))

        # Already linked Google account (provider + uid), or an existing user with the same
        # e-mail that is about to be linked. Either way a deactivated user cannot log in.
        if sociallogin.is_existing:
            user = sociallogin.user
        else:
            user = User.objects.filter(email__iexact=verified[0]).first()
        if user is not None and not user.is_active:
            raise ImmediateHttpResponse(_login_error_redirect('racun_deaktiviran'))

    def on_authentication_error(
        self, request, provider, error=None, exception=None, extra_context=None
    ):
        # The user cancelled or the provider failed. Always the same short code for the
        # frontend, whatever the callback_url sent by the client; no technical details.
        raise ImmediateHttpResponse(_login_error_redirect('prijava_nije_uspjela'))
