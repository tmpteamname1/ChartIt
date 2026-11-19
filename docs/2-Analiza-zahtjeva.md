# 2. Analiza zahtjeva

## 2.1 Funkcijski zahtjevi

Izvor „Odobreni zadatak” označava zahtjev iz projektnog zadatka. Izvor „Odluka tima” označava proširenje na platformu za više charter tvrtki (odjeljak 2.5): zadatak opisuje jednu tvrtku, a tim je aplikaciju oblikovao kao zajedničku platformu na kojoj korisnik pretražuje ponudu svih tvrtki.

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
| --- | --- | --- | --- | --- |
| F-01 | Sustav omogućuje korisniku, uključujući neprijavljenog posjetitelja, pretraživanje i filtriranje plovila svih tvrtki prema terminu, lokaciji polaska, vrsti plovila, broju osoba i tvrtki. | Visok | Odobreni zadatak; filtar po tvrtki: odluka tima | Posjetitelj bez prijave dobiva popis aktivnih plovila svih tvrtki; svaki odabrani filtar sužava rezultate, a plovila zauzeta u odabranom terminu nisu prikazana. |
| F-02 | Sustav omogućuje korisniku, uključujući neprijavljenog posjetitelja, pregled detalja plovila (karakteristike, oprema, fotografije, cijena), slobodnih termina i osnovnih podataka o tvrtki kojoj plovilo pripada. | Visok | Odobreni zadatak; podaci o tvrtki: odluka tima | Odabirom plovila prikazuju se njegove karakteristike, oprema, fotografije, dnevna cijena, zauzeti termini i naziv i kontakt tvrtke; neaktivno plovilo nije dostupno. |
| F-03 | Sustav omogućuje korisniku stvaranje zahtjeva za rezervaciju plovila za određeno razdoblje, uz odabir dodatnih usluga i izračun ukupne cijene. | Visok | Odobreni zadatak | Prijavljeni korisnik šalje zahtjev za slobodan termin s odabranim uslugama; rezervacija nastaje u statusu „zahtjev”, a ukupni iznos izračunava poslužitelj. |
| F-04 | Sustav sprječava preklapajuće rezervacije. Termin je zauzet od trenutka stvaranja zahtjeva za rezervaciju, a oslobađa se u slučaju odbijanja ili otkazivanja. Sustav sprječava stvaranje preklapajućih rezervacija istog plovila i rezervacija kada je plovilo nedostupno. | Visok | Odobreni zadatak | Zahtjev koji se preklapa s postojećim zahtjevom, potvrđenom rezervacijom ili razdobljem nedostupnosti odbija se s porukom korisniku; od dva istodobna zahtjeva za isti termin uspijeva samo jedan; nakon odbijanja ili otkazivanja termin je ponovno slobodan. |
| F-05 | Sustav bilježi status rezervacije. Statusi su: zahtjev, potvrđena, odbijena, otkazana, završeni najam. Zahtjev vlasnik ili djelatnik potvrđuje ili odbija, zahtjev ili potvrđenu rezervaciju može otkazati korisnik, vlasnik ili djelatnik, a potvrđena rezervacija postaje završeni najam nakon evidentiranog povrata plovila. | Visok | Odobreni zadatak | Dopušteni su samo prijelazi iz dijagrama stanja (4.4.2); nedopušten prijelaz (npr. potvrda otkazane rezervacije) sustav odbija. |
| F-06 | Sustav omogućuje korisniku pregled podataka o rezervaciji i pripadajućeg ukupnog iznosa. | Visok | Odobreni zadatak | Korisnik vidi popis svojih rezervacija i za svaku plovilo, termin, odabrane usluge, status i ukupni iznos; tuđe rezervacije nisu dostupne. |
| F-07 | Sustav korisniku dostavlja e-poštom potvrdu rezervacije te obavijest o odbijanju ili otkazivanju rezervacije. Potvrda sadrži ime tvrtke i kontakt za tu tvrtku. | Visok | Odobreni zadatak | Nakon potvrde, odbijanja ili otkazivanja korisnik prima poruku na adresu svojeg računa; potvrda sadrži naziv i kontakt tvrtke. |
| F-08 | Sustav omogućuje vlasniku dodavanje, izmjenu i uklanjanje plovila svoje tvrtke. Za svako plovilo evidentiraju se naziv, tip plovila, kategorija, proizvođač i model, godina proizvodnje, kapacitet, broj kabina i ležajeva, oprema, matična luka i fotografije. | Visok | Odobreni zadatak | Vlasnik vidi plovila svoje tvrtke, uključujući neaktivna, može dodati, izmijeniti i deaktivirati plovilo; neispravan unos vraća poruku uz polje obrasca; plovila drugih tvrtki nisu dostupna. |
| F-09 | Sustav omogućuje vlasniku definiranje cijene najma plovila i dodatnih usluga (npr. skiper, završno čišćenje, dodatna oprema) za plovila svoje tvrtke. | Visok | Odobreni zadatak | Vlasnik postavlja dnevnu cijenu plovila i cijene usluga svoje tvrtke; nova cijena vrijedi za nove zahtjeve, a postojeće rezervacije zadržavaju iznos iz trenutka podnošenja (ADR-04). |
| F-10 | Sustav omogućuje vlasniku evidentiranje razdoblja u kojima pojedino plovilo svoje tvrtke nije raspoloživo radi servisa, održavanja ili drugih razloga. | Visok | Odobreni zadatak | Uneseno razdoblje nedostupnosti uklanja plovilo iz rezultata pretrage za taj termin i onemogućuje zahtjeve za rezervaciju. |
| F-11 | Sustav omogućuje vlasniku i djelatnicima pregled i filtriranje rezervacija svoje tvrtke te potvrđivanje ili odbijanje zahtjeva za rezervaciju te stvaranje i otkazivanje rezervacije. | Visok | Odobreni zadatak | Vlasnik i djelatnik vide i filtriraju samo rezervacije svoje tvrtke te potvrđuju, odbijaju i otkazuju rezervacije prema F-05. |
| F-12 | Sustav omogućuje korisniku otkazivanje vlastite rezervacije. | Visok | Odobreni zadatak | Korisnik otkazuje svoj zahtjev ili potvrđenu rezervaciju; status postaje „otkazana”, a termin se oslobađa. |
| F-13 | Sustav omogućuje djelatniku pregled rasporeda preuzimanja i povrata plovila te osnovnih podataka o plovilu. | Visok | Odobreni zadatak | Djelatnik za odabrani dan vidi preuzimanja i povrate plovila svoje tvrtke s plovilom, korisnikom i terminom. |
| F-14 | Sustav omogućuje djelatniku evidentiranje preuzimanja i povrata plovila te označavanje najma završenim. | Srednji | Odobreni zadatak | Djelatnik evidentira preuzimanje i povrat potvrđene rezervacije; nakon povrata rezervacija prelazi u status „završeni najam”. |
| F-15 | Sustav omogućuje vlasniku pregled osnovnih statističkih podataka o svojoj tvrtki (zauzetost, rezervacije, prihod, popularnost usluga i najpopularnije kategorije plovila) te izvoz odabranih izvještaja u standardnom formatu (CSV). | Srednji | Odobreni zadatak | Vlasnik za odabrano razdoblje vidi pokazatelje svoje tvrtke i preuzima CSV datoteku koja se ispravno otvara u alatu za tablične proračune. |
| F-16 | Sustav korisniku prikazuje vremensku prognozu (temperatura, vjetar i vremenski uvjeti) za mjesto i termin najma. Za termine izvan raspona koji pruža meteorološki servis sustav prikazuje obavijest da prognoza još nije dostupna. | Srednji | Odobreni zadatak | Uz detalje plovila prikazuje se prognoza za matičnu luku i odabrani termin; za termin izvan dosega servisa ili pri nedostupnosti servisa prikazuje se obavijest, a ostatak stranice radi. |
| F-17 | Sustav ostvaruje integraciju s kartografskim servisom te prikazuje položaj matične luke i lokaciju preuzimanja plovila. | Srednji | Odobreni zadatak | Na detaljima plovila prikazuje se karta s oznakom matične luke; pri nedostupnosti karte prikazuje se obavijest. |
| F-18 | Sustav omogućuje prijavu i registraciju korisnicima putem vanjskog OAuth pružatelja. Korisnik se povezuje s postojećim računom na temelju adrese e-pošte. | Visok | Odobreni zadatak | Prva prijava Google računom stvara korisnika s ulogom „korisnik”; sljedeća prijava s istom potvrđenom adresom koristi isti račun; odustajanje ili neuspjela prijava vraća korisnika na stranicu prijave s porukom. |
| F-19 | Sustav omogućuje administratoru stvaranje, izmjenu i deaktivaciju charter tvrtki (naziv, OIB, adresa, kontakt podaci) te dodjelu vlasnika tvrtke. | Visok | Odluka tima | Administrator stvara tvrtku s valjanim OIB-om, mijenja njezine podatke, deaktivira je i dodjeljuje joj vlasnika; plovila deaktivirane tvrtke ne prikazuju se u pretrazi. |
| F-20 | Sustav omogućuje vlasniku izmjenu podataka o svojoj tvrtki. | Srednji | Odluka tima | Vlasnik mijenja kontakt i adresu svoje tvrtke; podaci druge tvrtke nisu dostupni. |
| F-21 | Sustav omogućuje vlasniku stvaranje, izmjenu i deaktivaciju djelatnika svoje tvrtke. | Visok | Odluka tima | Vlasnik dodaje djelatnika u svoju tvrtku i deaktivira ga; deaktivirani djelatnik više ne može pristupiti panelu tvrtke. |
| F-22 | Sustav omogućuje administratoru upravljanje korisničkim računima i dodjelu uloga (korisnik, djelatnik, vlasnik, administrator) uz odgovarajuće ovlasti. | Srednji | Odluka tima | Administrator pregledava račune, mijenja ulogu i deaktivira račun; promjena uloge vrijedi od sljedećeg zahtjeva korisnika. |
| F-23 | Sustav omogućuje administratoru upravljanje zajedničkim popisima kategorija plovila i luka. | Srednji | Odluka tima | Administrator dodaje i mijenja kategorije i luke; kategorija ili luka koju koristi neko plovilo ne može se obrisati. |

## 2.2 Nefunkcijski zahtjevi

| ID | Opis | Prioritet | Izvor | Način provjere |
| --- | --- | --- | --- | --- |
| NF-01 | Sustav treba podržavati istovremeni rad više korisnika bez gubitka konzistentnosti podataka. | Visok | Odobreni zadatak | Provesti testiranje istovremenog pristupa više korisnika i provjeriti ispravnost rada sustava i podataka. |
| NF-02 | Sustav treba ograničiti funkcionalnosti ovisno o vrsti korisnika, a vlasnici i djelatnici smiju pristupati isključivo podacima svoje tvrtke. | Visok | Odobreni zadatak; izolacija tvrtki: odluka tima | Testirati pristup funkcionalnostima za svaku korisničku ulogu te pokušati kao djelatnik ili vlasnik tvrtke A dohvatiti ili izmijeniti podatke tvrtke B izravnim pozivom API-ja (npr. promjenom ID-a u URL-u) i provjeriti da sustav odbija zahtjev. |
| NF-03 | Korisničko sučelje mora biti responzivno i prilagođavati se računalima, tabletima i mobilnim uređajima. | Visok | Odobreni zadatak | Testirati prikaz i funkcionalnost sučelja na računalima, tabletima i mobilnim uređajima različitih veličina zaslona. |
| NF-04 | Komunikacija između klijenta i poslužitelja mora se odvijati preko HTTPS-a, a veza s bazom podataka i osjetljivi podaci moraju biti zaštićeni. | Visok | Odluka tima (sigurnost) | Provjeriti da je aplikacija dostupna isključivo preko HTTPS-a i da se HTTP zahtjevi preusmjeravaju te provjeriti zaštitu pristupa bazi podataka i način pohrane osjetljivih podataka. |
| NF-05 | Vrijeme odziva aplikacije za uobičajene zahtjeve (pretraživanje plovila, pregled rezervacije) mora biti manje od 2 sekunde. | Visok | Odluka tima | Izmjeriti vrijeme odziva za uobičajene zahtjeve pri istovremenom radu više korisnika i provjeriti da je manje od 2 sekunde za većinu zahtjeva. |
| NF-06 | Ako meteorološki ili kartografski servis nije dostupan, sustav mora obavijestiti korisnika i nastaviti raditi. | Srednji | Odluka tima | Simulirati nedostupnost vanjskih servisa i provjeriti prikazuje li sustav odgovarajuću obavijest te nastavlja li prikazivati ostale dostupne podatke. |
| NF-07 | Aplikacija mora biti javno dostupna putem interneta. | Visok | Pravila kolegija | Pristupiti aplikaciji s vanjske mreže i provjeriti rad osnovnih funkcionalnosti. |

