# Funkcijski, nefunkcijski zahtjevi i ključni obrasci uporabe

Chartit - PROGI tim 9.4

## Funkcijski zahtjevi

| ID   | Opis                                                                                                                                                                     | Prioritet |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| F-01 | Sustav omogućuje korisniku pretraživanje i pregled raspoloživih plovila prema osnovnim kriterijima pretraživanja.                                                        | Visok     |
| F-02 | Sustav omogućuje korisniku stvaranje zahtjeva za rezervaciju plovila za određeno razdoblje, uz odabir dodatnih usluga i izračun ukupne cijene.                           | Visok     |
| F-03 | Sustav mora spriječiti potvrđivanje preklapajućuh rezervacija istog plovila.                                                                                             | Visok     |
| F-04 | Sustav bilježi status rezervacije.                                                                                                                                       | Visok     |
| F-05 | Sustav omogućuje korisniku pregled podataka o rezervaciji i pripadajućeg ukupnog iznosa.                                                                                 | Visok     |
| F-06 | Sustav dostavlja potvrdu rezervacije korisnku putem e-pošte.                                                                                                             | Visok     |
| F-07 | Sustav omogućuje administratoru dodavanje i izmjene plovila, njihove osnovne informacije, fotografija, kategorija plovila, opreme, definiranje cijene i dodatnih usluga. | Visok     |
| F-08 | Sustav omogućuje administatoru upravljanje rezervacijama.                                                                                                                | Visok     |
| F-09 | Sustav omogućuje administatoru evidentiranja razdoblja u kojima pojedino plovilo nije raspoloživo radi servisa, održavanja ili drugih razloga.                           | Visok     |
| F-10 | Sustav omogućuje administatoru stvaranje i izmjenu djelatnika.                                                                                                           | Srednji   |
| F-11 | Sustav omogućuje djelatnicima potvrđivanje iil odbijanje zahtjeva za rezervaciju.                                                                                        | Visok     |
| F-12 | Sustav omogućuje djelatnicima pregled rasporeda preuzimanja i povrata plovila te pregled osnovnih podatka o plovilu.                                                     | Visok     |
| F-13 | Sustav omogućuje voditelju tvrtke prelged osnovnih statističkih podataka zauzetosti, rezervacija, prihoda i popularnosti usluga.                                         | Srednji   |
| F-14 | Sustav omogućuje voditelju izvoz odabranih izvještaja u standardnom formatu.                                                                                             | Srednji   |
| F-15 | Sustav omogućuje korisniku pregled infromacija o vremenskim uvjetima za mjesto i termin najma.                                                                           | Srednji   |
| F-16 | Sustav ostvaruje integraciju s kartografskim servisom te prikazuje položaj matične luke i lokaciju preuzimanja plovila.                                                  | Srednji   |
| F-17 | Sustav omogućuje prijavu i registraciju korisnicima.                                                                                                                     | Visok     |
| F-18 | Sustav podržava različite vrste korisnika s odgovarajućim ovlasitma.                                                                                                     | Visok     |
| F-19 | Sustav oslobađa termin plovila u slučaju otkazivanja.                                                                                                                    | Srednji   |

## Nefunkcijski zahtjevi

| ID    | Opis                                                                                                                       | Prioritet | Način provjere                                                                                                                                             |
| ----- | -------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NF-01 | Sustav treba podržavati rad više korisnika u stvarnom vremenu.                                                             | Visok     | Provesti testiranje istovremenog pristupa više korisnika i <br> provjeriti ispravnost rada sustava i podataka.                                             |
| NF-02 | Sustav treba ograničiti funkcionalnosti aplikacije ovisno o vrsti korisnika.                                               | Visok     | Testirati pristup funkcionalnostima za svaku korisničku ulogu i <br> provjeriti da neovlašteni korisnici ne mogu pristupiti zabranjenim funkcijama.        |
| NF-03 | Stranica mora biti dinamička i prilagođavati se različitim veličinama ekrana.                                              | Visok     | Testirati prikaz i funkcionalnost sučelja na računalima, tabletima <br> i mobilnim uređajima različitih veličina zaslona.                                  |
| NF-04 | Veza sustava i baze podataka mora biti zaštićena.                                                                          | Visok     | Provjeriti konfiguraciju sigurne komunikacije, zaštitu pristupa <br> bazi podataka i način pohrane osjetljivih podataka.                                   |
| NF-05 | Aplikacija mora djelovati responzivno s indikatorima učitavanj i optimiranim dohvatom podataka                             | Visok     | Mjeriti vrijeme odziva pri uobičajenom opterećenju te provjeriti <br> prikazuju li se indikatori učitavanja tijekom dohvaćanja podataka.                   |
| NF-06 | Ako meteorološki ili kartografski servis nije dostupan, sustav mora obavijestiti korisnika.                                | Srednji   | Simulirati nedostupnost vanjskih servisa i provjeriti prikazuje li <br> sustav odgovarajuću obavijest te nastavlja li prikazivati ostale dostupne podatke. |
| NF-07 | Podaci o rezervacijama i plovilima moraju biti pohranjeni tako da se mogu naknadno dohvatiti i koristiti za izvještavanje. | Visok     | Unijeti i pohraniti podatke, zatim ih dohvatiti i provjeriti jesu <br> li dostupni za prikaz i izradu izvještaja.                                          |

## Kljucni obrasci uporabe

### UC-01: Pretraživanje raspoloživih plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                 | Alternativni tok                                                                                    |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Korisnik       | F-01              | 1. Korisnik otvara stranicu za pretraživanje plovila. <br> 2. Unosi željene spesifikacije za termin i plovilo. <br> 3. Sustav provjerava kriterije i raspoloživost plovila. <br> 4. Sustav prikazuje plovila koja odgovaraju kriterijima, <br> njihove karakteristike i cijene. <br> 5. Korisnik odabire plovilo i otvara njegove detalje. | Nema raspoloživih plovila sustav prikazuje <br> odgovarajuću poruku i omogućuje promjenu kriterija. |

