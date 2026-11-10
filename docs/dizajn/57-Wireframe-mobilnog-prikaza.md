# Mobilni wireframei (#57)

Skice širine 375 px razrađuju mobilni prikaz prema [NF-03](../2-Analiza-zahtjeva.md#22-nefunkcijski-zahtjevi). Oznake ispod skica povezuju ih s rutama, ulogama i zahtjevima.

- [Pregled svih skica (SVG)](57-Wireframe-mobilnog-prikaza.svg)
- [Uređivi izvor (Excalidraw)](57-Wireframe-mobilnog-prikaza.excalidraw)

## Pregled skica

| Skice | Što prikazuju |
| --- | --- |
| 01, 02, 01b | Rezultati, otvoreni filtri i pretraga bez rezultata. |
| 03a–03c | Jedna stranica detalja plovila pri pomicanju. Ispod galerije slijede kalendar, karta, prognoza, dodatne usluge i procjena iznosa. |
| 04, 04b, 04c | Zahtjev s pregledom iznosa, zauzeti termin uz očuvane usluge i potvrda slanja. |
| 05, 06, 06b | Moje rezervacije, detalji s kontaktom tvrtke i potvrda otkazivanja. |
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
- **Obrasci i dijalozi.** Polja, oznake i poruke greške slažu se u jedan stupac. Gumbi se nižu ispod sadržaja, s dodirnim područjem od najmanje 44 × 44 px. U potvrdnom dijalogu fokus prvo ide na odustajanje. Pri slanju se radnja privremeno onemogući prema uzorku U-03.
- **Izbornik.** Gumb u zaglavlju otvara i zatvara izbornik. U popisu je označena trenutačna stranica, a odabir poveznice zatvara izbornik. Posjetitelj ima prijavu u zaglavlju, a prijavljeni korisnik ondje otvara izbornik računa za odjavu. U panelu su djelatniku i vlasniku dostupne stavke „Zahtjevi”, „Raspored” i „Rezervacije”. Pristup rezervacijama slijedi F-11 i UC-05. Vlasničke i administratorske poveznice prikazuju se pripadajućim ulogama.

## Ponašanje u skiciranim tokovima

- **Pretraga.** Filtri obuhvaćaju termin, luku polaska, kategoriju, broj osoba i tvrtku. Otvaraju se s trenutačnim vrijednostima. Primjena vraća na prvu stranicu rezultata, a zatvaranje odbacuje promjene u otvorenom prikazu.
- **Detalji i zahtjev.** Prijedlog je da se termin i usluge odabrani u detaljima prenesu na stranicu zahtjeva, gdje ih korisnik može promijeniti. Ako je potrebna prijava, nakon prijave nastavlja na zahtjevu s tim odabirom. Detalji prikazuju procjenu, a u zahtjevu i potvrdi prikazan je iznos koji je izračunao poslužitelj. Kod preklapanja korisnik mijenja termin uz sačuvane usluge.
- **Moje rezervacije.** Svaki status napisan je na kartici. Na detaljima se prikazuju pohranjeni iznos i kontakt tvrtke, uključujući deaktivirane tvrtke. Za statuse u kojima je otkazivanje dopušteno prikazuje se radnja s dijalogom D-01. U ostalim statusima prikazuje se poruka „Otkazivanje nije dostupno.”
- **Rad u marini.** Raspored grupira događaje po danu i razlikuje preuzimanje od povrata tekstom. Djelatnik iz kartice otvara rezervaciju. Nakon uspješnog evidentiranja sučelje prikazuje zabilježeno vrijeme, a evidentirani povrat mijenja status u „Završeni najam”.

Poruke praznih stanja i grešaka slijede [katalog zajedničkih stanja (#58)](58-Zajednicka-stanja-sucelja.md#primjena-po-ekranima). Pri nedostupnosti karte ili prognoze poruka se prikazuje u pripadajućem bloku prema V-01 ili V-02. Kalendar i nastavak prema zahtjevu ostaju dostupni.
