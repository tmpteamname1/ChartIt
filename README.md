# ChartIt

[![CI](https://github.com/tmpteamname1/ChartIt/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/tmpteamname1/ChartIt/actions/workflows/ci.yml)

## Opis aplikacije

<a id="deployment"></a>
## Postavljanje (engl. deployment)

Aplikacija je javno dostupna na https://chartit-okv1.onrender.com. Postupak postavljanja na Render opisan je u [poglavlju 6](docs/6-Postavljanje-instalacija-i-konfiguracija.md#postavljanje-na-render).

<a id="quick-start"></a>
## Brzi početak / instalacija

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

Vrijednosti iz `.env.example` dovoljne su za lokalni razvoj. Popis svih varijabli okruženja i pravila za tajne opisani su u poglavlju 6 dokumentacije (`docs/6-Postavljanje-instalacija-i-konfiguracija.md`).

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

Aplikacija se otvara na **http://localhost:5173**. Vite razvojni poslužitelj prosljeđuje `/api`, `/admin` i `/static` na Django (port 8000), pa su klijent i API na istom originu kao i u produkciji.

Veza klijenta, API-ja i baze provjerava se na početnoj stranici, koja prikazuje "backend: OK", ili izravno na http://localhost:5173/api/health/.

Dokumentacija API-ja (Swagger UI) nalazi se na http://localhost:5173/api/docs/, a konvencije API-ja opisane su u [poglavlju 4.9](docs/4-Arhitektura-i-oblikovanje.md#49-konvencije-rest-api-ja). Nakon povlačenja promjena koje mijenjaju `requirements.txt` backend treba ponovno izgraditi s `docker compose up --build`.

Na http://localhost:8000 Django prikazuje zadnju izgrađenu verziju React aplikacije (`npm run build`), a ne trenutni kod. Promjene u `frontend/src` tamo se vide tek nakon ponovnog builda, zato se u razvoju koristi port 5173.

Administratorski račun za Django admin (http://localhost:5173/admin/):

```bash
docker compose exec backend python manage.py createsuperuser
```

#### Backend izvan Dockera (virtualno okruženje)

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

#### Korisne naredbe

```bash
docker compose down                                   # zaustavljanje (podaci u bazi ostaju)
docker compose down -v                                # zaustavljanje i brisanje baze ispočetka
docker compose up --build                             # nakon promjene requirements.txt
docker compose logs -f backend                        # praćenje logova backenda
docker compose exec backend python manage.py test     # testovi (koriste PostgreSQL)
docker compose exec backend python manage.py <naredba>
docker compose exec db psql -U chartit -d chartit     # konzola baze
```

Ako je port 5432 zauzet (npr. druga PostgreSQL baza na računalu), potrebno ju je zaustaviti prije `docker compose up`.

Ako je lokalna baza stvorena prije uvođenja prilagođenog modela korisnika (aplikacija `accounts`), migracije javljaju grešku `InconsistentMigrationHistory`. Bazu je tada potrebno jednom obrisati s `docker compose down -v` i ponovno pokrenuti `docker compose up`.

Ako Django javlja `Set the DJANGO_SECRET_KEY environment variable`, u `.env` nedostaju nove varijable. Treba ih prepisati iz `.env.example`, a za `DJANGO_SECRET_KEY` lokalno je dovoljan bilo koji dugi niz znakova.

#### Testna prijava

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

Vlasnik druge tvrtke služi za ručnu provjeru da tvrtka ne vidi tuđe podatke. Testni korisnici nemaju lozinku i mogu se prijaviti samo ovim putem. Bez `ENABLE_TEST_LOGIN` (zadano) endpointi `/api/auth/test-login/` i `/api/auth/test-logout/` ne postoje (404), a izbornik se ne prikazuje. Na javnoj instanci zastavica se ne uključuje.

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

Za provjeru bez mijenjanja datoteka koriste se `ruff format --check .` i `npm run format:check`. Iste provjere, uz build frontenda i backend testove, pokreće CI na svakom pull requestu ([poglavlje 6](docs/6-Postavljanje-instalacija-i-konfiguracija.md#kontinuirana-integracija-ci)).

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

## Tehnologije

<a id="team-members"></a>
## Članovi tima

## Doprinos projektu

<a id="license"></a>
## Status licence

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška
