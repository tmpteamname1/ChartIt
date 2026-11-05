**# OLD**

## Ključni obrasci uporabe

### UC-01: Pretraživanje raspoloživih plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                 | Alternativni tok                                                                                    |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Korisnik       | F-01              | 1. Korisnik otvara stranicu za pretraživanje plovila. <br> 2. Unosi željene specifikacije za termin i plovilo. <br> 3. Sustav provjerava kriterije i raspoloživost plovila. <br> 4. Sustav prikazuje plovila koja odgovaraju kriterijima, <br> njihove karakteristike i cijene. <br> 5. Korisnik odabire plovilo i otvara njegove detalje. | Nema raspoloživih plovila sustav prikazuje <br> odgovarajuću poruku i omogućuje promjenu kriterija. |

### UC-02: Izrada rezervacije.

| Primarni akter | Povezani zahtjevi                 | Glavni tok                                                                                                                                                                                                                                                                                                                                                                | Alternativni tok                                                                                                     |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Korisnik       | F-02, F-03, F-04, <br> F-06, F-11 | 1. Korisnik odabire plovilo i razdoblje najma. <br> 2. Sustav ponovno provjerava dostupnost plovila. <br> 3. Korisnik odabire dodatne usluge. <br> 4. Sustav izračunava ukupnu cijenu najma i dodatnih usluga. <br> 5. Korisnik pregledava podatke i šalje zahtjev za rezervaciju. <br> 6. Djelatnik odobri rezervaciju te korisniku se <br> šalje potvrda putem e-pošte. | Plovilo je u međuvremenu rezervirano, sustav ne dopušta stvaranje <br> preklapajuće rezervacije i traži novi termin. |

### UC-03: Pregled i otkazivanje rezervacije.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                                                   | Alternativni tok                                                       |
| -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Korisnik       | F-04, F-05, F-19  | 1. Korisnik otvara stranicu za pregled rezervacije. <br> 2. Sustav prikazuje korisnikove rezervacije i njihove statuse. <br> 3. Korisnik odabire rezervaciju koju želi pregledati. <br> 4. Sustav prikazuje detalje rezervacije i ukupni iznos. <br> 5. Korisnik odabire i potvrđuje opciju otkazivanja rezervacije. <br> 6. Sustav mijenja status rezervacije u otkazanu i oslobađa termin. | Rezervacija se ne može otkazati, sustav prikazuje odgovarajuću poruku. |

### UC-04: Upravljanje plovilima i njihovim karakteristikama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                  | Alternativni tok                                                                          |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Vlasnik        | F-07              | 1. Administrator otvara admin panel. <br> 2. Administrator odabire opciju za dodavanje, izmjenu ili brisanje plovila. <br> 3. Administrator popunjava ili mijenja karakteristike, fotografije, opremu, cijene i dodatne usluge vezane za plovilo. <br> 4. Administrator sprema promjene. <br> 5. Sustav sprema podatke i prikazuje ažurirani popis plovila. | Uneseni podaci nisu ispravni, sustav prikazuje poruku o grešci i traži ispravak podataka. |

### UC-05: Upravljanje rezervacijama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                              | Alternativni tok                                                                                                         |
| -------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Vlasnik        | F-04, F-08        | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled svih rezervacija. <br> 3. Administrator odabire rezervaciju i pregledava njezine podatke i status. <br> 4. Administrator dodaje novu rezervaciju ili mijenja ili otkazuje postojeću rezervaciju. <br> 5. Sustav sprema promjene i ažurira prikaz rezervacija. | Rezervacija se preklapa s postojećom rezervacijom, sustav ne dopušta spremanje promjene i prikazuje odgovarajuću poruku. |

### UC-06: Pregled preuzimanja i povrata plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                      | Alternativni tok                                                              |
| -------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Djelatnik      | F-12              | 1. Djelatnik otvara admin panel. <br> 2. Djelatnik otvara raspored preuzimanja i povrata plovila. <br> 3. Sustav prikazuje rezervacije prema terminima preuzimanja i povrata. <br> 4. Djelatnik odabire rezervaciju i pregledava podatke o plovilu i korisniku. | Nema rezervacija za odabrano razdoblje, sustav prikazuje odgovarajuću poruku. |

