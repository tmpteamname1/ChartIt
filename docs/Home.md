# ChartIt — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.  
**Tim:** G09.4 ChartIt  
**Nastavnik:** Vlado Sruk  
**Asistent:** Miljenko Krhen  
**Demonstrator:** Ivo Gabud

## Pregled projekta

ChartIt je aplikacija u razvoju namijenjena korisnicima koji žele unajmiti plovilo te djelatnicima i vlasnicima charter tvrtki koji upravljaju flotom i najmom. Planirane funkcionalnosti uključuju pretraživanje i pregled dostupnih plovila, podnošenje zahtjeva za rezervaciju termina i odabir dodatnih usluga za korisnike te upravljanje plovilima, cijenama i rezervacijama, praćenje preuzimanja i povrata plovila te pregled poslovnih rezultata za ovlaštene djelatnike i vlasnike tvrtki, u skladu s njihovim ulogama. Cilj aplikacije je pojednostavniti postupak najma i svakodnevno poslovanje charter tvrtke uz jasan pregled raspoloživosti plovila i poslovnih rezultata.

**Aplikacija i osnovno postavljanje:** [README repozitorija](../README.md#quick-start)  
**Javno dostupna aplikacija:** pogledajte [README – Postavljanje](../README.md#deployment)

## Članovi tima i uloge

Ažurirani popis članova, njihovih GitHub profila i glavnih uloga ili doprinosa nalazi se u [README-u repozitoriju](../README.md#team-members).

## Kazalo dokumentacije

| Stranica | Svrha |
| --- | --- |
| [1. Opseg projekta](1-Projekt.md) | Problem, cilj i granice projekta |
| [2. Analiza zahtjeva](2-Analiza-zahtjeva.md) | Zahtjevi, ograničenja i sljedivost |
| [3. Obrasci uporabe](3-Obrasci-uporabe.md) | Akteri i reprezentativne interakcije korisnika |
| [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md) | Glavne odluke oblikovanja, struktura, podaci i ponašanje |
| [Zajednička stanja sučelja (#58)](dizajn/58-Zajednicka-stanja-sucelja.md) | Nacrti i pravila učitavanja, praznih stanja, grešaka, obavijesti i potvrda |
| [Mobilni wireframei (#57)](4-Arhitektura-i-oblikovanje.md#mobilni-prikaz-57) | Skice na širini od 375 px i pravila prilagodbe sučelja |
| [5. Ispitivanje](5-Ispitivanje.md) | Pristup ispitivanju, stvarni rezultati i poznati nedostaci |
| [6. Postavljanje, instalacija i konfiguracija](6-Postavljanje-instalacija-i-konfiguracija.md) | Lokalna instalacija, konfiguracija, javno postavljanje i administracija |
| [7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md) | Zaključak i moguća daljnja poboljšanja |
| [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md) | Aktivnosti tima, doprinosi i izazovi |

## Ključne točke projekta

| Kontrolna točka | Demonstracija | Video |
| --- | --- | --- |
| Iteracija 1 | [Poveznica na demonstraciju ili inačicu projekta] | [Poveznica na video Demo 1, ako je snimljen] |
| Završni pregled | [Poveznica na završnu inačicu projekta] | [Poveznica na video završne demonstracije, ako je snimljen] |


## Organizacija projekta i razvojni proces

**Način rada:** Tim je podijeljen na frontend i backend tim, svaki s po tri člana. Uz njih, projekt ima jednog voditelja koji surađuje s oba tima, koordinira njihov rad i prati napredak. Jednom tjedno održavamo videosastanak na kojem pregledavamo obavljene zadatke, dogovaramo prioritete i rješavamo poteškoće. Promjene koda provjeravaju se prije spajanja u glavnu granu repozitorija, a funkcionalnosti se testiraju tijekom razvoja.

**Praćenje trenutačnih zadataka i nedostataka:** Zadaci i uočene pogreške prate se putem GitHub Issuesa, uz opis zadatka, odgovornu osobu i status rješavanja: [GitHub Issues](https://github.com/orgs/tmpteamname1/projects/3)

## Pravila dokumentacije

Dokumentacija se ažurira tijekom razvoja kako bi odgovarala stvarnom stanju aplikacije. Svaki tim dokumentira svoj dio sustava, dok voditelj koordinira izmjene i provjerava usklađenost dokumentacije. U dokumentaciji se navode tehnologije i alati korišteni u projektu te opisuju implementirane funkcionalnosti i struktura sustava.

Obavezni UML dijagrami izrađuju se u PlantUML-u. Uz svaki dijagram u dokumentaciji čuvaju se PlantUML izvor (`.puml`) i čitljiva slika dijagrama, a oboje se ažurira kada se prikazani dio sustava promijeni.

## Akademski integritet, ponašanje i licenciranje

README repozitorija sadrži projektnu [izjavu o uporabi umjetne inteligencije](../README.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README.md#license). Pristupni podaci i druge tajne nikada se ne objavljuju u dokumentaciji niti dijele u običnim porukama.

## Izjava o uporabi umjetne inteligencije

Kratak sažetak: [README – Uporaba umjetne inteligencije](../README.md#ai-usage). Ovaj odjeljak bilježi koji su alati korišteni, za koju dokumentaciju ili kod te kako je tim provjerio rezultat. Slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

Nikolić je koristio OpenAI Codex za izradu i doradu mobilnih skica u SVG-u i Excalidrawu te pravila prilagodbe. Model nije zabilježen. Sadržaj je uspoređen s issueom #57, analizom zahtjeva, obrascima uporabe, arhitekturom, React navigacijom i povezanim skicama. Provjereni su prikaz u Chromeu, uvoz u Excalidraw, podudarnost oba formata i poveznice. [Mobilni prikaz (#57)](4-Arhitektura-i-oblikovanje.md#mobilni-prikaz-57)

### Korišteni alati

| Alat | Inačica ili model | Koristio/la | Glavna svrha |
| --- | --- | --- | --- |
| [Naziv alata] | [Inačica ili model, ako je poznat] | [Član/članovi tima] | [npr. izrada nacrta dokumentacije, generiranje izvora dijagrama] |
| OpenAI Codex | Model nije zabilježen | Luka | Priprema tekstualnih skica i kratkih pravila zajedničkih stanja sučelja za #58 |

### Opseg doprinosa umjetne inteligencije

| Stranica, datoteka ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| [npr. 3. Obrasci uporabe, UC-002] | [Izrada nacrta / preoblikovanje / prijevod / izvor dijagrama / sažimanje] | [Kratak opis] | [Ulaz zadan alatu; dodane, ispravljene ili uklonjene činjenice] | [Stranica dokumentacije, `.puml` datoteka, PR] |
| Zajednička stanja sučelja (#58), poveznice iz kazala i poglavlja 4.8 | Izrada skica i pravila prikaza | Jedna Markdown datoteka s tekstualnim skicama, kratkim pravilima i referencama na ekrane | Korisnik je zadao issue #58 i zatražio tekstualne skice u Markdownu; sadržaj je uspoređen s projektnom dokumentacijom. Timski pregled slijedi u PR-u. | [Skice i pravila](dizajn/58-Zajednicka-stanja-sucelja.md) |

Stranice i artefakti koji nisu navedeni iznad izrađeni su bez pomoći generativne umjetne inteligencije.

### Provjera generiranog sadržaja

| Provjera | Kako je provedena | Dokaz |
| --- | --- | --- |
| Činjenična točnost | [Svaka tvrdnja o funkcionalnostima, ponašanju ili arhitekturi uspoređena je s pokrenutom aplikacijom i kodom] | [Imena pregledavatelja; poveznice na zahtjev za uključivanje promjena (PR) ili zadatak] |
| Nema tvrdnji o neostvarenim funkcionalnostima | [Provjereno je da opisane funkcionalnosti, ispitivanja i rezultati stvarno postoje; planirani rad označen je kao planiran] | [Usporedba s odjeljkom 5.4 (Ispitivanje) i odjeljkom 7.1 (Zaključak)] |
| Dosljednost s drugim stranicama | [Nazivi, ID-ovi i dijagrami provjereni su prema Analizi zahtjeva, Obrascima uporabe, Arhitekturi i oblikovanju te Ispitivanju] | [Kontrolni popis ili bilješka pregleda] |
| Izvori dijagrama | [Generirani PlantUML je iscrtan, ispravljen i odgovara implementiranom sustavu] | [`.puml` datoteka i izrađena slika] |
| Povjerljivi sadržaj | [Kako je tim osigurao da u upite ili dokumentaciju nisu unesene tajne, pristupni podaci ni osobni podaci] | [Primijenjeni postupak] |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| [Netočna, izmišljena ili iz predloška preuzeta tvrdnja] | [Pregled, ispitivanje ili usporedba s aplikacijom] | [Ispravak s poveznicom] |
