# Funkcijski, nefunkcijski zahtjevi i ključni obrasci uporabe

Chartit - PROGI tim 9.4

## Funkcijski zahtjevi

| ID   | Opis                                                                                                                                                                     | Prioritet |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| F-01 | Sustav omogućuje korisniku pretraživanje i pregled raspoloživih plovila prema terminu, lokaciji polaska, vrsti plovila i broju osoba.                                    | Visok     |
| F-02 | Sustav omogućuje korisniku stvaranje zahtjeva za rezervaciju plovila za određeno razdoblje, uz odabir dodatnih usluga i izračun ukupne cijene.                           | Visok     |
| F-03 | Sustav mora spriječiti stvaranje preklapajućih rezervacija istog plovila i stvaranje rezervacija kada je plovilo nedostupno.                                             | Visok     |
| F-04 | Sustav bilježi status rezervacije. Statusi su: Zahtjev, potvrđena, odbijena, otkazana, završeni najam                                                                    | Visok     |
| F-05 | Sustav omogućuje korisniku pregled podataka o rezervaciji i pripadajućeg ukupnog iznosa.                                                                                 | Visok     |
| F-06 | Sustav dostavlja potvrdu rezervacije korisnku putem e-pošte. Potvrda sadrži ime tvrtke i kontakt za tu tvrtku.                                                           | Visok     |
| F-07 | Sustav omogućuje vlasniku dodavanje i izmjene plovila, njihove osnovne informacije, fotografija, kategorija plovila, opreme, definiranje cijene i dodatnih usluga za plovila svoje tvrtke. | Visok     |
| F-08 | Sustav omogućuje vlasniku upravljanje rezervacijama svoje tvrtke.                                                                                                        | Visok     |
| F-09 | Sustav omogućuje valsniku evidentiranja razdoblja u kojima pojedino plovilo nije raspoloživo radi servisa, održavanja ili drugih razloga za plovila svoje tvrtke.        | Visok     |
| F-10 | Sustav omogućuje administratoru stvaranje i editiranje djelatnika, upravljanje korisničkim računima i dodjelu uloga (djelatnik, voditelj)                                | Srednji   |
| F-11 | Sustav omogućuje djelatnicima potvrđivanje ili odbijanje zahtjeva za rezervaciju plovila svoje tvrtke.                                                                   | Visok     |
| F-12 | Sustav omogućuje djelatnicima pregled rasporeda preuzimanja i povrata plovila te pregled osnovnih podataka o plovilu svoje tvrtke.                                       | Visok     |
| F-13 | Sustav omogućuje vlasniku tvrtke pregled osnovnih statističkih podataka o svojoj tvrtci. To su zauzetost, rezervacije, prihod, popularnost usluga i najpopularnije kategorije plovila.      | Srednji   |
| F-14 | Sustav omogućuje vlasniku izvoz odabranih izvještaja za svoju tvrtku u standardnom formatu (CSV).                                                                        | Srednji   |
| F-15 | Sustav omogućuje korisniku pregled informacija o vremenskim uvjetima za mjesto i termin najma.                                                                           | Srednji   |
| F-16 | Sustav ostvaruje integraciju s kartografskim servisom te prikazuje položaj matične luke i lokaciju preuzimanja plovila.                                                  | Srednji   |
| F-17 | Sustav omogućuje prijavu i registraciju korisnicima putem vanjskog OAuth pružatelja.                                                                                     | Visok     |
| F-18 | Sustav podržava različite vrste korisnika s odgovarajućim ovlastima. To su korisnik, djelatnik, vlasnik i administrator.                                                 | Visok     |
| F-19 | Sustav oslobađa termin plovila u slučaju otkazivanja.                                                                                                                    | Srednji   |
| F-20 | Sustav omogućuje korisniku pregled detalja plovila (karakteristike, oprema, fotografije, cijena) i slobodnih termina.                                                    | Visok     |
| F-21 | Sustav omogućuje korisniku otkazivanje vlastite rezervacije.                                                                                                             | Visok     |
| F-22 | Sustav omogućuje djelatniku evidentiranje preuzimanja i povrata plovila te označavanje najma završenim.                                                                  | Srednji   |
| F-23 | Sustav omogućuje neprijavljenom posjetitelju pretraživanje i pregled plovila bez prijave.                                                                                | Srednji   |
| F-24 | Sustav obavještava korisnika e-poštom o odbijanju ili otkazivanju rezervacije.                                                                                           | Nizak     |
| F-25 | Sustav omogućuje administratoru stvaranje, izmjenu i deaktivaciju charter tvrtki (naziv, OIB, adresa, kontakt podaci).                                                   | Visok     |
| F-26 | Sustav omogućuje administratoru dodjelu vlasnika charter tvrtki.                                                                                                         | Visok     |
| F-27 | Sustav omogućuje vlasniku stvaranje, izmjenu i deaktivaciju djelatnika svoje tvrtke.                                                                                     | Visok     |
| F-28 | Sustav omogućuje vlasniku izmjenu podataka o svojoj tvrtki.                                                                                                              | Srednji   |
| F-29 | Sustav omogućuje korisniku pretraživanje plovila svih tvrtki, filtriranje po tvrtki i pregled osnovnih podataka o tvrtki.                                                | Visok     |
| F-30 | Sustav omogućuje administratoru upravljanje zajedničkim popisima kategorija plovila i luka.                                                                              | Srednji   |


