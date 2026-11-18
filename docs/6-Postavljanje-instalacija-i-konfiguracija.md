# 6. Postavljanje, instalacija i konfiguracija

## Lokalna instalacija i konfiguracija

Sažeti postupak pokretanja nalazi se u [README-u](../README.md#quick-start). Ovaj odjeljak opisuje cijeli postupak lokalnog razvoja.

### Preduvjeti

- Docker Desktop (ili Docker Engine uz Docker Compose v2)
- Node.js 20.19+ ili 22.12+ (uz npm)
- Python 3.10+ (samo ako se backend pokreće izvan Dockera)

### Preuzimanje projekta

```bash
git clone https://github.com/tmpteamname1/ChartIt.git
cd ChartIt
cp .env.example .env               # Windows: copy .env.example .env
```

Vrijednosti iz `.env.example` dovoljne su za lokalni razvoj. Popis svih varijabli okruženja i pravila za tajne opisani su u odjeljku [Varijable okruženja i tajne](#varijable-okruženja-i-tajne).

Baza je PostgreSQL u Dockeru. SQLite se ne koristi jer ograničenje preklapanja rezervacija (ADR-03) treba rasponske tipove i proširenje `btree_gist`.

### Pokretanje u razvoju

Potrebna su dva terminala: jedan za bazu i backend, a drugi za frontend.

Terminal 1, baza i backend u Dockeru (http://localhost:8000). Migracije se izvršavaju automatski pri pokretanju:

```bash
docker compose up
```

Terminal 2, frontend (http://localhost:5173):

```bash
cd frontend
npm install                        # samo prvi put i nakon promjene package.json
npm run dev
```

Aplikacija se otvara na **http://localhost:5173**. Vite razvojni poslužitelj prosljeđuje `/api`, `/admin`, `/media` i `/static` na Django (port 8000), pa su klijent i API na istom originu kao i u produkciji.

Veza klijenta, API-ja i baze provjerava se na http://localhost:5173/api/health/, koji mora vratiti `{"status": "ok", "database": "ok"}`. Ako provjera ne uspije, greške backenda vide se naredbom `docker compose logs -f backend`, a greške frontenda u terminalu u kojem radi `npm run dev` i u konzoli preglednika.

Dokumentacija API-ja (Swagger UI) nalazi se na http://localhost:5173/api/docs/, a konvencije API-ja opisane su u [poglavlju 4.9](4-Arhitektura-i-oblikovanje.md#49-konvencije-rest-api-ja). Nakon povlačenja promjena koje mijenjaju `requirements.txt` backend treba ponovno izgraditi s `docker compose up --build`.

Na http://localhost:8000 Django prikazuje zadnju izgrađenu verziju React aplikacije (`npm run build`), a ne trenutni kod. Promjene u `frontend/src` tamo se vide tek nakon ponovnog builda, zato se u razvoju koristi port 5173.

Administratorski račun za Django admin (http://localhost:5173/admin/):

```bash
docker compose exec backend python manage.py createsuperuser
```

### Početni podaci

Demo katalog (tvrtke, luke, kategorije, plovila i fotografije) stvara se naredbom:

```bash
docker compose exec backend python manage.py seed_catalog          # demo katalog
docker compose exec backend python manage.py seed_catalog --reset  # obriši i ponovno stvori katalog
```

Naredba se može pokretati više puta bez duplikata; bez `--force` odbija rad kad je `DJANGO_DEBUG` isključen.

Nad produkcijskom bazom naredba se pokreće s vlastitog računala uz `--force` i vanjski URL baze (`DATABASE_URL='<vanjski URL>' python manage.py seed_catalog --force`, isto kao `createsuperuser`, odjeljak [Administrator](#administrator)). Odbija rad kad je pohrana fotografija lokalni disk, jer bi nastali zapisi fotografija bez datoteka (na Renderu nema trajnog diska). Zato se uz `DATABASE_URL` u istoj naredbi postavljaju i varijable `MEDIA_S3_*` s vrijednostima s Rendera (odjeljak [Medijske datoteke](#medijske-datoteke-fotografije-plovila)), kako bi fotografije završile u spremniku. Ni one se ne upisuju u `.env`.

### Backend izvan Dockera (virtualno okruženje)

U Dockeru se tada pokreće samo baza, a Django se spaja na nju preko `localhost:5432` (vrijednost `DATABASE_URL` u `.env`).

```bash
docker compose up db
```

U drugom terminalu:

```bash
cd backend
python3 -m venv .venv              # samo prvi put
source .venv/bin/activate          # Windows: .venv\Scripts\activate
python -m pip install -r requirements-dev.txt   # requirements.txt + alati za razvoj (ruff)
python manage.py migrate
python manage.py runserver
```

### Korisne naredbe

```bash
docker compose down                                   # zaustavljanje (podaci u bazi ostaju)
docker compose down -v                                # zaustavljanje i brisanje baze ispočetka
docker compose up --build                             # nakon promjene requirements.txt
docker compose logs -f backend                        # praćenje logova backenda
docker compose exec backend python manage.py test     # testovi (koriste PostgreSQL)
docker compose exec backend python manage.py <naredba>
docker compose exec db psql -U chartit -d chartit     # konzola baze
```

### Česti problemi

- Ako je port 5432 zauzet (npr. druga PostgreSQL baza na računalu), potrebno ju je zaustaviti prije `docker compose up`.
- Ako je lokalna baza stvorena prije uvođenja prilagođenog modela korisnika (aplikacija `accounts`), migracije javljaju grešku `InconsistentMigrationHistory`. Bazu je tada potrebno jednom obrisati s `docker compose down -v` i ponovno pokrenuti `docker compose up`.
- Ako Django javlja `Set the DJANGO_SECRET_KEY environment variable`, u `.env` nedostaju nove varijable. Treba ih prepisati iz `.env.example`, a za `DJANGO_SECRET_KEY` lokalno je dovoljan bilo koji dugi niz znakova.

### Testna prijava

Za isprobavanje uloga bez Google računa lokalno se može prijaviti kao testni korisnik (poglavlje 4.7):

1. U `.env` postaviti `ENABLE_TEST_LOGIN=True` i `VITE_ENABLE_TEST_LOGIN=True` (vidi `.env.example`) te ponovno pokrenuti backend (`docker compose up -d backend`) i `npm run dev`.
2. Stvoriti testne korisnike: `docker compose exec backend python manage.py seed_test_users`. Naredba se može pokrenuti više puta i ne stvara duplikate.
3. Na stranici `/prijava` odabrati korisnika u izborniku „Prijavi se kao...”.

| Korisničko ime | Uloga | Tvrtka |
|---|---|---|
| `test-korisnik` | KORISNIK | – |
| `test-djelatnik` | DJELATNIK | Testna tvrtka d.o.o. |
| `test-vlasnik` | VLASNIK | Testna tvrtka d.o.o. |
| `test-vlasnik-2` | VLASNIK | Druga testna tvrtka d.o.o. |
| `test-administrator` | ADMINISTRATOR | – |

Vlasnik druge tvrtke služi za ručnu provjeru da tvrtka ne vidi tuđe podatke. Testni korisnici nemaju lozinku i mogu se prijaviti samo ovim putem. Bez `ENABLE_TEST_LOGIN` (zadano) endpoint `/api/auth/test-login/` ne postoji (404), a izbornik se ne prikazuje. Na javnoj instanci zastavica se ne uključuje.

### Formatiranje i provjera koda

Stil koda provjeravaju alati, a ne pregled koda. Backend koristi [ruff](https://docs.astral.sh/ruff/) (linter i formatter, postavke u `backend/pyproject.toml`), a frontend oxlint i [Prettier](https://prettier.io/) (postavke u `frontend/.oxlintrc.json` i `frontend/.prettierrc.json`). Osnovne postavke uređivača (kraj retka LF, uvlačenje) zadane su u `.editorconfig`.

Prije otvaranja pull requesta:

```bash
cd backend                         # uz aktivirano virtualno okruženje
ruff check --fix .                 # linter, sigurne ispravke radi sam
ruff format .                      # formatiranje

cd ../frontend
npm run lint                       # oxlint
npm run format                     # Prettier
```

Za provjeru bez mijenjanja datoteka koriste se `ruff format --check .` i `npm run format:check`. Iste provjere, uz build frontenda i backend testove, pokreće CI na svakom pull requestu (odjeljak [Kontinuirana integracija (CI)](#kontinuirana-integracija-ci)).

Commitovi koji samo formatiraju kod navedeni su u `.git-blame-ignore-revs`, pa ih `git blame` preskače i prikazuje stvarnog autora retka. GitHub tu datoteku čita sam, a lokalno je potrebno jednom pokrenuti:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

### Pokretanje kao u produkciji

Django poslužuje izgrađenu React aplikaciju i statičke datoteke (WhiteNoise), a pokreće se preko gunicorna. Baza mora biti pokrenuta (`docker compose up db`):

```bash
cd frontend
npm run build              # rezultat ide u backend/frontend_dist
cd ../backend
source .venv/bin/activate
python manage.py collectstatic --noinput
DJANGO_DEBUG=False DJANGO_HTTPS=False gunicorn config.wsgi --bind 127.0.0.1:8000
```

Aplikacija je tada dostupna na http://localhost:8000. `DJANGO_HTTPS=False` isključuje preusmjeravanje na HTTPS i sigurne kolačiće, koji su uz `DJANGO_DEBUG=False` inače uključeni. Gunicorn ne radi na Windowsima; tamo se ovaj način pokretanja isprobava u WSL-u ili Dockeru.

## Varijable okruženja i tajne

Ključevi, lozinke i ostale tajne ne pohranjuju se u repozitorij, nego se čitaju iz varijabli okruženja (poglavlje 4.6; NF-04). Django ih čita u `backend/config/settings.py` pomoću biblioteke `django-environ`.

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
| `DJANGO_MEDIA_ROOT` | ne | `backend/media` | Mapa za učitane datoteke kada spremnik nije postavljen (lokalni razvoj, Docker, CI). |
| `MEDIA_S3_BUCKET` | ne | prazno | Naziv spremnika za fotografije (`chartit-media`). Ako je postavljen, fotografije se spremaju u spremnik i moraju biti postavljene i ostale četiri varijable `MEDIA_S3_*`, inače se aplikacija ne pokreće. Lokalno prazno. |
| `MEDIA_S3_ENDPOINT_URL` | ne | prazno | Adresa S3 API-ja pružatelja, za R2 u jurisdikciji EU `https://<ID računa>.eu.r2.cloudflarestorage.com`. |
| `MEDIA_S3_PUBLIC_URL` | ne | prazno | Javna adresa spremnika s koje preglednik dohvaća fotografije, npr. `https://pub-<oznaka>.r2.dev`. Mora počinjati s `https://`. |
| `MEDIA_S3_ACCESS_KEY_ID` | da | prazno | Access Key ID API tokena za spremnik. |
| `MEDIA_S3_SECRET_ACCESS_KEY` | da | prazno | Secret Access Key istog tokena. Postoji samo na Renderu. |
| `FRONTEND_URL` | ne | prazno | Adresa frontenda na koju se korisnik vraća nakon neuspjele prijave. Lokalno `http://localhost:5173`; na Renderu prazno (frontend i backend su isti origin). |
| `GOOGLE_CLIENT_ID` | ne | nema | OAuth Client ID iz Google Cloud Consolea (`xxx.apps.googleusercontent.com`). Lokalno ID klijenta "ChartIt Web Client (lokalno)", na Renderu ID produkcijskog klijenta. |
| `GOOGLE_CLIENT_SECRET` | da | nema | OAuth Client Secret (`GOCSPX-...`) istog klijenta. Lokalno secret lokalnog klijenta; produkcijski secret postoji samo na Renderu. |

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

Fotografije plovila i njihove minijature spremaju se preko Djangovog sustava pohrane (`STORAGES['default']`). Modeli koriste samo `upload_to` i `field.delete`, a URL fotografije daje `photo.image.url` / `photo.thumbnail.url`, pa se pohrana mijenja samo postavkom, bez promjene modela, serijalizatora ili frontenda. Pohranu bira `backend/config/storage.py` prema varijablama okruženja:

| Okruženje | Pohrana | Napomena |
| --- | --- | --- |
| Lokalno (venv ili Docker) i CI | lokalni disk, mapa `backend/media/` (`DJANGO_MEDIA_ROOT`) | Varijable `MEDIA_S3_*` nisu postavljene, pa nije potreban nikakav račun ni tajna. Mapa nije u gitu. U Dockeru je `backend/` montiran u kontejner, pa datoteke ostaju na računalu i nakon `docker compose down`. |
| Render | spremnik `chartit-media` kod Cloudflare R2, jurisdikcija EU | Postavljen `MEDIA_S3_BUCKET` uključuje S3 pohranu (`storages.backends.s3.S3Storage` iz `django-storages`). Fotografije ostaju nakon postavljanja, ponovnog pokretanja i gašenja servisa. |

S3 pohrana koristi ove opcije:

- `file_overwrite=False`: druga fotografija istog naziva (npr. `IMG_0001.jpg`) za isto plovilo dobiva nastavak uz naziv i ne prepisuje prvu,
- `querystring_auth=False` i `custom_domain` (iz `MEDIA_S3_PUBLIC_URL`): URL fotografije je trajan javni URL spremnika, a ne potpisani URL s rokom trajanja,
- bez ACL-ova (`default_acl=None`), jer ih R2 ne podržava; javno čitanje uključuje se na samom spremniku,
- `region_name='auto'`, kako R2 očekuje.

Brisanje fotografije ili plovila briše i datoteke iz spremnika (signal `post_delete` modela `Photo` u `backend/fleet/models.py`).

### Posluživanje

Na Renderu preglednik fotografije dohvaća izravno sa spremnika, pa ih ne poslužuje Django na slabom besplatnom poslužitelju.

Bez spremnika WhiteNoise ne može poslužiti fotografije, jer poslužuje samo datoteke koje postoje pri pokretanju aplikacije (statičke datoteke i izgrađeni React). Zato `/media/` lokalno i u CI-ju poslužuje Django (pogled `media` u `backend/config/views.py`), a u razvoju Vite prosljeđuje `/media` na Django, kao i `/api`. Ruta postoji i na Renderu, ali se ne koristi, jer URL-ovi fotografija pokazuju na spremnik.

### Odabir pružatelja pohrane

Uvjeti: besplatni plan dovoljan za projekt (nekoliko GB), S3 kompatibilno sučelje (radi `django-storages`), javno čitanje datoteka putem URL-a, regija u EU i po mogućnosti bez obveznog unosa kartice. Uvjeti besplatnih planova provjereni su na službenim stranicama pružatelja u studenom 2026.

| Pružatelj | Besplatno | Prednosti | Nedostaci |
| --- | --- | --- | --- |
| **Cloudflare R2** (odabran) | 10 GB pohrane, 1 milijun zapisa i 10 milijuna čitanja mjesečno, promet prema korisnicima bez naknade | Velik besplatni prostor, promet se ne naplaćuje, jurisdikcija EU za podatke, javni URL `r2.dev` bez vlastite domene | Pri uključivanju R2 traži se unos kartice (naplata tek iznad besplatne kvote). Nema ACL-ova. Cloudflare navodi da je `r2.dev` ograničene brzine i namijenjen razvoju; za projekt je dovoljan, a prijelaz na vlastitu domenu mijenja samo `MEDIA_S3_PUBLIC_URL`. |
| Backblaze B2 | prvih 10 GB pohrane, promet do trostruke količine pohranjenih podataka | Regija EU Central, S3 sučelje | Javni spremnik zahtijeva povijest plaćanja ili malu uplatu karticom; promet iznad kvote se naplaćuje. |
| Supabase Storage | 1 GB pohrane, 5 GB prometa | Bez kartice, regija Frankfurt, S3 sučelje | Besplatni projekt pauzira se nakon tjedan dana bez aktivnosti, pa bi fotografije bile nedostupne dok ga netko ručno ne pokrene; javni URL sadrži putanju, što `custom_domain` ne podržava izravno. |

Odabran je Cloudflare R2: jedini od kandidata nema ni ograničenje prometa ni pauziranje, a obvezni unos kartice prihvaćen je jer projekt ostaje daleko ispod besplatne kvote. Razmatrane su i alternative bez vanjske usluge:

- disk servisa: na besplatnom planu Rendera nije trajan (odjeljak [Ograničenja besplatnog plana](#ograničenja-besplatnog-plana)), a trajni disk postoji samo na plaćenim planovima,
- WhiteNoise: nije moguće, jer ne vidi datoteke učitane nakon pokretanja.

### Postavljanje spremnika (Cloudflare R2)

Postavlja se jednom, na računu koji je otvorio član tima zadužen za pohranu.

1. U Cloudflare nadzornoj ploči otvoriti R2 Object Storage i uključiti R2 (traži unos načina plaćanja; naplaćuje se samo potrošnja iznad besplatne kvote).
2. Stvoriti spremnik `chartit-media`: lokacija s jurisdikcijom European Union (EU), razred pohrane Standard (besplatna kvota ne vrijedi za Infrequent Access).
3. U postavkama spremnika, Public access > R2.dev subdomain, uključiti javni pristup. Prikazana adresa (`https://pub-<oznaka>.r2.dev`) je `MEDIA_S3_PUBLIC_URL`.
4. Na stranici spremnika pročitati S3 API adresu (`https://<ID računa>.eu.r2.cloudflarestorage.com`, bez naziva spremnika na kraju); to je `MEDIA_S3_ENDPOINT_URL`.
5. R2 > Manage API tokens > Create API token: dopuštenje Object Read & Write, ograničeno samo na spremnik `chartit-media`. Access Key ID i Secret Access Key prikazuju se samo jednom; upisuju se odmah na Renderu i ne spremaju se u `.env`, commit ni poruku.
6. Na Renderu (`chartit` > Environment) upisati svih pet varijabli `MEDIA_S3_*` i spremiti uz novo postavljanje.
7. Provjera: kroz Django admin na https://chartit-okv1.onrender.com/admin/ dodati fotografiju plovilu. Adresa fotografije i minijature mora počinjati s `MEDIA_S3_PUBLIC_URL`, a fotografija se mora prikazivati i nakon ručnog ponovnog postavljanja (Manual Deploy) te nakon gašenja servisa. Brisanjem fotografije u adminu datoteke nestaju iz spremnika (R2 > `chartit-media` > Objects).

Ako ključ procuri, token se briše u R2 > Manage API tokens, stvara novi i upisuje na Renderu (odjeljak [Postupak kada tajna završi u repozitoriju](#postupak-kada-tajna-završi-u-repozitoriju)).

### Ograničenja učitavanja

Polja za slike koriste zajedničke validatore `IMAGE_VALIDATORS` iz `backend/config/validators.py`:

- dopuštene vrste: jpg, jpeg, png i webp,
- najveća veličina: 5 MB po datoteci (besplatni plan R2 ima ukupno 10 GB prostora),
- Django admin i DRF serijalizatori otvaraju datoteku bibliotekom Pillow i odbijaju sve što nije stvarna slika, bez obzira na nastavak.

Primjer u modelu:

```python
from config.validators import IMAGE_VALIDATORS

image = models.ImageField(upload_to='vessels/', validators=IMAGE_VALIDATORS)
```

Lokalno se datoteke poslužuju s istog origina kao aplikacija, a na Renderu s javne adrese spremnika, pa se ne smiju dopuštati vrste koje preglednik može izvršiti (npr. SVG ili HTML). Kad ih poslužuje Django, zaglavlje `X-Content-Type-Options: nosniff` (Django `SecurityMiddleware`) dodatno sprječava da preglednik datoteku protumači kao drugu vrstu; spremnik vraća vrstu sadržaja zapisanu pri učitavanju.

## Google OAuth prijava

Prijava Google računom koristi OAuth 2.0. Aplikacija je registrirana u Google Cloud Consoleu (Google Auth Platform), a Django s Googleom komunicira preko Client ID-a i Client Secreta. Putanja povratnog URL-a `/accounts/google/login/callback/` potječe iz biblioteke django-allauth odabrane u ADR-06 ([#86](https://github.com/tmpteamname1/ChartIt/pull/86)).

### Registracija OAuth aplikacije

1. **Projekt** je stvoren na zajedničkom Google računu tima (`progiprojekt94.fer@gmail.com`), a ne na osobnom računu jednog člana, kako pristup ne bi ovisio o jednoj osobi. Na račun se mogu prijaviti `Sven Matić` i `Lucian Lepur`, a lozinka se dijeli prema odjeljku "Dijeljenje tajni u timu". Dodatno su im u IAM-u dodijeljene uloge Owner.
2. **Consent screen:**
   - Branding: naziv aplikacije `ChartIt`, kontakt e-pošta `progiprojekt94.fer@gmail.com`,
   - Data Access: opsezi `openid`, `email`, `profile` (nisu osjetljivi, pa verifikacija nije potrebna),
   - Audience: vrsta korisnika External.
3. **Test users** (Audience > Test users): dok je aplikacija u stanju "Testing", prijaviti se mogu samo korisnici s popisa. Na popis se dodaju Google računi svih članova tima i asistenata. Adrese se ne navode u repozitoriju, nego se popis vodi i provjerava u konzoli. Pristup projektu u IAM-u ne dodaje korisnika na taj popis. Prije demonstracije aplikacija se može prebaciti u "In production" (Publish app), što s osnovnim opsezima ne traži verifikaciju.
4. **Web klijenti** (Clients > Create client > Web application). Consent screen, opsezi i test users zajednički su za oba klijenta.

### Klijenti za lokalni razvoj i produkciju

| Klijent | Authorized redirect URI | Gdje se koristi |
| --- | --- | --- |
| `ChartIt Web Client (lokalno)` | `http://localhost:8000/accounts/google/login/callback/` | `.env` članova tima. Secret se dijeli prema odjeljku "Dijeljenje tajni u timu". |
| `ChartIt Web Client` | `https://chartit-okv1.onrender.com/accounts/google/login/callback/` | Samo Render. Produkcijski secret ne šalje se u WhatsApp grupu i ne upisuje se ni u jedan `.env`. |

Redirect URI uvijek pokazuje na Django (backend), ne na Vite poslužitelj. Promjena na Googleu može se primijeniti tek nakon nekoliko minuta.

### Varijable okruženja

Varijable `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` opisane su u tablici "Popis varijabli". Lokalno se postavljaju u `.env`, a na Renderu prema odjeljku "Varijable okruženja na Renderu".

## Administrator platforme

Svi korisnici koji se prijave Googleom dobivaju ulogu `KORISNIK`. Ulogu `ADMINISTRATOR` ne može dobiti nitko prijavom ni zahtjevom klijenta, nego je postavlja tim naredbom na poslužitelju. Administrator platforme zatim u React aplikaciji stvara tvrtke i dodjeljuje vlasnike (UC-14).

Uloga `ADMINISTRATOR` i pristup Django adminu su odvojene stvari. Naredba mijenja samo `role`, a ne `is_staff` ni `is_superuser`. Django admin je alat za tim (pregled baze, ispravci) i za njega se koristi `createsuperuser` (odjeljak Administrator u poglavlju Postavljanje na Render). Administracija platforme obavlja se u React aplikaciji.

### Naredba `promote_admin`

```bash
python manage.py promote_admin <e-mail>
```

Naredba postavlja ulogu `ADMINISTRATOR` korisniku s tom adresom e-pošte (velika i mala slova se ne razlikuju). Odbija se s porukom o grešci ako:

- korisnik ne postoji,
- se korisnik još nikad nije prijavio Googleom,
- je korisnik deaktiviran,
- korisnik pripada tvrtki (administrator platforme ne smije imati tvrtku, 4.3.1).

Ako je korisnik već administrator, naredba to javlja i ništa ne mijenja, pa se može sigurno ponoviti.

### Postupak

1. Buduća administratorica se prijavi Googleom na aplikaciji. Time nastaje njezin korisnik s ulogom `KORISNIK`. Lokalno je to http://localhost:5173, na Renderu https://chartit-okv1.onrender.com.
2. Netko od tima pokrene naredbu s adresom e-pošte njezina Google računa.
3. Provjera: dok je prijavljena, otvoriti `/api/auth/me/` (lokalno http://localhost:5173/api/auth/me/, na Renderu https://chartit-okv1.onrender.com/api/auth/me/). Odgovor mora sadržavati `"role": "ADMINISTRATOR"`. Ponovna prijava nije potrebna, jer se uloga čita iz baze pri svakom zahtjevu.

### Lokalno (Docker)

```bash
docker compose exec backend python manage.py promote_admin ana@example.com
```

### Render

Besplatni plan nema ljusku na poslužitelju, pa se naredba pokreće s vlastitog računala, spojena na produkcijsku bazu preko vanjskog URL-a (isto kao `createsuperuser`). Vanjski URL vidi samo osoba s pristupom Renderu (Render > `chartit-db` > External Database URL).

1. Pripremiti backend na računalu (jednom), uz aktivirano virtualno okruženje:

   ```bash
   cd backend
   python3 -m venv .venv              # samo prvi put
   source .venv/bin/activate          # Windows (CMD/PowerShell): .venv\Scripts\activate
   python -m pip install -r requirements-dev.txt
   ```

   Treba i `.env` u korijenu repozitorija (kopija `.env.example`), jer Django traži `DJANGO_SECRET_KEY`. Vrijednost iz `.env.example` je dovoljna, produkcijski ključ ne treba.

2. Pokrenuti naredbu, s vanjskim URL-om baze samo za tu naredbu:

   ```bash
   DATABASE_URL='<vanjski URL>' python manage.py promote_admin ana@example.com
   ```

   U Windows PowerShellu se varijabla postavlja zasebno:

   ```powershell
   $env:DATABASE_URL='<vanjski URL>'
   python manage.py promote_admin ana@example.com
   Remove-Item Env:DATABASE_URL
   ```

   Varijabla postavljena u okruženju ima prednost pred vrijednošću iz `.env`, pa naredba radi na produkcijskoj bazi, a ne na lokalnoj. Vanjski URL sadrži lozinku baze, pa se ne sprema u `.env`, commit ni poruku.

3. Očekivani ispis je `ana@example.com je sada ADMINISTRATOR.` Ako se ispiše `Korisnik ... ne postoji`, osoba se još nije prijavila na Renderu (ili je upisana druga adresa).

Prvi zahtjev prema Renderu nakon razdoblja bez prometa čeka da se servis ponovno pokrene, pa prijava i provjera mogu potrajati.

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
5. Stvoriti administratora za Django admin (odjeljak Administrator), a nakon prve Google prijave i administratora platforme (odjeljak Administrator platforme).

### Varijable okruženja na Renderu

| Varijabla | Izvor |
| --- | --- |
| `DATABASE_URL` | Render, interni URL baze `chartit-db` (`fromDatabase`). Ne zapisuje se nigdje. |
| `DATABASE_SSLMODE` | `render.yaml`, vrijednost `require`. Interni URL dopušta vezu bez enkripcije, pa se ona ovako odbija. |
| `DJANGO_SECRET_KEY` | Render, generiran pri prvom postavljanju (`generateValue`). |
| `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS` | `render.yaml`, naziv poslužitelja koji je dodijelio Render. |
| `PYTHON_VERSION`, `NODE_VERSION` | `render.yaml`, iste verzije kao u `backend/Dockerfile` i CI-ju. |
| `GOOGLE_CLIENT_ID` | `render.yaml`, ID produkcijskog klijenta `ChartIt Web Client`. Nije tajna. |
| `GOOGLE_CLIENT_SECRET` | Upisuje se ručno u Render > `chartit` > Environment (`sync: false`). Render ne traži vrijednost za postojeći Blueprint, pa se nakon dodavanja u `render.yaml` mora postaviti ručno. |
| `MEDIA_S3_BUCKET`, `MEDIA_S3_ENDPOINT_URL`, `MEDIA_S3_PUBLIC_URL`, `MEDIA_S3_ACCESS_KEY_ID`, `MEDIA_S3_SECRET_ACCESS_KEY` | Upisuju se ručno (`sync: false`) prema odjeljku [Postavljanje spremnika](#postavljanje-spremnika-cloudflare-r2). Ključevi su tajne; ostale tri vrijednosti nisu, ali su na istom mjestu kao i ključevi. Dok `MEDIA_S3_BUCKET` nije postavljen, fotografije se spremaju na disk servisa i gube se. |

`DJANGO_DEBUG` nije postavljen, pa je `False`, a time su uključeni i preusmjeravanje na HTTPS, sigurni kolačići i HSTS. Render prekida TLS i prosljeđuje zahtjeve sa zaglavljem `X-Forwarded-Proto`, kao i Azure. `/api/health/` izuzet je od preusmjeravanja (`SECURE_REDIRECT_EXEMPT`), jer bi preusmjeravanje Render smatrao uspješnim odgovorom bez provjere baze.

### Administrator

Besplatni plan nema pristup ljusci (shell) na poslužitelju, pa se naredbe poput `createsuperuser` pokreću s vlastitog računala, spojene na produkcijsku bazu preko vanjskog URL-a (Render > `chartit-db` > External Database URL). Vanjske veze s Renderovom bazom uvijek su šifrirane.

```bash
cd backend                         # uz aktivirano virtualno okruženje
DATABASE_URL='<vanjski URL>' python manage.py createsuperuser
```

Vanjski URL sadrži lozinku baze, pa se ne sprema u `.env`, commit ni poruku. Podaci za prijavu dijele se prema odjeljku Dijeljenje tajni u timu. Time se stvara administrator za Django admin. Administrator platforme (uloga `ADMINISTRATOR`) stvara se naredbom `promote_admin` (odjeljak Administrator platforme).

### Ograničenja besplatnog plana

- Servis se nakon razdoblja bez prometa gasi, pa prvi sljedeći zahtjev čeka da se ponovno pokrene.
- Baza istječe 30 dana nakon stvaranja (uz 14 dana odgode, nakon čega se briše). Prije isteka podatke treba prebaciti u novu bazu.
- Servis nema trajni disk: sve što se zapiše u `backend/` gubi se pri svakom postavljanju, ponovnom pokretanju i gašenju. Zato se fotografije plovila spremaju u spremnik Cloudflare R2 (odjeljak [Medijske datoteke](#medijske-datoteke-fotografije-plovila)), a ne na disk servisa.

## Kontinuirana integracija (CI)

Svaki pull request prema grani `main` i svaki push u `main` automatski se provjerava pomoću GitHub Actionsa (`.github/workflows/ci.yml`). Tako se greške otkrivaju prije merga, a ne nakon postavljanja, i pregledavatelj ne mora ručno pokretati provjere. Postavljanje na platformu pokreće se iz grane `main`, pa u nju ulazi samo kod koji je prošao provjere.

Workflow ima dva posla koji rade usporedno:

| Posao | Koraci |
| --- | --- |
| `frontend` | Node 22, `npm ci`, `npm run lint` (oxlint), `npm run format:check` (Prettier), `npm run build` (uključuje provjeru tipova `tsc -b`) |
| `backend` | Python 3.11, PostgreSQL 17 kao service container, `ruff check`, `ruff format --check`, `manage.py check`, `manage.py makemigrations --check --dry-run` (otkriva promjene modela bez migracije), `manage.py test` |

Verzije Nodea, Pythona i PostgreSQL-a jednake su onima u `docker-compose.yml`, `backend/Dockerfile` i `render.yaml`. Testovi koriste PostgreSQL, a ne SQLite, jer ograničenje preklapanja rezervacija treba rasponske tipove i `btree_gist` (ADR-03). Backend u CI-ju radi s `DJANGO_DEBUG=False`, kao u produkciji, i s `DJANGO_HTTPS=False` kako testni klijent ne bi bio preusmjeravan na HTTPS. CI ne treba nikakve tajne.

Poslovi `frontend` i `backend` obavezne su provjere u pravilima grane `main` (ruleset "Approved before merge"), pa se pull request s neuspješnim CI-jem ne može spojiti. Promjena naziva posla zato zahtijeva i promjenu ruleseta. Workflow nema filtar po mapama (paths filter): obavezna provjera koja se zbog filtra ne pokrene ostaje na čekanju i blokira merge, a cijeli CI ionako traje nekoliko minuta.

Ista provjera može se lokalno pokrenuti naredbama iz odjeljka [Formatiranje i provjera koda](#formatiranje-i-provjera-koda).

Odabrani su GitHub Actions jer je repozitorij na GitHubu: nema dodatne usluge ni računa, rezultat se prikazuje izravno u pull requestu, a za javne repozitorije je besplatan. Razmotrene alternative:

- CI na platformi za postavljanje (Render ili Azure): provjerava samo ono što se postavlja, bez rezultata u pull requestu i bez mogućnosti da blokira merge.
- Vanjske usluge (npr. CircleCI): isti rezultat, ali uz dodatni račun i povezivanje s repozitorijem.
