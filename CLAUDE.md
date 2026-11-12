# ChartIt

Student team project: a web app for renting boats from charter companies. Visitors search vessels without logging in; users request reservations; company employees and owners manage reservations and the fleet; a platform admin manages companies and code lists. All companies share one database and are separated by filtering on the logged-in user's company (ADR-02).

Roles (`accounts.User.role`): KORISNIK, DJELATNIK, VLASNIK, ADMINISTRATOR. An owner (VLASNIK) can do everything an employee (DJELATNIK) can.

## Stack and layout

- `backend/`: Django + DRF, PostgreSQL (not SQLite: reservations need range types and `btree_gist`). Apps: `accounts` (users, roles, permissions, test login), `companies`, `fleet` (vessels, categories, ports), `reservations`. Settings and shared API code in `backend/config/`.
- `frontend/`: React + TypeScript (Vite), Mantine, TanStack Query, React Router. In production Django serves the built app from one origin (ADR-01).
- `docs/`: project documentation in Croatian. It is the source of truth for rules; read the relevant chapter instead of guessing:
  - 4.6 cross-cutting rules (security, company isolation, money, validation)
  - 4.8 frontend routes, 4.9 REST API conventions (URLs, pagination, error format, CSRF, permissions, adding an endpoint)
  - `docs/dizajn/`: wireframes and the shared UI states catalogue (`58-Zajednicka-stanja-sucelja.md`, codes like U-01, G-02)

Setup, commands and test login are in `README.md`.

## Commands

```bash
docker compose up                                     # db + backend on :8000
cd frontend && npm run dev                            # app on http://localhost:5173 (use this port)
docker compose exec backend python manage.py test     # backend tests
cd backend && ruff check --fix . && ruff format .     # backend lint + format
cd frontend && npm run lint && npm run format && npm run build
```

CI runs the same checks on every PR, plus `makemigrations --check`, so model changes need their migration committed. Run them before saying a change is done.

## Rules that are easy to get wrong

Backend:
- Identity and role always come from the session (`request.user`), never from the request body or URL.
- Role checks use the classes in `backend/accounts/permissions.py`. Company panel views also limit `get_queryset()` to `request.user.company`; an object of another company returns 404, not 403. Test this with two companies.
- Money is `DecimalField` and is serialized as a string (`"150.00"`). Never use floats for money.
- Deactivate (`is_active`), don't delete. Foreign keys use `on_delete=PROTECT`.
- Database constraints must also be checked in the serializer, so bad input returns 400, never 500 (`IntegrityError`, see #102).
- Messages we write ourselves (validation, domain errors) are in Croatian.

Frontend:
- All API calls and API types live in `frontend/src/api/*.ts`. Screens never call `fetch` directly and never import from `src/api/mocks/`. When a backend endpoint doesn't exist yet, the module returns mock data with the exact response shape from the ticket.
- API field names stay `snake_case` as returned by the API; decimals are `string`.
- Routes and UI text are in Croatian. Only build what the wireframes show; no buttons or screens for features outside the ticket.
- Hiding UI by role is not protection; the API checks permissions again.

## Workflow

- Every change is tied to a GitHub issue. Branch: `<issue>-<short-slug>-<Name>` (e.g. `49-testna-prijava-Sven`). Changes reach `main` only through a pull request.
- Commit messages in Croatian, preferably `<issue>: <summary>` (e.g. `49: Testna prijava za lokalni razvoj`).
- Docs, issues and PR descriptions are in Croatian. Code, identifiers and code comments are in English.
- Issues follow the existing format: KONTEKST, ZAŠTO, GDJE U KODU, POTREBNO JE, IZVAN OPSEGA, KORISNO, OVISI O, KRITERIJI PRIHVAĆANJA.
- A change to the shape of an existing API response must be announced in the PR description (4.9).
- AI use is recorded in the table in `docs/Home.md` ("Izjava o uporabi umjetne inteligencije", FER policy): tool, model, author and what it was used for.