### UC-07: Pregled statistike i izvoz izvještaja.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                                                                                                            | Alternativni tok                                                           |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Vlasnik        | F-13, F-14        | 1. Voditelj otvara admin panel. <br> 2. Voditelj otvara pregled statistike i izvještaja. <br> 3. Voditelj odabire razdoblje za koje želi pregledati podatke. <br> 4. Sustav prikazuje statistiku zauzetosti plovila, broj rezervacija, ostvareni prihod i popularnost usluga. <br> 5. Voditelj odabire opciju izvoza izvještaja. <br> 6. Sustav izvozi izvještaj u odabranom formatu. | Nema podataka za odabrano razdoblje, sustav prikazuje odgovarajuću poruku. |

### UC-08: Upravljanje djelatnicima tvrtke

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                | Alternativni tok                                                                                                                             |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Vlasnik        | F-10              | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled svih djelatnika. <br> 3. Administrator dodaje novog djelatnika. <br> 4. Sustav sprema promjene. | Ako uneseni podaci o djelatniku nisu ispravni ili nedostaju obavezni podaci, sustav prikazuje odgovarajuću poruku i traži ispravak podataka. |

### UC-09: Servis plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                                                                                                      | Alternativni tok                                                                                                                            |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Vlasnik        | F-04, F-08, F-09  | 1. Administrator otvara admin panel. <br> 2. Administrator otvara pregled plovila. <br> 3. Administrator odabire plovilo i otvara detalje plovila. <br> 4. Administrator bira i termin tijekom kojeg neće biti raspoloživo. <br> 5. Sustav sprema promjene i ažurira raspoloživost rezervacija. | Odabrani termin servisa preklapa se s postojećom rezervacijom, sustav prikazuje upozorenje i traži od administratora odabir drugog termina. |

### UC-10: Registracija i prijava.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                            | Alternativni tok                                           |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Korisnik       | F-17, F-18        | 1. Korisnik odabire prijavu. <br> 2. Preusmjerava se na OAuth pružatelja. <br> 3. Potvrđuje pristup. <br> 4. Sustav stvara račun (ako ne postoji) s ulogom korisnika i prijavljuje ga | Prijava kod pružatelja ne uspije, sustav prikazuje poruku. |

### UC-11: Pregled detalja plovila.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                              | Alternativni tok                                                                                          |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Korisnik       | F-15, F-16, F-20  | 1. Korisnik otvara plovilo. <br> 2. Sustav prikazuje karakteristike, fotografije, cijenu, slobodne termine, kartu matične luke i vremensku prognozu za odabrani termin. | Meteorološki ili kartografski servis nije dostupan, sustav prikazuje obavijest i ostale podatke (NF-06).. |

### UC-12: Obrada zahtjeva za rezervaciju.

| Primarni akter | Povezani zahtjevi      | Glavni tok                                                                                                                                                | Alternativni tok                                             |
| -------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Djelatnik      | F-03, F-04, F-06, F-11 | 1. Djelatnik otvara popis zahtjeva. <br> 2. Pregledava zahtjev. <br> 3. Potvrđuje ga ili odbija. <br> 4. Sustav mijenja status i šalje e-poštu korisniku. | Plovilo je u međuvremenu zauzeto, sustav ne dopušta potvrdu. |

### UC-13: Evidentiranje preuzimanja i povrata.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                         | Alternativni tok |
| -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Djelatnik      | F-22              | 1. Djelatnik odabire rezervaciju iz rasporeda. <br> 2. Pregledava zahtjev. <br> 3. Evidentira preuzimanje, a pri povratu označava najam završenim. |                  |

### UC-14: Upravljanje charter tvrtkama.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                                                                                                             | Alternativni tok                                            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Administrator  | F-25, F-26        | 1. Administrator otvara popis tvrtki. <br> 2. Dodaje novu tvrtku i unosi njezine podatke. <br> 3. Dodjeljuje vlasnika (postojećeg korisnika ili novi račun). <br> 4. Sustav sprema tvrtku i vlasniku omogućuje pristup | Tvrtka s istim OIB-om već postoji, sustav prikazuje poruku. |

### UC-15: Deaktivacija tvrtke.

| Primarni akter | Povezani zahtjevi | Glavni tok                                                                                                                            | Alternativni tok                                                                       |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Administrator  | F-25              | 1. Administrator odabire tvrtku i deaktivira je <br> 2. Sustav uklanja njezina plovila iz pretraživanja i zadržava postojeće podatke. | Tvrtka ima aktivne potvrđene rezervacije, sustav prikazuje upozorenje i traži potvrdu. |
