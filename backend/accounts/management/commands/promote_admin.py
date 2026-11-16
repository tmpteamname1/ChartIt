from allauth.socialaccount.models import SocialAccount
from django.core.management.base import BaseCommand, CommandError

from accounts.models import User


class Command(BaseCommand):
    help = (
        'Postavlja ulogu ADMINISTRATOR postojećem korisniku koji se barem jednom prijavio '
        'Googleom. Ne mijenja is_staff ni is_superuser (pristup Django adminu je odvojen).'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            'email', help='E-mail korisnika kojeg treba postaviti za administratora'
        )

    def handle(self, *args, email, **options):
        email = email.strip()
        # E-mail is unique regardless of case (accounts_user_email_ci_unique).
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            raise CommandError(
                f'Korisnik s e-mailom {email} ne postoji. Korisnik se prvo mora prijaviti Googleom.'
            )
        if not user.is_active:
            raise CommandError(f'Korisnik {user.email} je deaktiviran.')
        if not SocialAccount.objects.filter(user=user).exists():
            raise CommandError(
                f'Korisnik {user.email} se još nikad nije prijavio Googleom. '
                'Prvo se mora prijaviti, pa tek onda pokrenite naredbu.'
            )
        if user.company_id is not None:
            raise CommandError(
                f'Korisnik {user.email} pripada tvrtki, a administrator platforme ne smije imati '
                'tvrtku.'
            )
        if user.role == User.Role.ADMINISTRATOR:
            self.stdout.write(f'{user.email} već je ADMINISTRATOR, ništa nije promijenjeno.')
            return

        user.role = User.Role.ADMINISTRATOR
        user.save(update_fields=['role'])
        self.stdout.write(self.style.SUCCESS(f'{user.email} je sada ADMINISTRATOR.'))
