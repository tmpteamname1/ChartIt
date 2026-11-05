# 6. Postavljanje, instalacija i konfiguracija

## Varijable okruženja i tajne

Ključevi, lozinke i ostale tajne ne pohranjuju se u repozitorij, nego se čitaju iz varijabli okruženja (poglavlje 4.6; NF-04, NF-08). Django ih čita u `backend/config/settings.py` pomoću biblioteke `django-environ`.

| Okruženje | Gdje se varijable postavljaju |
| --- | --- |
| Lokalno (venv ili Docker) | Datoteka `.env` u korijenu repozitorija, nastala kopiranjem `.env.example`. Čitaju je i `docker-compose.yml` i Django. Datoteka je u `.gitignore`. |
| Azure App Service | Postavke aplikacije (Configuration > Application settings). Vrijednosti se ne zapisuju ni u jednu datoteku u repozitoriju. |

Varijable koje su već postavljene u okruženju (Docker, Azure) imaju prednost pred vrijednostima iz `.env`.

### Popis varijabli

| Varijabla | Tajna | Zadano | Opis i primjer |
| --- | --- | --- | --- |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | lozinka da | nema | Baza u Dockeru za lokalni razvoj. Lokalno `chartit`. Koristi ih samo `docker-compose.yml`. |
| `DATABASE_URL` | da | nema (obavezno) | Veza Djanga s bazom. Lokalno `postgres://chartit:chartit@localhost:5432/chartit`; u Dockeru `docker-compose.yml` mijenja poslužitelj u `db`. Na Azureu `postgres://<korisnik>:<lozinka>@<poslužitelj>.postgres.database.azure.com:5432/<baza>?sslmode=require`. |
| `DJANGO_SECRET_KEY` | da | nema (obavezno) | Ključ za potpisivanje sesija i tokena. Lokalno bilo koji dugi niz znakova; produkcija ima vlastiti ključ, generiran naredbom `python -c "from django.core.management.utils import get_random_secret_key as k; print(k())"`. |
| `DJANGO_DEBUG` | ne | `False` | `True` samo za lokalni razvoj. |
| `DJANGO_ALLOWED_HOSTS` | ne | prazno | Nazivi poslužitelja odvojeni zarezom. Lokalno `localhost,127.0.0.1`; na Azureu `<aplikacija>.azurewebsites.net`. |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | ne | prazno | Origini (sa shemom) kojima se vjeruje za CSRF. Lokalno prazno; na Azureu `https://<aplikacija>.azurewebsites.net`. |
| `DJANGO_HTTPS` | ne | suprotno od `DJANGO_DEBUG` | Preusmjeravanje na HTTPS, sigurni kolačići i HSTS. `False` omogućuje lokalno pokretanje s produkcijskim postavkama preko HTTP-a. |
| `DJANGO_HSTS_SECONDS` | ne | `3600` | Trajanje HSTS-a dok je HTTPS uključen. Povećati na `31536000` kada se potvrdi da HTTPS radi. |
| `DJANGO_MEDIA_ROOT` | ne | `backend/media` | Mapa za učitane datoteke. Na Azureu `/home/media` (odjeljak Medijske datoteke). |

Varijable koje će se dodati s kasnijim zadacima (OAuth, slanje e-pošte, ključ za vremensku prognozu) upisuju se u ovu tablicu i u `.env.example` u istom PR-u u kojem se uvode. `.env.example` sadrži samo primjere i vrijednosti za lokalni razvoj, nikad stvarne tajne.

### Frontend

Frontend zasad nema varijabli okruženja. API se poziva relativnim putanjama (`/api/...`), koje u razvoju Vite prosljeđuje na Django, a u produkciji ih poslužuje Django s istog origina. Zato ne postoji ni `frontend/.env.example`.

Ako se varijable kasnije uvedu, vrijedi: sve varijable s prefiksom `VITE_` ugrađuju se u JavaScript koji preuzima preglednik, dakle javne su. U njih se nikad ne stavljaju tajne. Zbog toga se, na primjer, vremenska prognoza dohvaća preko poslužitelja, a ne izravno iz preglednika (ADR-05).

### Lokalne i produkcijske vrijednosti