## 2.3 Dionici i akteri

| ID | Uloga | Odnos prema sustavu | Obuhvaćeni funkcijski zahtjevi |
| --- | --- | --- | --- |
| A-1 | Posjetitelj | Akter; koristi javni dio bez prijave. | F-01, F-02, F-16, F-17, F-18 |
| A-2 | Korisnik | Akter; prijavljen Google računom, rezervira plovila. | F-01, F-02, F-03, F-05, F-06, F-07, F-12, F-16, F-17, F-18 |
| A-3 | Djelatnik | Akter; zaposlenik jedne tvrtke, obrađuje rezervacije te preuzimanja i povrate. | F-05, F-11, F-13, F-14, F-18 |
| A-4 | Vlasnik | Akter; vlasnik jedne tvrtke, ima sve ovlasti djelatnika uz upravljanje ponudom, djelatnicima i podacima tvrtke. | F-05, F-08, F-09, F-10, F-11, F-13, F-14, F-15, F-18, F-20, F-21 |
| A-5 | Administrator | Akter; upravlja platformom, ne pripada nijednoj tvrtki. | F-18, F-19, F-22, F-23 |
| D-1 | Google (OAuth pružatelj) | Vanjski sustav; potvrđuje identitet korisnika pri prijavi. | F-18 |
| D-2 | Meteorološki i kartografski servis | Vanjski sustavi; pružaju prognozu i kartu. | F-16, F-17, NF-06 |
| D-3 | Servis za slanje e-pošte | Vanjski sustav; dostavlja obavijesti o rezervacijama. | F-07 |