## Nefunkcijski zahtjevi

| ID    | Opis                                                                                                                       | Prioritet | Način provjere                                                                                                                                             |
| ----- | -------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NF-01 | Sustav treba podržavati rad više korisnika u stvarnom vremenu.                                                             | Visok     | Provesti testiranje istovremenog pristupa više korisnika i <br> provjeriti ispravnost rada sustava i podataka.                                             |
| NF-02 | Sustav treba ograničiti funkcionalnosti aplikacije ovisno o vrsti korisnika.                                               | Visok     | Testirati pristup funkcionalnostima za svaku korisničku ulogu i <br> provjeriti da neovlašteni korisnici ne mogu pristupiti zabranjenim funkcijama.        |
| NF-03 | Stranica mora biti dinamička i prilagođavati se različitim veličinama ekrana.                                              | Visok     | Testirati prikaz i funkcionalnost sučelja na računalima, tabletima <br> i mobilnim uređajima različitih veličina zaslona.                                  |
| NF-04 | Veza sustava i baze podataka mora biti zaštićena.                                                                          | Visok     | Provjeriti konfiguraciju sigurne komunikacije, zaštitu pristupa <br> bazi podataka i način pohrane osjetljivih podataka.                                   |
| NF-05 | Aplikacija mora djelovati responzivno s indikatorima učitavanja i optimiranim dohvatom podataka                             | Visok     | Vrijeme odziva za uobičajene zahtjeve je manje od 2 sekunde te se <br> prikazuju indikatori učitavanja tijekom dohvaćanja podataka.                        |
| NF-06 | Ako meteorološki ili kartografski servis nije dostupan, sustav mora obavijestiti korisnika.                                | Srednji   | Simulirati nedostupnost vanjskih servisa i provjeriti prikazuje li <br> sustav odgovarajuću obavijest te nastavlja li prikazivati ostale dostupne podatke. |
| NF-07 | Podaci o rezervacijama i plovilima moraju biti pohranjeni tako da se mogu naknadno dohvatiti i koristiti za izvještavanje. | Visok     | Unijeti i pohraniti podatke, zatim ih dohvatiti i provjeriti jesu <br> li dostupni za prikaz i izradu izvještaja.                                          |
| NF-08 | Komunikacija između klijenta i poslužitelja mora se odvijati preko HTTPS-a.                                                | Visok     | Provjeriti da je aplikacija dostupna isključivo preko HTTPS-a i da se HTTP zahtjevi preusmjeravaju.                                                        |
| NF-09 | Aplikacija mora biti javno dostupna putem interneta.                                                                       | Visok     | Pristupiti aplikaciji s vanjske mreže i provjeriti rad osnovnih funkcionalnosti.                                                                           |
| NF-10 | Vlasnici i djelatnici smiju pristupati isključivo podacima svoje tvrtke.                                                   | Visok     | Pokušati kao djelatnik ili vlasnik tvrtke A dohvatiti ili izmijeniti podatke tvrtke B izravnim pozivom API-ja (npr. promjenom ID-a u URL-u) i provjeriti da sustav odbija zahtjev.                                                      |

## Ključni obrasci uporabe