- Lokalni razvoj i produkcija koriste različite vrijednosti tajni (`DJANGO_SECRET_KEY`, lozinka baze, kasnije OAuth podaci). Produkcijske tajne postavljaju se samo u postavkama Azure App Servicea (#38, #39).
- Ključ `django-insecure-...` iz ranijih commitova ostao je u povijesti gita i smatra se javnim. Ne smije se koristiti ni na jednoj javnoj instanci.

### Dijeljenje tajni u timu

Tim dijeli tajne preko zajedničke WhatsApp grupe. Za projekt ove veličine to je dogovoreni kompromis. Produkcijske tajne ne šalju se ako nisu potrebne; postavljaju se izravno u Azureu, a pristup imaju članovi s pristupom Azure pretplati.

### Postupak kada tajna završi u repozitoriju

1. Odmah zamijeniti (rotirati) tajnu: generirati novu vrijednost, postaviti je u Azureu i u lokalnim `.env` datotekama, a staru poništiti kod izdavatelja (npr. novi OAuth client secret, nova lozinka baze).
2. Javiti timu u WhatsApp grupi što je objavljeno i što je zamijenjeno.
3. Ukloniti tajnu iz koda u sljedećem commitu.

Samo brisanje iz commita nije dovoljno, jer tajna ostaje u povijesti gita i u kopijama repozitorija svih članova. Zato je zamjena tajne obavezan prvi korak.

## Medijske datoteke (fotografije plovila)

Fotografije plovila koje učitavaju vlasnici spremaju se u datotečni sustav poslužitelja, u mapu zadanu postavkom `MEDIA_ROOT`, a dostupne su na putanji `/media/` (poglavlje 4.7). Rješenje je odabrano jer ne zahtijeva dodatnu uslugu ni ključeve i dovoljno je za opseg projekta.

| Okruženje | Mapa (`DJANGO_MEDIA_ROOT`) | Napomena |
| --- | --- | --- |
| Lokalno (venv ili Docker) | `backend/media/` (zadano) | Mapa nije u gitu. U Dockeru je `backend/` montiran u kontejner, pa datoteke ostaju na računalu i nakon `docker compose down`. |
| Azure App Service | `/home/media` | `/home` je jedina pohrana koja ostaje nakon ponovnog pokretanja. Mapa je izvan `/home/site/wwwroot`, koju svako postavljanje zamjenjuje novom verzijom koda. |

### Posluživanje

WhiteNoise poslužuje samo datoteke koje postoje pri pokretanju aplikacije (statičke datoteke i izgrađeni React), a ne datoteke učitane kasnije. Zato `/media/` u svim okruženjima poslužuje Django (pogled `media` u `backend/config/views.py`). U razvoju Vite prosljeđuje `/media` na Django, kao i `/api`.

Ovaj način je sporiji od posluživanja preko zasebnog poslužitelja ili pohrane u oblaku, ali je za broj fotografija i korisnika u projektu dovoljan. Razmotrene alternative:

- Azure Blob Storage uz `django-storages`: fotografije ne opterećuju aplikaciju i ne ovise o disku App Servicea, ali zahtijevaju dodatnu uslugu, ključ za pristup i drugačije postavljanje u razvoju. Ostaje mogući sljedeći korak ako fotografija bude puno ili aplikacija dobije više instanci.
- WhiteNoise: nije moguće, jer ne vidi datoteke učitane nakon pokretanja.

### Ograničenja učitavanja

Polja za slike koriste zajedničke validatore `IMAGE_VALIDATORS` iz `backend/config/validators.py`:

- dopuštene vrste: jpg, jpeg, png i webp,
- najveća veličina: 5 MB po datoteci (besplatni plan App Servicea ima ukupno 1 GB prostora),
- Django admin i DRF serijalizatori otvaraju datoteku bibliotekom Pillow i odbijaju sve što nije stvarna slika, bez obzira na nastavak.

Primjer u modelu:

```python
from config.validators import IMAGE_VALIDATORS

image = models.ImageField(upload_to='vessels/', validators=IMAGE_VALIDATORS)
```

Datoteke se poslužuju s istog origina kao aplikacija, pa se ne smiju dopuštati vrste koje preglednik može izvršiti (npr. SVG ili HTML). Zaglavlje `X-Content-Type-Options: nosniff` (Django `SecurityMiddleware`) dodatno sprječava da preglednik datoteku protumači kao drugu vrstu.