## 2.4 Ograničenja i pretpostavke

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
| --- | --- | --- | --- | --- |
| C-01 | Ograničenje | Sustav mora komunicirati s meteorološkim servisom i prikazivati prognozu za mjesto i termin najma. | Zadatak | Pristup vanjskom servisu izdvojiti u zaseban modul (adapter) kako bi se servis mogao zamijeniti. Provjeriti ponašanje pri nedostupnosti servisa (NF-06). |
| C-02 | Ograničenje | Sustav mora biti integriran s kartografskim servisom radi prikaza matične luke i lokacije preuzimanja plovila. | Zadatak | Luke i lokacije preuzimanja pohraniti s koordinatama. Provjeriti prikaz na karti i ponašanje pri nedostupnosti servisa (NF-06). |
| C-03 | Ograničenje | Sustav ne smije dopustiti istodobnu rezervaciju istog plovila za termine koji se preklapaju i mora voditi jednoznačnu evidenciju zauzetosti. | Zadatak | Provjeru preklapanja provoditi na razini baze podataka (transakcija ili ograničenje), a ne samo u aplikaciji. Test: dva istovremena zahtjeva za isti termin, uspije samo jedan. |
| C-04 | Ograničenje | Podatke i izvještaje mora biti moguće izvesti u najmanje jednom standardnom formatu pogodnom za daljnju obradu ili arhiviranje. | Zadatak | Odabran je CSV. Provjeriti da se izvezena datoteka ispravno otvara u uobičajenim alatima za tablične proračune. |
| C-05 | Ograničenje | Potvrda rezervacije mora se korisniku dostaviti elektroničkom poštom. | Zadatak | Zahtijeva uslugu za slanje e-pošte i valjanu adresu korisnika. Provjeriti slanje potvrde nakon potvrđivanja rezervacije i obavijesti o odbijanju ili otkazivanju. |
| C-06 | Ograničenje | Aplikacija mora podržavati različite vrste korisnika s odgovarajućim ovlastima i istodobni rad više korisnika. | Zadatak | Kontrolu pristupa projektirati po ulozi i tvrtki na poslužitelju (NF-01, NF-02). Provjeriti pristup za svaku ulogu i pokušaj pristupa podacima druge tvrtke. |
| C-07 | Ograničenje | Korisničko sučelje mora biti responzivno i prilagođeno računalima, tabletima i mobilnim uređajima. | Zadatak | Sučelje graditi prema načelu prilagodljivog rasporeda. Provjeriti ključne tokove (pretraživanje, rezervacija) na sva tri tipa uređaja (NF-03). |
| AS-01 | Pretpostavka | Pojam „voditelj charter tvrtke“ iz zadatka odgovara ulozi vlasnika, a funkcije koje zadatak pripisuje administratoru (plovila, cijene, usluge, rezervacije, nedostupnost) obavlja vlasnik za svoju tvrtku. | Procjena tima | Potvrđeno s asistentom. Ovlasti u F-08 do F-11 i F-15 pripadaju vlasniku. |
| AS-02 | Pretpostavka | Rezervacija u statusu „zahtjev“ već blokira termin plovila, a oslobađa se tek odbijanjem ili otkazivanjem. | Procjena tima | Potvrditi poslovno pravilo prije izrade modela stanja rezervacije (F-04, F-05). Ako se promijeni, mijenja se logika provjere preklapanja. |
| AS-03 | Pretpostavka | Plovilo pripada točno jednoj charter tvrtki, a djelatnik i vlasnik povezani su s jednom tvrtkom. | Procjena tima | Uzeti u obzir u modelu podataka. Ako jedna osoba može raditi za više tvrtki, potrebno je proširiti vezu korisnik–tvrtka (NF-02). |
| AS-04 | Pretpostavka | Cijena najma definira se po jedinici vremena (npr. po danu), bez sezonskih cijena i popusta, a dodatne usluge imaju fiksnu cijenu. | Zadatak ne definira model cijena | Potvrditi pri izradi izračuna cijene (F-03, F-09). Ako se traže sezonske cijene, proširiti model cijena. |
| AS-05 | Pretpostavka | Plaćanje se ne provodi putem sustava. Sustav samo izračunava i prikazuje ukupni iznos rezervacije. | Zadatak ne spominje plaćanje | Plaćanje nije u opsegu. Ako se kasnije zatraži, utječe na statuse rezervacije i sigurnosne zahtjeve. |
| AS-06 | Pretpostavka | Meteorološki servis pruža prognozu samo za ograničen broj dana unaprijed, pa za udaljenije termine prognoza nije dostupna. | Procjena tima | Provjeriti doseg prognoze odabranog servisa. Za termine izvan dosega prikazati obavijest (F-16). |
| AS-07 | Pretpostavka | Matične luke i lokacije preuzimanja imaju poznate koordinate. | Pretpostavka o podacima | Pregledati ogledne podatke o lukama. |
| AS-08 | Pretpostavka | Vanjski OAuth pružatelj uz prijavu vraća valjanu adresu e-pošte korisnika, koja se koristi za povezivanje računa i slanje obavijesti. | Pretpostavka o okolini | Provjeriti podatke koje pružatelj vraća pri prijavi (F-18). Planirati slučaj bez adrese e-pošte. |
| AS-09 | Pretpostavka | Sustav radi s jednom valutom (EUR) i jednom vremenskom zonom (Hrvatska). | Procjena tima | Datume i iznose pohranjivati dosljedno. Ako se pojavi potreba za više valuta ili zona, potrebno je proširiti model podataka. |