### UC-01: Pretraživanje raspoloživih plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                 | Alternativni tok                                                                                    |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Korisnik       | F-01              | 1. Korisnik otvara stranicu za pretraživanje plovila. <br> 2. Unosi željene specifikacije za termin i plovilo. <br> 3. Sustav provjerava kriterije i raspoloživost plovila. <br> 4. Sustav prikazuje plovila koja odgovaraju kriterijima, <br> njihove karakteristike i cijene. <br> 5. Korisnik odabire plovilo i otvara njegove detalje. | Nema raspoloživih plovila sustav prikazuje <br> odgovarajuću poruku i omogućuje promjenu kriterija. |

### UC-02: Izrada rezervacije.

| Primarni akter | Povezani zahtjevi                 | Glavni tok                                                                                                                                                                                                                                                                                                                                                               | Alternativni tok                                                                                                     |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Korisnik       | F-02, F-03, F-04, <br> F-06, F-11 | 1. Korisnik odabire plovilo i razdoblje najma. <br> 2. Sustav ponovno provjerava dostupnost plovila. <br> 3. Korisnik odabire dodatne usluge. <br> 4. Sustav izračunava ukupnu cijenu najma i dodatnih usluga. <br> 5. Korisnik pregledava podatke i šalje zahtjev za rezervaciju. <br> 6. Djelatnik odobri rezervaciju te korisniku se <br> šalje potvrda putem e-pošte. | Plovilo je u međuvremenu rezervirano, sustav ne dopušta stvaranje <br> preklapajuće rezervacije i traži novi termin. |

### UC-03: Pregled i otkazivanje rezervacije.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                                                   | Alternativni tok                                                       |
| -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Korisnik       | F-04, F-05, F-19  | 1. Korisnik otvara stranicu za pregled rezervacije. <br> 2. Sustav prikazuje korisnikove rezervacije i njihove statuse. <br> 3. Korisnik odabire rezervaciju koju želi pregledati. <br> 4. Sustav prikazuje detalje rezervacije i ukupni iznos. <br> 5. Korisnik odabire i potvrđuje opciju otkazivanja rezervacije. <br> 6. Sustav mijenja status rezervacije u otkazanu i oslobađa termin. | Rezervacija se ne može otkazati, sustav prikazuje odgovarajuću poruku. |

### UC-04: Upravljanje plovilima i njihovim karakteristikama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                  | Alternativni tok                                                                          |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Vlasnik  | F-07              | 1. Administrator otvara admin panel. <br> 2. Administrator odabire opciju za dodavanje, izmjenu ili brisanje plovila. <br> 3. Administrator popunjava ili mijenja karakteristike, fotografije, opremu, cijene i dodatne usluge vezane za plovilo. <br> 4. Administrator sprema promjene. <br> 5. Sustav sprema podatke i prikazuje ažurirani popis plovila. | Uneseni podaci nisu ispravni, sustav prikazuje poruku o grešci i traži ispravak podataka. |

### UC-05: Upravljanje rezervacijama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                           | Alternativni tok                                                                                                         |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Vlasnik  | F-04, F-08        | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled svih rezervacija. <br> 3. Administrator odabire rezervaciju i pregledava njezine podatke i status. <br> 4. Administrator dodaje novu rezervaciju ili mijenja ili otkazuje postojeću rezervaciju. <br> 5. Sustav sprema promjene i ažurira prikaz rezervacija. | Rezervacija se preklapa s postojećom rezervacijom, sustav ne dopušta spremanje promjene i prikazuje odgovarajuću poruku. |

### UC-06: Pregled preuzimanja i povrata plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                      | Alternativni tok                                                              |
| -------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Djelatnik      | F-12              | 1. Djelatnik otvara admin panel. <br> 2. Djelatnik otvara raspored preuzimanja i povrata plovila. <br> 3. Sustav prikazuje rezervacije prema terminima preuzimanja i povrata. <br> 4. Djelatnik odabire rezervaciju i pregledava podatke o plovilu i korisniku. | Nema rezervacija za odabrano razdoblje, sustav prikazuje odgovarajuću poruku. |

