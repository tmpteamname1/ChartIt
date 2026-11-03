# ChartIt

## Preduvjeti

- Node.js 20.19+ ili 22.12+ (uz npm)
- Python 3.10+

## Preuzimanje projekta

```bash
git clone https://github.com/tmpteamname1/ChartIt.git
cd ChartIt
```

## Prvo postavljanje

Backend (virtualno okruženje, ovisnosti, baza i administratorski račun):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # račun za prijavu u /admin/
```

Frontend:

```bash
cd frontend
npm install
```

## Pokretanje u razvoju

Potrebna su dva terminala, jedan za backend i jedan za frontend.

Terminal 1, backend (http://localhost:8000):

```bash
cd backend
source .venv/bin/activate          # Windows: .venv\Scripts\activate
python manage.py runserver
```

Terminal 2, frontend (http://localhost:5173):

```bash
cd frontend
npm run dev
```

Aplikacija se otvara na **http://localhost:5173**. Vite razvojni poslužitelj prosljeđuje `/api`, `/admin` i `/static` na Django (port 8000), pa su klijent i API na istom originu kao i u produkciji. Django admin je dostupan na http://localhost:5173/admin/.

Veza klijenta, API-ja i baze provjerava se na početnoj stranici, koja prikazuje "backend: OK", ili izravno na http://localhost:5173/api/health/.

Na http://localhost:8000 Django prikazuje zadnju izgrađenu verziju React aplikacije (`npm run build`), a ne trenutni kod. Promjene u `frontend/src` tamo se vide tek nakon ponovnog builda, zato se u razvoju koristi port 5173.

Nakon povlačenja novih promjena s gita po potrebi ponovno pokrenuti `python -m pip install -r requirements.txt`, `python manage.py migrate` i `npm install`.

## Pokretanje kao u produkciji

Django poslužuje izgrađenu React aplikaciju i statičke datoteke (WhiteNoise), a pokreće se preko gunicorna:

```bash
cd frontend
npm run build              # rezultat ide u backend/frontend_dist
cd ../backend
source .venv/bin/activate
python manage.py collectstatic --noinput
DJANGO_DEBUG=False DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1 gunicorn config.wsgi --bind 127.0.0.1:8000
```

Aplikacija je tada dostupna na http://localhost:8000. Gunicorn ne radi na Windowsima; tamo se ovaj način pokretanja isprobava u WSL-u ili Dockeru.
