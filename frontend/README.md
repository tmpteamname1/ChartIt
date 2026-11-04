# ChartIt frontend

React (Vite + TypeScript) aplikacija. Pokretanje u razvoju opisano je u glavnom README-u; ukratko:

```bash
npm install
npm run dev      # http://localhost:5173, /api i /admin prosljeđuju se Djangu
npm run lint
npm run build    # rezultat ide u backend/frontend_dist
```

## Biblioteke

Odluke iz zadatka #60. Nova biblioteka uvodi se tek dogovorom s frontend dijelom tima.

| Područje | Odluka | Razmatrana alternativa i obrazloženje |
| --- | --- | --- |
| Usmjeravanje | React Router | TanStack Router. React Router je najrašireniji i tim ga najvjerojatnije već poznaje. |
| Komponente i stil | Mantine (`@mantine/core`, `@mantine/hooks`) | MUI; shadcn/ui s Tailwindom. Mantine ima gotove obrasce, tablice, dijaloge, obavijesti i responzivni layout (AppShell), stilizira se običnim CSS-om i ne traži učenje Tailwinda. |
| Ikone | Tabler Icons (`@tabler/icons-react`) | Ikone koje koriste primjeri iz Mantine dokumentacije. |
| Dohvat podataka | TanStack Query uz zajednički modul `api/` | Običan `fetch` s vlastitim hookom. TanStack Query sam vodi stanje učitavanja i grešaka (NF-05, 4.6). |
| Odabir datuma i kalendar (F-20) | `@mantine/dates` | Zasebna biblioteka za kalendar. Ista biblioteka i stil kao ostatak sučelja, podržava raspon datuma i onemogućene dane. Uvodi se s prvim ekranom koji je treba. |
| Datumi i vremenska zona | dayjs s dodatkom za vremenske zone | date-fns. `@mantine/dates` već koristi dayjs, pa se ne uvodi druga biblioteka. |
| Obrasci | `@mantine/form` | React Hook Form. Izravno se povezuje s Mantine poljima. Po potrebi uz Zod. |
| Karta (F-16) | react-leaflet s OpenStreetMap pločicama | Google Maps. Bez ključa, u skladu s ADR-05; prije uvođenja provjeriti uvjete korištenja pločica. |
| Grafovi (F-13) | Odluka se odgađa; vjerojatno `@mantine/charts` (Recharts) | Chart.js. |

## Struktura mapa

```
src/
  api/          pozivi prema poslužitelju (client.ts) i, kasnije, funkcije po modulu API-ja
  auth/         uloge, kontekst prijavljenog korisnika i zaštita ruta (RequireRole)
  components/   zajedničke komponente koje koristi više stranica
  layouts/      AppLayout (zaglavlje i bočni izbornik) i konfiguracija izbornika
  pages/
    public/     javni dio: pretraga, detalji plovila, tvrtka, prijava
    user/       korisnički dio: zahtjev za rezervaciju, moje rezervacije
    company/    panel tvrtke (djelatnik i vlasnik)
    admin/      administracija platforme
    errors/     404, 403 i greška pri prikazu
  router.tsx    sve rute aplikacije
  theme.ts      Mantine tema (boje, tipografija)
```

Svaki ekran ima svoju datoteku u `pages/`, pa više članova tima može raditi usporedno bez sukoba u istoj datoteci.

## Rute i layouti

Rute prate mapu stranica u [poglavlju 4.8](../docs/4-Arhitektura-i-oblikovanje.md#48-mapa-stranica-i-ruta-klijentske-aplikacije). Rute su na hrvatskom; `/api`, `/admin` i `/static` pripadaju Djangu, zato je administracija platforme pod `/administracija`.

Sva četiri dijela koriste `AppLayout`: javni i korisnički dio imaju samo zaglavlje, a panel tvrtke i administracija i bočni izbornik. Na mobitelu se izbornik otvara gumbom (hamburger). Stavke izbornika i uloge koje ih vide definirane su u `layouts/navigation.ts`.

## Privremena prijava

Do epica za OAuth prijava je lažna: u razvoju se uloga bira padajućim izbornikom u zaglavlju i pamti u pregledniku. `RequireRole` neprijavljenog korisnika šalje na `/prijava`, a korisniku bez odgovarajuće uloge prikazuje „Nemate pristup”. Ovo je samo za izgled sučelja; ovlasti uvijek provjerava poslužitelj.