### UC-07: Pregled statistike i izvoz izvještaja.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                                            | Alternativni tok                                                           |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Vlasnik       | F-13, F-14        | 1. Voditelj otvara admin panel. <br> 2. Voditelj otvara pregled statistike i izvještaja. <br> 3. Voditelj odabire razdoblje za koje želi pregledati podatke. <br> 4. Sustav prikazuje statistiku zauzetosti plovila, broj rezervacija, ostvareni prihod i popularnost usluga. <br> 5. Voditelj odabire opciju izvoza izvještaja. <br> 6. Sustav izvozi izvještaj u odabranom formatu. | Nema podataka za odabrano razdoblje, sustav prikazuje odgovarajuću poruku. |

### UC-08: Upravljanje djelatnicima tvrtke

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                | Alternativni tok                                                                                                                             |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Vlasnik  | F-10              | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled svih djelatnika. <br> 3. Administrator dodaje novog djelatnika. <br> 4. Sustav sprema promjene. | Ako uneseni podaci o djelatniku nisu ispravni ili nedostaju obavezni podaci, sustav prikazuje odgovarajuću poruku i traži ispravak podataka. |

### UC-09: Servis plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Vlasnik  | F-04, F-08, F-09  | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled plovila. <br> 3. Administrator odabire plovilo i otvara detalje plovila. <br> 4. Administrator bira i termin tijekom kojeg neće biti raspoloživo. <br> 5. Sustav sprema promjene i ažurira raspoloživost rezervacija. | Odabrani termin servisa preklapa se s postojećom rezervacijom, sustav prikazuje upozorenje i traži od administratora odabir drugog termina. |

### UC-10: Registracija i prijava.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Korisnik  | F-17, F-18  | 1. Korisnik odabire prijavu. <br> 2. Preusmjerava se na OAuth pružatelja. <br> 3. Potvrđuje pristup. <br> 4. Sustav stvara račun (ako ne postoji) s ulogom korisnika i prijavljuje ga | Prijava kod pružatelja ne uspije, sustav prikazuje poruku. |

### UC-11: Pregled detalja plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Korisnik  | F-15, F-16, F-20  | 1. Korisnik otvara plovilo. <br> 2. Sustav prikazuje karakteristike, fotografije, cijenu, slobodne termine, kartu matične luke i vremensku prognozu za odabrani termin. | Meteorološki ili kartografski servis nije dostupan, sustav prikazuje obavijest i ostale podatke (NF-06).. |

### UC-12: Obrada zahtjeva za rezervaciju.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Djelatnik  | F-03, F-04, F-06, F-11  | 1. Djelatnik otvara popis zahtjeva. <br> 2. Pregledava zahtjev. <br> 3. Potvrđuje ga ili odbija. <br> 4. Sustav mijenja status i šalje e-poštu korisniku. | Plovilo je u međuvremenu zauzeto, sustav ne dopušta potvrdu. |

### UC-13: Evidentiranje preuzimanja i povrata.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Djelatnik  | F-22  | 1. Djelatnik odabire rezervaciju iz rasporeda. <br> 2. Pregledava zahtjev. <br> 3. Evidentira preuzimanje, a pri povratu označava najam završenim. | |

### UC-14: Upravljanje charter tvrtkama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Administrator  | F-25, F-26  | 1. Administrator otvara popis tvrtki. <br> 2. Dodaje novu tvrtku i unosi njezine podatke. <br> 3. Dodjeljuje vlasnika (postojećeg korisnika ili novi račun). <br> 4. Sustav sprema tvrtku i vlasniku omogućuje pristup | Tvrtka s istim OIB-om već postoji, sustav prikazuje poruku.|

### UC-15: Deaktivacija tvrtke.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Administrator  | F-25  | 1. Administrator odabire tvrtku i deaktivira je <br> 2. Sustav uklanja njezina plovila iz pretraživanja i zadržava postojeće podatke. | Tvrtka ima aktivne potvrđene rezervacije, sustav prikazuje upozorenje i traži potvrdu.|


## Akteri

| ID  | Uloga         | Obuhvaćeni funkcijski zahtjevi                 |
| --- | ------------- | -----------------------------------------------|
| A-1 | Posjetitelj   | F-23                                           |
| A-2 | Korisnik      | F-01, F-02, F-05, F-15, F-16, F-17, F-20, F-21, F-29 |
| A-3 | Djelatnik     | F-11, F-12, F-22                               |
| A-4 | Vlasnik       | F-07, F-08, F-09, F-13, F-14, F-27, F-28       |
| A-5 | Administrator | F-25, F-26, F-30, F-31                         |
| A-6 | VANJSKI SERVISI?      | |