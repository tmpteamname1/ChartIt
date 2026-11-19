# ChartIt

[![CI](https://github.com/tmpteamname1/ChartIt/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/tmpteamname1/ChartIt/actions/workflows/ci.yml)

ChartIt je web-aplikacija u kojoj korisnici pretražuju i rezerviraju plovila više charter tvrtki, a tvrtke upravljaju svojom flotom i rezervacijama.

**Projekt na kolegiju:** Ovu je aplikaciju razvio studentski tim u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER).

## Opis aplikacije

Charter tvrtke često vode flotu i rezervacije u tablicama, e-porukama i telefonskim dogovorima, pa je teško pouzdano znati koje je plovilo slobodno i lako je isto plovilo rezervirati dvaput. ChartIt na jednom mjestu okuplja ponudu više tvrtki: posjetitelji pretražuju plovila bez prijave, korisnici šalju zahtjeve za rezervaciju, a djelatnici i vlasnici tvrtki upravljaju flotom i rezervacijama. Sve tvrtke dijele jednu bazu podataka, a svaka vidi samo svoje podatke.

**Ključne funkcionalnosti (trenutačno stanje)**

- Pretraga plovila bez prijave prema nazivu, polaznoj luci, kategoriji, tvrtki, broju osoba i cijeni, uz sortiranje i straničenje rezultata.
- Prijava i odjava Google računom (OAuth 2.0); uloga korisnika određuje dostupne dijelove aplikacije.
- Panel tvrtke za vlasnika: pregled flote svoje tvrtke i dodavanje novog plovila. Tvrtka ne vidi plovila drugih tvrtki.

**Planirano:** detalji plovila, zahtjev za rezervaciju s dodatnim uslugama i sprječavanjem preklapanja termina, obrada zahtjeva i raspored preuzimanja i povrata za djelatnike, statistika za vlasnika, administracija tvrtki i šifrarnika u aplikaciji, vremenska prognoza i karta te obavijesti e-poštom.

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [dokumentaciju](docs/Home.md).

<a id="deployment"></a>
## Postavljanje (engl. deployment)

**Javno dostupna aplikacija:** https://chartit-okv1.onrender.com

**Isprobajte:** Na početnoj stranici odaberite polaznu luku ili kategoriju plovila i pokrenite pretragu, a zatim promijenite sortiranje rezultata.

**Demonstracija:** Za pretragu korisnički račun nije potreban. Prijava Google računom radi za račune koje je tim dodao na popis testnih korisnika aplikacije (Google OAuth u stanju "Testing"). Panel tvrtke dostupan je vlasniku i djelatniku tvrtke; ulogu i tvrtku računu dodjeljuje tim na zahtjev. Lozinke ni pristupni podaci ne objavljuju se.

**Ograničenja:** Aplikacija je na besplatnom planu Rendera: nakon razdoblja bez prometa prvi zahtjev čeka ponovno pokretanje servisa (do minute), a učitane fotografije ne ostaju trajno spremljene. Detalji su u odjeljku [Ograničenja besplatnog plana](docs/6-Postavljanje-instalacija-i-konfiguracija.md#ograničenja-besplatnog-plana).

[Vodič za postavljanje i pokretanje](docs/6-Postavljanje-instalacija-i-konfiguracija.md) opisuje postavljanje na Render.

<a id="quick-start"></a>
## Brzi početak / instalacija

**Preduvjeti:** Docker Desktop (ili Docker Engine uz Docker Compose v2) i Node.js 20.19+ ili 22.12+ uz npm. Baza (PostgreSQL 17) i backend (Python, Django) pokreću se u Dockeru.

```bash
git clone https://github.com/tmpteamname1/ChartIt.git
cd ChartIt
cp .env.example .env               # Windows: copy .env.example .env
docker compose up                  # baza i backend; migracije se izvršavaju pri pokretanju
```

U drugom terminalu:

```bash
cd frontend
npm install
npm run dev
```

**Adresa:** http://localhost:5173 (Vite prosljeđuje `/api`, `/admin`, `/media` i `/static` na Django na portu 8000).

**Konfiguracija:** Vrijednosti iz `.env.example` dovoljne su za lokalni razvoj. Za prijavu Googleom potrebni su `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` lokalnog OAuth klijenta, koje tim dijeli izvan repozitorija; bez njih se uloge mogu isprobati [testnom prijavom](docs/6-Postavljanje-instalacija-i-konfiguracija.md#testna-prijava). Sve varijable opisane su u [poglavlju 6](docs/6-Postavljanje-instalacija-i-konfiguracija.md#varijable-okruženja-i-tajne).

Provjera: http://localhost:5173/api/health/ vraća `{"status": "ok", "database": "ok"}`. Demo katalog (tvrtke, luke, kategorije i plovila) puni se naredbom `docker compose exec backend python manage.py seed_catalog`. Pokretanje backenda izvan Dockera, testna prijava, korisne naredbe, provjera koda i rješavanje čestih problema opisani su u odjeljku [Lokalna instalacija i konfiguracija](docs/6-Postavljanje-instalacija-i-konfiguracija.md#62-lokalna-instalacija-i-konfiguracija).

## Tehnologije

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| Django i Django REST Framework | Poslužiteljski dio: REST API, provjera ovlasti po ulogama, Django admin za tim. | Ugrađeni model korisnika, migracije i admin skraćuju rad na infrastrukturi; jedan Django servis poslužuje i API i izgrađeni klijent s istog origina (ADR-01). |
| PostgreSQL | Pohranjuje plovila, tvrtke, korisnike i rezervacije svih tvrtki u jednoj bazi. | Sprječavanje preklapanja rezervacija rješava se ograničenjem u bazi nad rasponima datuma (`btree_gist`, ADR-03), zato se ni u testovima ne koristi SQLite. |
| React, TypeScript i Vite | Klijentska aplikacija (javni dio, panel tvrtke, administracija). | Tipovi odgovora API-ja provjeravaju se pri izgradnji; Vite u razvoju prosljeđuje API pozive na Django, pa vrijede isti uvjeti kao u produkciji. |
| Mantine | Komponente sučelja i responzivni raspored. | Gotove pristupačne komponente (obrasci, tablice, obavijesti) za računalo i mobitel. |
| TanStack Query | Dohvat i privremeno spremanje podataka s API-ja u klijentu. | Stanja učitavanja i greške prikazuju se jednako na svim ekranima; dok backend endpoint ne postoji, API modul vraća lažne podatke istog oblika. |
| django-allauth i Google OAuth 2.0 | Prijava korisnika Google računom i sesija u kolačiću. | Aplikacija ne pohranjuje lozinke; prijava na javnoj instanci ovisi o postavkama klijenta u Google Cloud Consoleu (ADR-06). |
| Render | Javno postavljanje web-servisa i PostgreSQL baze iz `render.yaml`. | Besplatni plan: gašenje servisa bez prometa, baza istječe nakon 30 dana, nema trajnog diska za fotografije. |
| GitHub Actions | CI na svakom pull requestu: lint, formatiranje, build klijenta, provjera migracija i backend testovi. | Pull request se ne može spojiti u `main` dok provjere ne prođu. |

<a id="team-members"></a>
## Članovi tima

| Član | Glavna uloga ili doprinos |
| --- | --- |
| Sven Matić ([@svengitfer](https://github.com/svengitfer)) | Voditelj tima; arhitektura, postavljanje i CI, koordinacija backend i frontend tima |
| Bruno Crnković ([@brunocfer](https://github.com/brunocfer)) | Backend |
| Lucian Lepur ([@lucianlepur](https://github.com/lucianlepur)) | Backend; funkcijski i nefunkcijski zahtjevi i obrasci uporabe |
| Borna Pavičić ([@bornaP10](https://github.com/bornaP10)) | Backend |
| Mihael Bartulović ([@MihaelBartulovic](https://github.com/MihaelBartulovic)) | Frontend |
| Luka Nikolić ([@LukaNikolic2](https://github.com/LukaNikolic2)) | Frontend; skice sučelja |
| Luka Rušev ([@RusevLuka](https://github.com/RusevLuka)) | Frontend |

Uloge se tijekom projekta mogu mijenjati. Repozitorij i [GitHub Projects](https://github.com/orgs/tmpteamname1/projects/3) služe kao dodatni dokazi timskog rada; pregled aktivnosti je u [poglavlju A](docs/A-Pregled-aktivnosti-grupe.md).

## Doprinos projektu

Svaka promjena vezana je uz zadatak u [GitHub Issues](https://github.com/tmpteamname1/ChartIt/issues), a napredak se prati u [GitHub Projects](https://github.com/orgs/tmpteamname1/projects/3). Rad se odvija na zasebnoj grani (`<broj zadatka>-<kratki-opis>-<Ime>`) i u `main` ulazi samo kroz pull request koji je odobrio drugi član tima i koji je prošao CI. Pravila za kod i dokumentaciju opisana su u [poglavlju 4.6](docs/4-Arhitektura-i-oblikovanje.md#46-zajednička-pravila-oblikovanja-engl-cross-cutting-concerns) i [poglavlju 4.9](docs/4-Arhitektura-i-oblikovanje.md#49-konvencije-rest-api-ja).

<a id="license"></a>
## Status licence

Projektu nije dodijeljena licenca koja dopušta javnu ponovnu uporabu; sva prava na kod i sadržaj aplikacije zadržavaju članovi tima.

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Ta licenca **ne određuje automatski licencu studentske aplikacije**.

Kod trećih strana (biblioteke navedene u `backend/requirements.txt` i `frontend/package.json`), fotografije i drugi sadržaji zadržavaju vlastite licence i uvjete uporabe.

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Tim je koristio alate umjetne inteligencije (OpenAI Codex, Claude Code) za izradu i doradu skica sučelja, dijelova koda i dokumentacije. Svaka promjena prolazi pregled drugog člana tima u pull requestu i automatske provjere (CI), a autor promjene mora moći objasniti njezin sadržaj. U alate se ne unose tajne, pristupni podaci ni osobni podaci.

Detaljan zapis (alati, modeli, članovi, opseg i način provjere) nalazi se u [Izjavi o uporabi umjetne inteligencije](docs/Home.md#izjava-o-uporabi-umjetne-inteligencije).

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html). Pitanja i prijave problema otvaraju se kao [GitHub Issues](https://github.com/tmpteamname1/ChartIt/issues).

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
