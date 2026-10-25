# ChartIt
Preuzimanje projekta:
```bash
git clone (https://github.com/tmpteamname1/ChartIt.git)
cd ChartIt
```
Preduvjeti:

- Node.js i npm
- Python 3

Pokretanje frontenda:

```bash
cd frontend
npm install
npm run dev
```

Prvo pokretanje backenda (stvaranje virtualnog okruzenja):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Svako drugo pokretanje:
```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```
