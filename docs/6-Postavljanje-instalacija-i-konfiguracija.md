# 6. Postavljanje, instalacija i konfiguracija

## Varijable okruženja i tajne

Ključevi, lozinke i ostale tajne ne pohranjuju se u repozitorij, nego se čitaju iz varijabli okruženja (poglavlje 4.6; NF-04, NF-08). Django ih čita u `backend/config/settings.py` pomoću biblioteke `django-environ`.

| Okruženje | Gdje se varijable postavljaju |
| --- | --- |
| Lokalno (venv ili Docker) | Datoteka `.env` u korijenu repozitorija, nastala kopiranjem `.env.example`. Čitaju je i `docker-compose.yml` i Django. Datoteka je u `.gitignore`. |
| Azure App Service | Postavke aplikacije (Configuration > Application settings). Vrijednosti se ne zapisuju ni u jednu datoteku u repozitoriju. |
| Render | `render.yaml` za vrijednosti koje nisu tajne; tajne generira ili povezuje Render (odjeljak Postavljanje na Render). |

Varijable koje su već postavljene u okruženju (Docker, Azure, Render) imaju prednost pred vrijednostima iz `.env`.

### Popis varijabli

| Varijabla | Tajna | Zadano | Opis i primjer |
| --- | --- | --- | --- |
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | lozinka da | nema | Baza u Dockeru za lokalni razvoj. Lokalno `chartit`. Koristi ih samo `docker-compose.yml`. |
| `DATABASE_URL` | da | nema (obavezno) | Veza Djanga s bazom. Lokalno `postgres://chartit:chartit@localhost:5432/chartit`; u Dockeru `docker-compose.yml` mijenja poslužitelj u `db`. Na Azureu `postgres://<korisnik>:<lozinka>@<poslužitelj>.postgres.database.azure.com:5432/<baza>?sslmode=require`. |
| `DATABASE_SSLMODE` | ne | prazno | PostgreSQL `sslmode` kada ga `DATABASE_URL` ne može sadržavati. Na Renderu `require`, kako se veza s bazom ne bi bez upozorenja uspostavila bez enkripcije (NF-04). Lokalno nije potrebna. |
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

