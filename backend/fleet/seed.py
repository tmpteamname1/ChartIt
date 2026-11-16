"""Demo catalog for local development and demonstration (seed_catalog, docs 6)."""

import io

from django.core.files.base import ContentFile
from PIL import Image, ImageDraw

from companies.models import Company

from .models import Category, Photo, Port, Vessel


def oib_with_check_digit(first_ten):
    """Append the ISO 7064 (MOD 11,10) control digit to ten digits."""
    remainder = 10
    for digit in first_ten:
        remainder = (remainder + int(digit)) % 10
        if remainder == 0:
            remainder = 10
        remainder = (remainder * 2) % 11
    check = 11 - remainder
    if check == 10:
        check = 0
    return f'{first_ten}{check}'


# Invented companies; the OIBs only have a valid format and are not real.
COMPANIES = [
    {
        'name': 'Adria Charter d.o.o.',
        'oib': oib_with_check_digit('1000000001'),
        'address': 'Riva 1, 21000 Split',
        'email': 'info@adria-charter.example',
        'phone': '+38521000001',
    },
    {
        'name': 'Kvarner Sails d.o.o.',
        'oib': oib_with_check_digit('1000000002'),
        'address': 'Obala 5, 52100 Pula',
        'email': 'info@kvarner-sails.example',
        'phone': '+38552000002',
    },
    {
        'name': 'Dalmatia Yachts d.o.o.',
        'oib': oib_with_check_digit('1000000003'),
        'address': 'Poljana 3, 20000 Dubrovnik',
        'email': 'info@dalmatia-yachts.example',
        'phone': '+38520000003',
    },
]

# name: (latitude, longitude)
PORTS = {
    'Pula': ('44.866623', '13.849578'),
    'Zadar': ('44.119371', '15.231365'),
    'Šibenik': ('43.735030', '15.890610'),
    'Trogir': ('43.516600', '16.251700'),
    'Split': ('43.508133', '16.440193'),
    'Dubrovnik': ('42.650661', '18.094424'),
}

CATEGORIES = ['Jedrilica', 'Katamaran', 'Motorna jahta', 'Gumenjak']

# name, company index, category, port, length m, people, cabins, year, daily price, active
VESSELS = [
    ('Bonaca', 0, 'Jedrilica', 'Split', '12.50', 8, 3, 2015, '250.00', True),
    ('Maestral', 0, 'Jedrilica', 'Trogir', '10.80', 6, 2, 2012, '190.00', True),
    ('Jugo', 0, 'Katamaran', 'Split', '13.20', 10, 4, 2020, '420.00', True),
    ('Burin', 0, 'Motorna jahta', 'Split', '15.00', 8, 3, 2019, '650.00', True),
    ('Tramontana', 0, 'Gumenjak', 'Trogir', '7.50', 8, 0, 2021, '180.00', True),
    ('Levanat', 1, 'Jedrilica', 'Pula', '11.40', 7, 3, 2016, '220.00', True),
    ('Kornat', 1, 'Katamaran', 'Pula', '12.90', 10, 4, 2018, '390.00', True),
    ('Istra', 1, 'Motorna jahta', 'Pula', '14.20', 8, 3, 2017, '580.00', True),
    ('Kvarner', 1, 'Gumenjak', 'Zadar', '6.80', 6, 0, 2022, '150.00', True),
    # Inactive on purpose: search must not show it.
    ('Zadranka', 1, 'Jedrilica', 'Zadar', '9.90', 6, 2, 2010, '160.00', False),
    ('Lavanda', 2, 'Jedrilica', 'Dubrovnik', '13.80', 9, 4, 2019, '300.00', True),
    ('Elafiti', 2, 'Katamaran', 'Dubrovnik', '14.50', 12, 5, 2021, '480.00', True),
    ('Peljesac', 2, 'Motorna jahta', 'Dubrovnik', '17.00', 10, 4, 2020, '800.00', True),
    ('Sibenka', 2, 'Jedrilica', 'Šibenik', '11.00', 7, 3, 2014, '200.00', True),
    ('Krka', 2, 'Gumenjak', 'Šibenik', '7.20', 7, 0, 2023, '170.00', True),
]

PHOTO_COLORS = [(31, 78, 121), (46, 125, 110), (160, 82, 45), (90, 70, 140)]


def make_photo_file(title, index):
    """Colored background with the vessel name, drawn in code (no downloads)."""
    image = Image.new('RGB', (1600, 900), PHOTO_COLORS[index % len(PHOTO_COLORS)])
    ImageDraw.Draw(image).text((60, 60), f'{title} #{index + 1}', fill='white')
    buffer = io.BytesIO()
    image.save(buffer, format='JPEG', quality=85)
    return ContentFile(buffer.getvalue(), name=f'{title.lower()}-{index + 1}.jpg')


def reset_catalog():
    """Delete only the catalog data created by seed_catalog (not users, not test companies)."""
    seed_oibs = [company['oib'] for company in COMPANIES]
    # Photo.delete() signals remove the files; a queryset delete() also fires post_delete.
    Vessel.objects.filter(company__oib__in=seed_oibs).delete()
    Company.objects.filter(oib__in=seed_oibs).delete()
    Port.objects.filter(name__in=PORTS, vessels__isnull=True).delete()
    Category.objects.filter(name__in=CATEGORIES, vessels__isnull=True).delete()


def seed_catalog():
    """Create the demo catalog; safe to run repeatedly. Returns the number of new records."""
    counts = {'companies': 0, 'ports': 0, 'categories': 0, 'vessels': 0, 'photos': 0}

    companies = []
    for data in COMPANIES:
        company, created = Company.objects.get_or_create(
            oib=data['oib'], defaults=data
        )
        companies.append(company)
        counts['companies'] += created

    ports = {}
    for name, (latitude, longitude) in PORTS.items():
        ports[name], created = Port.objects.get_or_create(
            name=name, defaults={'latitude': latitude, 'longitude': longitude}
        )
        counts['ports'] += created

    categories = {}
    for name in CATEGORIES:
        categories[name], created = Category.objects.get_or_create(name=name)
        counts['categories'] += created

    for i, row in enumerate(VESSELS):
        name, company_index, category, port, length, people, cabins, year, price, active = row
        vessel, created = Vessel.objects.get_or_create(
            company=companies[company_index],
            name=name,
            defaults={
                'category': categories[category],
                'home_port': ports[port],
                'length_m': length,
                'max_people': people,
                'cabins': cabins,
                'year_built': year,
                'daily_price': price,
                'is_active': active,
                'description': f'Plovilo {name}, matična luka {port}.',
            },
        )
        counts['vessels'] += created
        if created:
            for index in range(1 + i % 3):
                Photo.objects.create(
                    vessel=vessel, image=make_photo_file(name, index), sort_order=index
                )
                counts['photos'] += 1
    return counts
