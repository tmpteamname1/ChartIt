# Mobilni wireframei (#57)

Skice širine 375 px razrađuju mobilni prikaz prema [NF-03](../2-Analiza-zahtjeva.md#22-nefunkcijski-zahtjevi). Oznake ispod skica povezuju ih s rutama, ulogama i zahtjevima.

- [Pregled svih skica (SVG)](57-Wireframe-mobilnog-prikaza.svg)
- [Uređivi izvor (Excalidraw)](57-Wireframe-mobilnog-prikaza.excalidraw)

## Pregled skica

| Skice | Što prikazuju |
| --- | --- |
| 01, 02, 01b | Rezultati, otvoreni filtri i pretraga bez rezultata. |
| 03a–03c | Jedna stranica detalja plovila pri pomicanju. Ispod galerije slijede kalendar, karta, prognoza, dodatne usluge i procjena iznosa. |
| 04a–04d | Prijava za nastavak, zahtjev s lukom i brojem putnika, zauzeti termin uz očuvane usluge i potvrda slanja. |
| 05, 06, 06b, 06c | Moje rezervacije, detalji s kontaktom tvrtke, potvrda otkazivanja i prikaz nakon preuzimanja. |
| 07, 07b, 08, 09, 09b | Tjedni raspored, prazno razdoblje, evidentiranje preuzimanja i povrata te završeni najam. |
| N1–N5 | Otvoreni izbornik za posjetitelja, korisnika, djelatnika, vlasnika i administratora. |

## Prijelomne točke

Prijelomi slijede Mantineove točke `sm` i `md`. Širine u pikselima vrijede pri zadanoj veličini fonta preglednika od 16 px.

| Širina prikaza | Raspored |
| --- | --- |
| Mobitel, ispod `48em` (< 768 px) | Jedan stupac. Glavna navigacija otvara se gumbom u zaglavlju. Filtri pretrage otvaraju zaseban prikaz preko rezultata. |
| Tablet, od `48em` do ispod `62em` (768–991 px) | Vraćaju se poveznice u zaglavlju i bočni izbornik u panelima. Kartice i kratka polja mogu u dva stupca gdje ima dovoljno prostora. |
| Računalo, od `62em` (≥ 992 px) | Koristi se širi raspored prema skicama javnog dijela, korisničkog dijela i panela. |

## Pravila za manje zaslone

- **Tablice.** Popisi s radnjama po zapisu, primjerice zahtjevi, rezervacije, flota i tvrtke, na mobitelu prelaze u kartice. Na kartici ostaju naziv ili identifikator, ključni podaci, status i radnja za taj zapis. Guste tablice za usporedbu, primjerice u statistici, mogu se pomicati vodoravno unutar vlastitog okvira uz vidljiva zaglavlja. Stranica se pomiče okomito.
- **Obrasci i dijalozi.** Polja, oznake i poruke greške slažu se u jedan stupac. Gumbi se nižu ispod sadržaja, s dodirnim područjem od najmanje 44 × 44 px. Pri prikazu tipkovnice obrazac se može pomicati do aktivnog polja i njegove greške. U potvrdnom dijalogu fokus prvo ide na odustajanje, a pri zatvaranju bez radnje vraća se na gumb koji ga je otvorio. Pri slanju se radnja privremeno onemogući prema uzorku U-03.
- **Kalendar.** Mjesečna mreža ostaje dostupna za odabir dok svaki od sedam dana u retku može imati područje od najmanje 44 × 44 px. Na užem prikazu dostupnost se prikazuje kao okomit popis, uz odvojena polja za datum preuzimanja i povrata.
- **Izbornik.** Gumb u zaglavlju otvara i zatvara izbornik. U popisu je označena trenutačna stranica, a odabir poveznice zatvara izbornik. Ako popis ne stane po visini, može se pomicati do zadnje stavke. Posjetitelj ima prijavu u zaglavlju, a prijavljeni korisnik ondje otvara izbornik računa za odjavu. Izbornik prikazuje potvrđeni pristup rezervacijama za djelatnika i vlasnika prema F-11 i UC-05. Usklađivanje React rute i izbornika izdvojeno je u zaseban zadatak. [Dogovor u PR-u #89](https://github.com/tmpteamname1/ChartIt/pull/89)

## Ponašanje u skiciranim tokovima

- **Pretraga.** Filtri obuhvaćaju termin, luku polaska, kategoriju, broj osoba i tvrtku. Otvaraju se s trenutačnim vrijednostima. Primjena vraća na prvu stranicu rezultata, a zatvaranje odbacuje promjene u otvorenom prikazu. Povratak iz detalja plovila zadržava primijenjene filtre i stranicu rezultata.
- **Detalji i zahtjev.** Prijedlog je da se termin i usluge odabrani u detaljima prenesu na stranicu zahtjeva. Posjetitelj nakon prijave nastavlja s tim odabirom, a prijavljeni korisnik može ga urediti u zahtjevu. Zahtjev sadrži luku preuzimanja i broj putnika, od jednog do kapaciteta plovila. Ako plovilo ima samo jednu luku preuzimanja, ona je unaprijed odabrana. Iznos prije slanja je procjena, a potvrda prikazuje konačni iznos koji je poslužitelj spremio uz rezervaciju prema ADR-04. Kod preklapanja korisnik mijenja termin uz ostale sačuvane podatke. [Sekvencijski dijagram zahtjeva](../4-Arhitektura-i-oblikovanje.md#441-reprezentativni-uml-sekvencijski-dijagram)
- **Moje rezervacije.** Svaki status napisan je na kartici. Za prazan popis primjenjuje se P-02, s odlaskom na pretragu ili prikazom svih statusa ako je aktivan filtar. Na detaljima se prikazuju pohranjeni iznos i kontakt tvrtke, uključujući deaktivirane tvrtke. Dijalog D-01 dostupan je dok je rezervacija zahtjev ili je potvrđena i plovilo još nije preuzeto. Skica 06c prikazuje potvrđenu rezervaciju nakon preuzimanja, kad otkazivanje više nije dostupno. [Dijagram stanja rezervacije](../4-Arhitektura-i-oblikovanje.md#442-reprezentativni-uml-dijagram-stanja)
- **Rad u marini.** Raspored grupira događaje po danu i razlikuje preuzimanje od povrata tekstom. Nakon podataka o plovilu i korisniku slijede stanje i dostupna radnja. Evidentiranje ažurira stanje nakon potvrde poslužitelja. Ako odgovor ne stigne, najprije se osvježi stanje rezervacije. Evidentirani povrat prikazuje zabilježeno vrijeme i status „Završeni najam”.

Karta označava matičnu luku i mjesto preuzimanja. Pri nedostupnosti karte ili prognoze poruka se prikazuje u pripadajućem bloku prema V-01 ili V-02. Kalendar i nastavak prema zahtjevu ostaju dostupni. [Katalog zajedničkih stanja (#58)](58-Zajednicka-stanja-sucelja.md#primjena-po-ekranima)

## Provjera pri implementaciji

Na 320 i 375 px provjeriti otvaranje i zatvaranje filtara, odabir termina, prijavu s povratkom na zahtjev te radnje preuzimanja i povrata. Na 767 i 768 px provjeriti zamjenu hamburgera poveznicama u zaglavlju. Na 991 i 992 px provjeriti raspored kartica i obrazaca uz otvoren bočni izbornik. Stranica na tim širinama ostaje unutar prikaza, uz vodoravno pomicanje samo u predviđenim tablicama.

## Uporaba umjetne inteligencije

Nikolić je koristio OpenAI Codex za izradu i doradu mobilnih skica u SVG-u i Excalidrawu te pravila prilagodbe. Model nije zabilježen. Sadržaj je uspoređen s issueom #57, analizom zahtjeva, obrascima uporabe, arhitekturom, React navigacijom i povezanim skicama. Provjereni su prikaz u Chromeu, uvoz u Excalidraw, podudarnost oba formata i poveznice.