image = models.ImageField(upload_to="vessels/", validators=IMAGE_VALIDATORS)
```

Datoteke se poslužuju s istog origina kao aplikacija, pa se ne smiju dopuštati vrste koje preglednik može izvršiti (npr. SVG ili HTML). Zaglavlje `X-Content-Type-Options: nosniff` (Django `SecurityMiddleware`) dodatno sprječava da preglednik datoteku protumači kao drugu vrstu.

## Postavljanje na Render

Aplikacija je javno dostupna na https://chartit-okv1.onrender.com. Render je zamjenski smještaj dok Azure nije dostupan, a postavljanje je zamišljeno jednako kao na Azureu: jedan servis na kojem Django poslužuje API, Django admin i izgrađenu React aplikaciju s istog origina (WhiteNoise). Zato frontend nema zaseban servis ni CORS postavke, a nepoznate putanje (npr. `/plovila/5`) vraćaju React aplikaciju, koja sama prikazuje odgovarajuću stranicu.

Cijela konfiguracija nalazi se u `render.yaml` (Render Blueprint) u korijenu repozitorija:

| Dio | Vrijednost | Napomena |
| --- | --- | --- |
| Web servis `chartit` | besplatni plan, regija Frankfurt, grana `main` | Svaki push u `main` automatski pokreće novo postavljanje. |
| Baza `chartit-db` | PostgreSQL 17, besplatni plan, regija Frankfurt | Ista glavna verzija kao u `docker-compose.yml` i CI-ju. |
| Build naredba | `npm ci && npm run build` u `frontend/`, zatim `pip install -r requirements.txt` i `collectstatic` u `backend/` | Vite sprema build u `backend/frontend_dist`, odakle ga poslužuje WhiteNoise. |
| Start naredba | `python manage.py migrate`, zatim `gunicorn config.wsgi` | Migracije se izvršavaju pri svakom postavljanju. Besplatni plan nema zasebnu pre-deploy naredbu. |
| Health check | `/api/health/` | Promet prelazi na novu verziju tek kada ona odgovori s 200. Ako migracija ne uspije ili baza nije dostupna, Render nakon 15 minuta prekida postavljanje, a stara verzija ostaje aktivna. |

### Prvo postavljanje

1. Na Renderu odabrati New > Blueprint, povezati GitHub repozitorij i potvrditi resurse koje Render pročita iz `render.yaml` (web servis i bazu).
2. Render stvara bazu, generira `DJANGO_SECRET_KEY` i povezuje `DATABASE_URL`, zatim izvršava build i start naredbu.
3. Ako je naziv `chartit` zauzet, Render servisu dodjeljuje drugi naziv poslužitelja (ovdje `chartit-okv1.onrender.com`). Taj naziv treba upisati u `DJANGO_ALLOWED_HOSTS` i `DJANGO_CSRF_TRUSTED_ORIGINS` u `render.yaml`.
4. Provjeriti https://chartit-okv1.onrender.com/api/health/, koji mora vratiti `{"status": "ok", "database": "ok"}`, i početnu stranicu, koja mora prikazati "backend: OK".
5. Stvoriti administratora (odjeljak Administrator).

### Varijable okruženja na Renderu

| Varijabla | Izvor |
| --- | --- |
| `DATABASE_URL` | Render, interni URL baze `chartit-db` (`fromDatabase`). Ne zapisuje se nigdje. |
| `DATABASE_SSLMODE` | `render.yaml`, vrijednost `require`. Interni URL dopušta vezu bez enkripcije, pa se ona ovako odbija. |
| `DJANGO_SECRET_KEY` | Render, generiran pri prvom postavljanju (`generateValue`). |
| `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS` | `render.yaml`, naziv poslužitelja koji je dodijelio Render. |
| `PYTHON_VERSION`, `NODE_VERSION` | `render.yaml`, iste verzije kao u `backend/Dockerfile` i CI-ju. |
| `VITE_ROLE_SWITCHER` | `render.yaml`, prikazuje prekidač testnih uloga dok ne postoji OAuth prijava (#41). |

`DJANGO_DEBUG` nije postavljen, pa je `False`, a time su uključeni i preusmjeravanje na HTTPS, sigurni kolačići i HSTS. Render prekida TLS i prosljeđuje zahtjeve sa zaglavljem `X-Forwarded-Proto`, kao i Azure. `/api/health/` izuzet je od preusmjeravanja (`SECURE_REDIRECT_EXEMPT`), jer bi preusmjeravanje Render smatrao uspješnim odgovorom bez provjere baze.

### Administrator

Besplatni plan nema pristup ljusci (shell) na poslužitelju, pa se naredbe poput `createsuperuser` pokreću s vlastitog računala, spojene na produkcijsku bazu preko vanjskog URL-a (Render > `chartit-db` > External Database URL). Vanjske veze s Renderovom bazom uvijek su šifrirane.

```bash
cd backend                         # uz aktivirano virtualno okruženje
DATABASE_URL='<vanjski URL>' python manage.py createsuperuser
```

Vanjski URL sadrži lozinku baze, pa se ne sprema u `.env`, commit ni poruku. Za administratora se koristi adresa e-pošte koja se neće koristiti za OAuth prijavu, jer je e-pošta korisnika jedinstvena. Podaci za prijavu dijele se prema odjeljku Dijeljenje tajni u timu. Trajni način stvaranja prvog administratora platforme dio je zadatka #50.

### Ograničenja besplatnog plana

- Servis se nakon razdoblja bez prometa gasi, pa prvi sljedeći zahtjev čeka da se ponovno pokrene.
- Baza istječe 30 dana nakon stvaranja (uz 14 dana odgode, nakon čega se briše). Prije isteka podatke treba prebaciti u novu bazu.
- Servis nema trajni disk: učitane datoteke (fotografije plovila) u `backend/media` gube se pri svakom postavljanju, ponovnom pokretanju i gašenju.

## Kontinuirana integracija (CI)

Svaki pull request prema grani `main` i svaki push u `main` automatski se provjerava pomoću GitHub Actionsa (`.github/workflows/ci.yml`). Tako se greške otkrivaju prije merga, a ne nakon postavljanja, i pregledavatelj ne mora ručno pokretati provjere. Postavljanje na platformu pokreće se iz grane `main`, pa u nju ulazi samo kod koji je prošao provjere.

Workflow ima dva posla koji rade usporedno:

| Posao | Koraci |
| --- | --- |
| `frontend` | Node 22, `npm ci`, `npm run lint` (oxlint), `npm run format:check` (Prettier), `npm run build` (uključuje provjeru tipova `tsc -b`) |
| `backend` | Python 3.11, PostgreSQL 17 kao service container, `ruff check`, `ruff format --check`, `manage.py check`, `manage.py makemigrations --check --dry-run` (otkriva promjene modela bez migracije), `manage.py test` |

Verzije Nodea, Pythona i PostgreSQL-a jednake su onima u `docker-compose.yml`, `backend/Dockerfile` i `render.yaml`. Testovi koriste PostgreSQL, a ne SQLite, jer ograničenje preklapanja rezervacija treba rasponske tipove i `btree_gist` (ADR-03). Backend u CI-ju radi s `DJANGO_DEBUG=False`, kao u produkciji, i s `DJANGO_HTTPS=False` kako testni klijent ne bi bio preusmjeravan na HTTPS. CI ne treba nikakve tajne.

Poslovi `frontend` i `backend` obavezne su provjere u pravilima grane `main` (ruleset "Approved before merge"), pa se pull request s neuspješnim CI-jem ne može spojiti. Promjena naziva posla zato zahtijeva i promjenu ruleseta. Workflow nema filtar po mapama (paths filter): obavezna provjera koja se zbog filtra ne pokrene ostaje na čekanju i blokira merge, a cijeli CI ionako traje nekoliko minuta.

Ista provjera može se lokalno pokrenuti naredbama iz odjeljka "Formatiranje i provjera koda" u README-u.

Odabrani su GitHub Actions jer je repozitorij na GitHubu: nema dodatne usluge ni računa, rezultat se prikazuje izravno u pull requestu, a za javne repozitorije je besplatan. Razmotrene alternative:

- CI na platformi za postavljanje (Render ili Azure): provjerava samo ono što se postavlja, bez rezultata u pull requestu i bez mogućnosti da blokira merge.
- Vanjske usluge (npr. CircleCI): isti rezultat, ali uz dodatni račun i povezivanje s repozitorijem.
