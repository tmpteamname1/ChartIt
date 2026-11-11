"""Test users and companies for local development (seed_test_users, test login, docs 4.7)."""

from companies.models import Company

from .models import User

TEST_COMPANIES = {
    'test': {'name': 'Testna tvrtka d.o.o.', 'oib': '69435151530'},
    # Second company with its own owner, to try out company data isolation by hand (ADR-02).
    'other': {'name': 'Druga testna tvrtka d.o.o.', 'oib': '12345678903'},
}

# username: (first name, last name, role, key in TEST_COMPANIES or None)
TEST_USERS = {
    'test-korisnik': ('Test', 'Korisnik', User.Role.KORISNIK, None),
    'test-djelatnik': ('Test', 'Djelatnik', User.Role.DJELATNIK, 'test'),
    'test-vlasnik': ('Test', 'Vlasnik', User.Role.VLASNIK, 'test'),
    'test-vlasnik-2': ('Test', 'Vlasnik 2', User.Role.VLASNIK, 'other'),
    'test-administrator': ('Test', 'Administrator', User.Role.ADMINISTRATOR, None),
}


def seed_test_users():
    """Create or update the test companies and users; safe to run repeatedly."""
    companies = {
        key: Company.objects.update_or_create(
            oib=data['oib'],
            defaults={
                'name': data['name'],
                'address': 'Obala 1, 21000 Split',
                'email': f'{key}@example.com',
                'phone': '+38521000000',
                'is_active': True,
            },
        )[0]
        for key, data in TEST_COMPANIES.items()
    }

    for username, (first_name, last_name, role, company_key) in TEST_USERS.items():
        user, created = User.objects.update_or_create(
            username=username,
            defaults={
                'email': f'{username}@example.com',
                'first_name': first_name,
                'last_name': last_name,
                'role': role,
                'company': companies.get(company_key),
                'is_active': True,
            },
        )
        # Test users log in only through the test login, never with a password.
        if created:
            user.set_unusable_password()
            user.save(update_fields=['password'])