## 2.5 Značajne promjene zahtjeva

| Datum | ID zahtjeva | Promjena i razlog | Dogovoreno s / dokaz |
| --- | --- | --- | --- |
| 28. 10. 2026. | F-01, F-02, F-19 – F-23, NF-02 | Aplikacija je proširena s jedne charter tvrtke na platformu za više tvrtki u zajedničkoj bazi: korisnik pretražuje ponudu svih tvrtki, administrator upravlja tvrtkama i zajedničkim popisima, a vlasnik djelatnicima i podacima svoje tvrtke. Razlog: korisnik na jednom mjestu uspoređuje ponudu više tvrtki, a tvrtke dijele istu aplikaciju uz strogo odvajanje podataka (ADR-02). | Odluka tima na sastanku; commit `79ba284` („21: potrebne promjene za logiku s više charter tvrtki”) |
| 5. 11. 2026. | Svi funkcijski i nefunkcijski zahtjevi | Popis zahtjeva preuređen je: duplikati su spojeni, a zahtjevi s preklapajućim opisom uklonjeni, pa je broj funkcijskih zahtjeva smanjen s F-01 – F-31 na F-01 – F-23, a nefunkcijskih s NF-01 – NF-10 na NF-01 – NF-07. Oznake u ostalim poglavljima usklađene su prema novoj numeraciji. | Savjet asistenta; commit `59805a2`, usklađivanje oznaka u zadatku [#104](https://github.com/tmpteamname1/ChartIt/issues/104) |
| 5. 11. 2026. | F-05, F-11 | Obradu rezervacija (potvrda, odbijanje, otkazivanje, stvaranje) više ne obavlja samo vlasnik, nego i djelatnik tvrtke. Razlog: vlasnik tvrtke u praksi ne želi sam obrađivati svaki zahtjev za rezervaciju. | Savjet asistenta; commit `59805a2` |

## 2.6 Sljedivost zahtjeva

Komponente su opisane u poglavlju 4.2, a testovi se nalaze u datotekama `tests.py` pojedinih Django aplikacija (`backend/<aplikacija>/tests.py`). Oznaka *na čekanju* znači da zahtjev još nije ostvaren ([7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md)).

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
| --- | --- | --- | --- |
| F-01 | UC-01 | Javni dio; REST API; Upravljanje flotom (`fleet`) | `fleet`: `VesselListApiTests`, `PublicApiTests`; filtar po terminu *na čekanju* (ovisi o rezervacijama) |
| F-02 | UC-11 | Javni dio; Upravljanje flotom; Upravljanje tvrtkama (`fleet`, `companies`) | `fleet`: `VesselDetailApiTests`; `companies`: `PublicCompanyApiTests`; ekran detalja *na čekanju* |
| F-03 | UC-02 | Korisnički dio; Usluga rezervacija (`reservations`) | *na čekanju* |
| F-04 | UC-02, UC-03, UC-05 | Usluga rezervacija; ograničenje isključivanja u bazi (ADR-03) | `reservations`: `DatabaseExtensionTests` (proširenje `btree_gist`); test istodobnih zahtjeva *na čekanju* |
| F-05 | UC-03, UC-05, UC-12, UC-13 | Usluga rezervacija | *na čekanju* |
| F-06 | UC-03 | Korisnički dio; Usluga rezervacija | *na čekanju* |
| F-07 | UC-03, UC-05, UC-12 | Usluga obavijesti | *na čekanju* |
| F-08 | UC-04 | Panel tvrtke; Upravljanje flotom (`fleet`) | `fleet`: `VesselTests`, `PhotoTests` i testovi popisa i stvaranja plovila tvrtke (#101, #102) |
| F-09 | UC-04 | Panel tvrtke; Upravljanje flotom | Dnevna cijena plovila: `fleet`: `VesselTests`; dodatne usluge *na čekanju* |
| F-10 | UC-09 | Panel tvrtke; Upravljanje flotom | *na čekanju* |
| F-11 | UC-05, UC-12 | Panel tvrtke; Usluga rezervacija | *na čekanju* |
| F-12 | UC-03 | Korisnički dio; Usluga rezervacija | *na čekanju* |
| F-13 | UC-06 | Panel tvrtke; Usluga rezervacija | *na čekanju* |
| F-14 | UC-13 | Panel tvrtke; Usluga rezervacija | *na čekanju* |
| F-15 | UC-07 | Panel tvrtke; Statistika i izvještaj | *na čekanju* |
| F-16 | UC-11 | Usluga vremenske prognoze (ADR-05) | *na čekanju* |
| F-17 | UC-11 | Web klijent (kartografske pločice iz preglednika) | *na čekanju* |
| F-18 | UC-10 | Autentifikacija i korisnici (`accounts`, django-allauth, ADR-06) | `accounts`: `SocialLoginTests`, `MeEndpointTests`, `LocalSignupClosedTests`; ručna provjera prijave na javnoj instanci |
| F-19 | UC-14, UC-15 | Upravljanje tvrtkama (`companies`); zasad kroz Django admin | `companies`: `CompanyModelTests`, `CompanyOibTests`, `CompanyUserRelationTests`, `CompanyAdminTests`; ekran administracije *na čekanju* |
| F-20 | Upravljanje tvrtkama | Panel tvrtke; Upravljanje tvrtkama | *na čekanju* |
| F-21 | UC-08 | Panel tvrtke; Upravljanje tvrtkama | *na čekanju* |
| F-22 | Kontrola pristupa | Kontrola pristupa; Autentifikacija i korisnici (`accounts`); uloga administratora naredbom `promote_admin` (poglavlje 6) | `accounts`: `UserModelTests`, `RolePermissionTests`, `PromoteAdminTests`; ekran administracije *na čekanju* |
| F-23 | Upravljanje šifrarnicima | Upravljanje flotom (`fleet`); zasad kroz Django admin | `fleet`: `CategoryTests`, `PortTests`; ekran administracije *na čekanju* |
| NF-01 | — | Transakcije i ograničenja u PostgreSQL-u (ADR-03) | *na čekanju* (ispitivanje istodobnih zahtjeva uz rezervacije) |
| NF-02 | — | Kontrola pristupa: klase dopuštenja (`accounts/permissions.py`) i filtriranje upita prema tvrtki prijavljenog korisnika (ADR-02) | `accounts`: `RolePermissionTests`; testovi izolacije plovila tvrtke s dvije tvrtke (#101) |
| NF-03 | — | Web klijent (Mantine, pravila prilagodbe u 4.8) | Ručna provjera na širinama 320 px, 375 px i računalu |
| NF-04 | — | HTTPS, sigurni kolačići i HSTS u produkciji; šifrirana veza s bazom (`DATABASE_SSLMODE`); tajne u varijablama okruženja (poglavlje 6) | `config`: `CsrfTests`, `HealthCheckTests`; ručna provjera preusmjeravanja na javnoj instanci |
| NF-05 | — | Straničenje popisa (4.9), indeksi u bazi | *na čekanju* (mjerenje odziva) |
| NF-06 | — | Usluga vremenske prognoze; zajednička stanja sučelja (`docs/dizajn/58-Zajednicka-stanja-sucelja.md`) | *na čekanju* |
| NF-07 | — | Postavljanje na Render (poglavlje 6) | Health check `/api/health/` pri svakom postavljanju; ručna provjera javne adrese |

## 2.7 Pregled zahtjeva

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
| --- | --- | --- |
| Konzultacije s asistentom (prije Iteracije 1) | Zahtjeva je previše i neki se ponavljaju. | Zahtjevi su preuređeni u F-01 – F-23 i NF-01 – NF-07; vidi odjeljak 2.5. |
| Konzultacije s asistentom (prije Iteracije 1) | Vlasnik tvrtke u praksi ne želi sam obrađivati rezervacije. | Obradu rezervacija preuzima i djelatnik (F-05, F-11); vidi odjeljak 2.5. |
| Konzultacije s asistentom, 5. 11. 2026. | Postavljanje na Azure nije uspijevalo, a aplikacija mora biti javno dostupna (NF-07). | Zahtjev NF-07 ostaje nepromijenjen; aplikacija je postavljena na Render ([poglavlje 6](6-Postavljanje-instalacija-i-konfiguracija.md#63-javno-postavljanje-i-administracija)). |
| Iteracija 1 | Slijedi | Slijedi |
| Demo 2 | Slijedi | Slijedi |
| Završni pregled | Slijedi | Slijedi |
