# 7. Zaključak i budući rad

Poglavlje opisuje stanje projekta u Iteraciji 1 (projektni tjedan 7). Rezultati ispitivanja nalaze se u [poglavlju 5](5-Ispitivanje.md), a sljedivost zahtjeva u [odjeljku 2.6](2-Analiza-zahtjeva.md#26-sljedivost-zahtjeva).

## 7.1 Rezultati projekta

**Ostvareno i postavljeno na javnoj instanci** (https://chartit-okv1.onrender.com):

- Posjetitelj bez prijave pretražuje plovila prema luci, kategoriji, broju osoba i cijeni, uz sortiranje i straničenje (F-01, UC-01). Javni API vraća i detalje plovila i tvrtke (F-02). Neaktivna plovila i plovila neaktivnih tvrtki ne prikazuju se.
- Prijava i odjava Google računom (F-18, UC-10). Nova prijava dobiva ulogu KORISNIK; ulogu ADMINISTRATOR tim dodjeljuje naredbom `promote_admin` (F-22). Zaštićene rute klijenta i klase dopuštenja na API-ju razlikuju uloge, a API ponovno provjerava svaku ovlast (NF-02).
- Fotografije plovila i minijature trajno se spremaju u Cloudflare R2, pa ostaju i nakon ponovnog pokretanja servisa (poglavlje 6.3).
- Tvrtke, luke i kategorije plovila tim zasad uređuje kroz Django admin (F-19, F-23); demo katalog puni se naredbom `seed_catalog`.
- Sigurnosne postavke produkcije: HTTPS s HSTS-om, sigurni kolačići, CSRF zaštita i šifrirana veza s bazom (NF-04). Svaka promjena prolazi CI prije spajanja u `main` (poglavlje 6.3).

**Završava se za Iteraciju 1:** prelazak javne pretrage s lažnih podataka na API ([#96](https://github.com/tmpteamname1/ChartIt/issues/96)), popis flote tvrtke s izolacijom tvrtki ([#101](https://github.com/tmpteamname1/ChartIt/issues/101), PR #135), API za stvaranje plovila ([#102](https://github.com/tmpteamname1/ChartIt/issues/102)) i prelazak ekrana flote na API ([#116](https://github.com/tmpteamname1/ChartIt/issues/116)). Time vlasnik tvrtke dodaje plovilo iz panela tvrtke (F-08, UC-04).

**Djelomično ostvareno:**

- Pretraga ne filtrira po terminu (F-01), jer filtar ovisi o rezervacijama.
- Ograničenje preklapanja rezervacija pripremljeno je u bazi (proširenje `btree_gist`, ADR-03), ali model rezervacije još ne postoji (F-04, NF-01).
- Administracija tvrtki i šifrarnika radi samo kroz Django admin, bez ekrana u aplikaciji (F-19, F-22, F-23).

**Nije ostvareno:** rezervacije i njihova obrada (F-03 – F-07, F-11 – F-14), statistika i izvještaj (F-15), vremenska prognoza i karta (F-16, F-17), upravljanje djelatnicima i podacima tvrtke (F-20, F-21), dodatne usluge plovila (F-09) i kalendar dostupnosti (F-10). Korisnik zato u ovoj fazi može pronaći plovilo, ali ne može poslati zahtjev za rezervaciju, što je glavna svrha aplikacije.

## 7.2 Izazovi i naučene lekcije

**Smještaj aplikacije.** Aplikacija je trebala biti postavljena na Azure, ali postavljanje nije uspijevalo. Nakon konzultacija s asistentom (5. 11. 2026.) prebačena je na besplatni plan Rendera, a arhitektura s jednim originom (ADR-01) ostala je ista ([#81](https://github.com/tmpteamname1/ChartIt/pull/81)). Besplatni plan donio je nova ograničenja: servis nema trajni disk, nema pristup ljusci, a baza istječe nakon 30 dana. Fotografije učitane na Renderu zato su se gubile pri svakom postavljanju, pa je katalog na javnoj instanci ostao prazan dok pohrana nije premještena u Cloudflare R2 ([#131](https://github.com/tmpteamname1/ChartIt/issues/131)). Naredbe nad produkcijskom bazom pokreću se s vlastitog računala, pa je pri punjenju kataloga uočeno da lokalni `.env` (`DJANGO_DEBUG=True`) isključuje zaštitnu provjeru naredbe; postupak je zato dopunjen u poglavlju 6.3.

*Lekcija:* ograničenja platforme za smještaj (trajni disk, pristup ljusci, istek baze) treba provjeriti pri odabiru platforme, a ne kada funkcionalnost koja o njima ovisi već postoji. Ranije postavljanje jednostavnog kostura aplikacije pokazalo je problem s Azureom na vrijeme, ali ograničenja pohrane datoteka uočena su tek uz prve fotografije.

**Usporedni rad frontend i backend tima.** Tim je podijeljen na frontend i backend dio. Da frontend ne bi čekao API, ekrani se izrađuju nad lažnim podacima koji imaju točan oblik odgovora zadan u zadatku, a zasebni zadatak zatim prebacuje ekran na stvarni API (npr. #94 i #96 za pretragu, #113 – #116 za flotu). Pokazalo se da to radi samo ako je oblik odgovora dogovoren unaprijed i zapisan u zadatku i konvencijama API-ja (poglavlje 4.9). Slično je uočeno u dokumentaciji: poglavlje 4 koristilo je stare oznake zahtjeva nakon preuređenja poglavlja 2, pa ih je trebalo naknadno uskladiti ([#104](https://github.com/tmpteamname1/ChartIt/issues/104)).

*Lekcija:* zajednički dogovori (oblik odgovora API-ja, oznake zahtjeva) trebaju imati jedno mjesto u repozitoriju na koje se svi zadaci pozivaju, a promjena tog dogovora treba se objaviti u pull requestu. Sljedeći put tim bi oblik odgovora za cijelu cjelinu dogovorio na početku epika, a ne po zadatku.

## 7.3 Budući rad

Nužno za ispunjenje izvornog opsega, prema prioritetu:

1. **Rezervacije (F-03 – F-06, F-12, NF-01).** Model rezervacije s ograničenjem preklapanja u bazi, zahtjev korisnika i pregled vlastitih rezervacija. Bez toga aplikacija ne ispunjava glavnu svrhu. Uz to treba ispitati istodobne zahtjeve za isti termin.
2. **Obrada rezervacija u panelu tvrtke (F-05, F-11, F-13, F-14) i obavijesti (F-07).** Djelatnik i vlasnik prihvaćaju ili odbijaju zahtjeve i vide raspored; korisnik dobiva obavijest e-poštom.
3. **Filtar pretrage po terminu (F-01) i kalendar dostupnosti (F-10),** koji ovise o rezervacijama.
4. **Ekrani administracije (F-19 – F-23)** umjesto Django admina, kako bi administrator platforme radio u aplikaciji.

Neobavezna proširenja:

- vremenska prognoza i karta polazne luke (F-16, F-17) i statistika tvrtke (F-15), ako ostane vremena nakon rezervacija,
- automatski testovi klijentske aplikacije, jer se ponašanje u pregledniku zasad provjerava samo ručno (poglavlje 5.4),
- postupak prijenosa produkcijske baze prije isteka besplatne baze na Renderu (30 dana) i zaštita naredbe `seed_catalog` od pokretanja nad produkcijom bez spremnika.

---

Utrošeno vrijeme i pojedinačni doprinosi dokumentirani su u dokumentu [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md).