### UC-02: Izrada rezervacije.

| Primarni akter | Povezani zahtjevi                 | Glavni tok                                                                                                                                                                                                                                                                                                                                                               | Alternativni tok                                                                                                     |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Korisnik       | F-02, F-03, F-04, <br> F-06, F-11 | 1. Korisnik odabire plovilo i razdoblje najma. <br> 2. Sustav ponovno provjerava dostupnost plovila. <br> 3. Korisnik odabire dodatne usluge. <br> 4. Sustav izračunava ukupnu cijenu najma i dodatnih usluga. <br> 5. Korisnik pregledava podatke i šalje zahtjev za rezervaciju. <br> 6. Djelatnik odobri rezervaciju te korisnku se <br> šalje potvrda putem e-pošte. | Plovilo je u međuvremenu rezervirano, sustav ne dopušta stvaranje <br> preklapajuće rezervacije i traži novi termin. |

### UC-03: Pregled i otkazivanje rezervacije.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                                                   | Alternativni tok                                                       |
| -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Korisnik       | F-04, F-05, F-19  | 1. Korisnik otvara stranicu za pregled rezervacije. <br> 2. Sustav prikazuje korisnikove rezervacije i njihove statuse. <br> 3. Korisnik odabire rezervaciju koju želi pregledati. <br> 4. Sustav prikazuje detalje rezervacije i ukupni iznos. <br> 5. Korisnik odabire i potvrđuje opciju otkazivanja rezervacije. <br> 6. Sustav mijenja status rezervacije u otkazanu i oslobađa termin. | Rezervacija se ne može otkazati, sustav prikazuje odgovarajuću poruku. |

### UC-04: Upravljanje plovilima i njihovim karakteristikama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                  | Alternativni tok                                                                          |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Administrator  | F-07              | 1. Administrator otvara admin panel. <br> 2. Administrator odabire opciju za dodavanje, izmjenu ili brisanje plovila. <br> 3. Administrator popunjava ili mijenja karakteristike, fotografije, opremu, cijene i dodatne usluge vezane za plovilo. <br> 4. Administrator sprema promjene. <br> 5. Sustav sprema podatke i prikazuje ažurirani popis plovila. | Uneseni podaci nisu ispravni, sustav prikazuje poruku o grešci i traži ispravak podataka. |

### UC-05: Upravljanje rezervacijama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                           | Alternativni tok                                                                                                         |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Administrator  | F-04, F-08        | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled svih rezervacija. <br> 3. Administrator odabire rezervaciju i pregledava njezine podatke i status. <br> 4. Administrator dodaje novu rezervaciju ili mijenja ili briše postojeću rezervaciju. <br> 5. Sustav sprema promjene i ažurira prikaz rezervacija. | Rezervacija se preklapa s postojećom rezervacijom, sustav ne dopušta spremanje promjene i prikazuje odgovarajuću poruku. |

### UC-06: Pregled preuzimanja i povrata plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                      | Alternativni tok                                                              |
| -------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Djelatnik      | F-12              | 1. Djelatnik otvara admin panel. <br> 2. Djelatnik otvara raspored preuzimanja i povrata plovila. <br> 3. Sustav prikazuje rezervacije prema terminima preuzimanja i povrata. <br> 4. Djelatnik odabire rezervaciju i pregledava podatke o plovilu i korisniku. | Nema rezervacija za odabrano razdoblje, sustav prikazuje odgovarajuću poruku. |

### UC-07: Pregled statistike i izvoz izvještaja.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                                            | Alternativni tok                                                           |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Voditelj       | F-13, F-14        | 1. Voditelj otvara admin panel. <br> 2. Voditelj otvara pregled statistike i izvještaja. <br> 3. Voditelj odabire razdoblje za koje želi pregledati podatke. <br> 4. Sustav prikazuje statistiku zauzetosti plovila, broj rezervacija, ostvareni prihod i popularnost usluga. <br> 5. Voditelj odabire opciju izvoza izvještaja. <br> 6. Sustav izvozi izvještaj u odabranom formatu. | Nema podataka za odabrano razdoblje, sustav prikazuje odgovarajuću poruku. |

### UC-08: Pregled i uređivanje djelatnika.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                | Alternativni tok                                                                                                                             |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Administrator  | F-10              | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled svih djelatnika. <br> 3. Administrator dodaje novog djelatnika. <br> 4. Sustav sprema promjene. | Ako uneseni podaci o djelatniku nisu ispravni ili nedostaju obavezni podaci, sustav prikazuje odgovarajuću poruku i traži ispravak podataka. |

### UC-09: Servis plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                     | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Administrator  | F-04, F-08, F-09  | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled plovila. <br> 3. Administrator odabire plovilo i otvara detalje plovila. <br> 4. Administrator bira i termin tjekom kojeg neće biti raspoloživo. <br> 5. Sustav sprema promjene i ažurira raspoloživost rezervacija. | Odabrani termin servisa preklapa se s postojećom rezervacijom, sustav prikazuje upozorenje i traži od administratora odabir drugog termina. |

## Akteri

| ID  | Uloga         | Obuhvaćeni funkcijski zahtjevi     |
| --- | ------------- | ---------------------------------- |
| A-1 | Korisnik      | F-01, F-02, F-05, F-15, F-16, F-17 |
| A-2 | Djelatnik     | F-11, F-12                         |
| A-3 | Administrator | F-07, F-08, F-09, F-10             |
| A-4 | Voditelj      | F-13, F-14                         |
