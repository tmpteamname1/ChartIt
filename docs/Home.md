# ChartIt — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.  
**Tim:** G09.4 ChartIt  
**Nastavnik:** Vlado Sruk  
**Asistent:** Miljenko Krhen  
**Demonstrator:** Ivo Gabud

## Pregled projekta

ChartIt je web-aplikacija za najam plovila namijenjena korisnicima koji žele unajmiti plovilo te djelatnicima i vlasnicima charter tvrtki koji upravljaju flotom i najmom. Više tvrtki dijeli istu aplikaciju i bazu podataka, a svaka vidi samo svoje podatke. Cilj aplikacije je pojednostavniti postupak najma i svakodnevno poslovanje charter tvrtke uz jasan pregled raspoloživosti plovila i poslovnih rezultata.

Trenutačno su ostvareni pretraga plovila bez prijave, prijava Google računom te pregled flote i dodavanje plovila u panelu tvrtke. Zahtjevi za rezervaciju, obrada rezervacija, raspored preuzimanja i povrata, statistika, administracija u aplikaciji, vremenska prognoza i karta planirani su za iduće iteracije ([7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md)).

> Opis funkcionalnosti odnosi se na inačicu planiranu za prvu predaju nakon dovršetka zadataka Iteracije 1. Rezultati ispitivanja odnose se na datume i revizije navedene u [poglavlju 5](5-Ispitivanje.md#53-provedena-ispitivanja-i-rezultati).

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
| [Mobilni wireframei (#57)](4-Arhitektura-i-oblikovanje.md#mobilni-prikaz-57) | Skice na 375 px, odabir termina na 320 px i pravila prilagodbe sučelja |
| [5. Ispitivanje](5-Ispitivanje.md) | Pristup ispitivanju, stvarni rezultati i poznati nedostaci |
| [6. Postavljanje, instalacija i konfiguracija](6-Postavljanje-instalacija-i-konfiguracija.md) | Lokalna instalacija, konfiguracija, javno postavljanje i administracija |
| [7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md) | Zaključak i moguća daljnja poboljšanja |
| [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md) | Aktivnosti tima, doprinosi i izazovi |
| [Dizajn sučelja](dizajn/) | Skice ekrana i pravila za zajednička stanja sučelja |

## Ključne točke projekta

| Kontrolna točka | Demonstracija | Video |
| --- | --- | --- |
| Iteracija 1 | [Javna aplikacija](https://chartit-okv1.onrender.com) | [Snimka zaslona](assets/video/iteracija-1-demo.mp4) (20. 11. 2026., bez zvuka) |
| Završni pregled | Slijedi | Slijedi |

Snimka Iteracije 1 prikazuje sučelje aplikacije i prijavu Googleom na javnoj instalaciji. Prijava i uloge rade sa stvarnim backendom, a dio ekrana (pretraga plovila i flota) u trenutku snimanja još koristi privremene (mock) podatke na frontendu, pa prikazani podaci nisu stvarni.

Dokumentacija se kontinuirano ažurira kako se aplikacija razvija.

## Organizacija projekta i razvojni proces

**Način rada:** Tim je podijeljen na frontend i backend tim, svaki s po tri člana. Uz njih, projekt ima jednog voditelja koji surađuje s oba tima, koordinira njihov rad i prati napredak. Tim održava dva sastanka tjedno: jedan u sklopu laboratorijskih vježbi i jedan opsežniji u terminu koji članovi dogovaraju sami. Na sastancima pregledavamo obavljene zadatke, dogovaramo prioritete i rješavamo poteškoće ([evidencija sastanaka](A-Pregled-aktivnosti-grupe.md#a1-evidencija-sastanaka)).

Svaka promjena vezana je uz zadatak i radi se na zasebnoj grani. U glavnu granu (`main`) ulazi samo kroz pull request. Od 4. 11. 2026. pravilo grane `main` („Approved before merge”) traži odobrenje drugog člana tima, a od 8. 11. 2026. i prolazak automatskih provjera (lint, formatiranje, build klijenta, provjera migracija i backend testovi, [poglavlje 6](6-Postavljanje-instalacija-i-konfiguracija.md#kontinuirana-integracija-ci)). Voditelj projekta može zaobići pravilo. Do 19. 11. 2026. spojeno je 54 pull requestova: 7 prije uvođenja pravila (npr. #62), a od 47 spojenih nakon toga voditelj je 19 spojio zaobilaženjem pravila, bez odobrenja drugog člana tima na GitHubu (među njima #138 – #142 s dokumentacijom za predaju). Veće cjeline dijele se u epike s nekoliko manjih zadataka; frontend ekrani se izrađuju nad lažnim podacima istog oblika kao odgovor API-ja, pa frontend i backend tim mogu raditi usporedno.

**Praćenje trenutačnih zadataka i nedostataka:** Zadaci i uočene pogreške prate se kao [GitHub Issues](https://github.com/tmpteamname1/ChartIt/issues), uz opis zadatka, odgovornu osobu i status rješavanja, a pregled napretka vodi se na ploči [GitHub Projects](https://github.com/orgs/tmpteamname1/projects/3).

## Pravila dokumentacije

Dokumentacija se ažurira tijekom razvoja kako bi odgovarala stvarnom stanju aplikacije. Svaki tim dokumentira svoj dio sustava, dok voditelj koordinira izmjene i provjerava usklađenost dokumentacije. U dokumentaciji se navode tehnologije i alati korišteni u projektu te opisuju implementirane funkcionalnosti i struktura sustava.

Obavezni UML dijagrami izrađuju se u PlantUML-u. Uz svaki dijagram u dokumentaciji čuvaju se PlantUML izvor (`.puml`) i čitljiva slika dijagrama, a oboje se ažurira kada se prikazani dio sustava promijeni.

## Akademski integritet, ponašanje i licenciranje

README repozitorija sadrži projektnu [izjavu o uporabi umjetne inteligencije](../README.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README.md#license). Pristupni podaci i druge tajne nikada se ne objavljuju u dokumentaciji niti dijele u običnim porukama.

## Izjava o uporabi umjetne inteligencije

Kratak sažetak: [README – Uporaba umjetne inteligencije](../README.md#ai-usage). Ovaj odjeljak bilježi koji su alati korišteni, za koju dokumentaciju ili kod te kako je tim provjerio rezultat. Slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

### Korišteni alati

| Alat | Inačica ili model | Koristio/la | Glavna svrha |
| --- | --- | --- | --- |
| OpenAI Codex | GPT-6.1 Sol | Nikolić | Izrada i dorada skica sučelja (#54, #55, #57) i zajedničkih stanja sučelja (#58); izrada i provjera klijentskog koda (#91, #113, #115) |
| OpenAI Codex | GPT-6.1 Sol | Rušev | Pomoć pri vlastitim zadacima: skice javnog dijela i administracije (PR #88, #98) i ekran flote tvrtke (PR #122) |
| Claude Code | Claude Opus | Matić | Izrada i provjera koda kostura aplikacije, sigurnosnih postavki, prijave i CI-ja; izrada nacrta dokumentacije (poglavlja 2, 4 i 6, README) i opisa zadataka |
| Claude | Claude Sonnet 5.5 | Lepur | Pisanje i otklanjanje grešaka u kodu (Google prijava, naredba `promote_admin`); pomoć pri pisanju dokumentacije (ADR-06, opis postavljanja Google OAuth-a) |
| Claude | Claude Sonnet 5.5 | Crnković | Pomoć pri pisanju koda i otklanjanju grešaka |
| OpenAI Codex | GPT-6.1 Sol | Bartulović | Otklanjanje grešaka i pomoć pri pisanju koda (ekran javne pretrage) |

### Opseg doprinosa umjetne inteligencije

| Stranica, datoteka ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| Skice panela tvrtke (#55) i poveznice u poglavlju 4.8 | Izrada i usklađivanje skica | SVG i uređivi Excalidraw | Nikolić je zadao opseg, tražio da skice slijede lokalni ChartIt i predložak #54 te zatražio usporedbu s #53. Alat je usporedio skice s dokumentacijom i provjerio prikaze u oba formata. | [SVG](dizajn/55-Wireframe-panela-tvrtke.svg), [Excalidraw](dizajn/55-Wireframe-panela-tvrtke.excalidraw) |
| Zajednička stanja sučelja (#58), poveznice iz kazala i poglavlja 4.8 | Izrada skica i pravila prikaza | Jedna Markdown datoteka s tekstualnim skicama, kratkim pravilima i referencama na ekrane | Nikolić je zadao issue #58 i zatražio tekstualne skice u Markdownu; sadržaj je uspoređen s projektnom dokumentacijom. Pregled je dovršen i pull request odobren ([PR #82](https://github.com/tmpteamname1/ChartIt/pull/82#pullrequestreview-5818705741)). | [Skice i pravila](dizajn/58-Zajednicka-stanja-sucelja.md) |
| Skice rezervacija i prijave (#54) i poveznice u poglavlju 4.8 | Izrada i dorada skica | Šest skica u SVG-u i uređivom formatu Excalidraw te poveznice iz mape stranica | Nikolić je zadao opseg #54, odabrao jednostavan stil prema priloženim primjerima i usmjerio dorade rasporeda i odabira usluga. Provjereni su prikaz svih šest skica, podudarnost SVG-a i Excalidrawa te poveznice u dokumentaciji. | [SVG](dizajn/54-Wireframe-korisnickog-dijela.svg), [Excalidraw](dizajn/54-Wireframe-korisnickog-dijela.excalidraw), [mapa stranica](4-Arhitektura-i-oblikovanje.md#48-mapa-stranica-i-ruta-klijentske-aplikacije) |
| Mobilne skice i pravila prilagodbe (#57) | Izrada i dorada skica i pravila prikaza | 25 skica u Excalidrawu sa SVG izvozom te pravila prilagodbe u poglavlju 4.8 | Nikolić je zadao opseg #57 i zatražio doradu prema pregledu PR-a #99. Skice su uspoređene sa zahtjevima, modelom rezervacije i povezanim skicama. | [SVG](dizajn/57-Wireframe-mobilnog-prikaza.svg), [Excalidraw](dizajn/57-Wireframe-mobilnog-prikaza.excalidraw), [pravila prilagodbe](4-Arhitektura-i-oblikovanje.md#mobilni-prikaz-57) |
| Pristup djelatnika rezervacijama tvrtke (#91) | Izmjena i provjera klijentskog koda | Usklađeni su React ruta i stavka izbornika za djelatnika i vlasnika. | Nikolić je zadao opseg #91 i zatražio ponovnu provjeru. Alat je provjerio uloge u Chromeu te pokrenuo lint i build. | [Router](../frontend/src/router.tsx), [izbornik](../frontend/src/layouts/navigation.ts) |
| API modul flote tvrtke (#113) | Izrada i provjera klijentskog koda | TypeScript tipovi, popis plovila sa straničenjem i stvaranje plovila uz validaciju po poljima na lažnim podacima. | Nikolić je zadao #113, odobrio prvi push i dostavio recenziju. Lokalno su provjereni lint, build, format, straničenje, prekid dohvata, greške po poljima i dodavanje plovila. | [API modul](../frontend/src/api/company.ts), [lažni podaci i validacija](../frontend/src/api/mocks/company.ts) |
| Obrazac novog plovila (#115) | Izrada i provjera klijentskog koda | Obrazac, klijentska validacija, prikaz grešaka API-ja i potvrda dodavanja plovila. | Nikolić je zadao #115, uputio na PR #121 i dostavio recenziju. U pregledniku su provjereni validacija, vidljivost opće greške na mobitelu, zaštita od dvostrukog slanja i dohvat novog plovila. | [Obrazac](../frontend/src/pages/company/VesselFormPage.tsx), [potvrda](../frontend/src/pages/company/FleetRoute.tsx) |
| Prijava, odjava i zaštićene rute (#47) | Izrada i provjera klijentskog i poslužiteljskog koda te dokumentacije | Stanje prijave iz `/api/auth/me/`, gumb za prijavu putem Googlea, povratak na zaštićenu stranicu, obrada odgovora 401, uklanjanje privremenog prekidača uloga i endpointa `test-logout`, odlomak u poglavlju 4.8. | Matić je zadao #47, odobrio plan i odlučio da se `test-logout` ukloni u istom PR-u. Alat je provjerio CSRF zahtjeve tijeka prijave na lokalnom poslužitelju te pokrenuo testove, lint i build. | [Stanje prijave](../frontend/src/auth/AuthProvider.tsx), [API modul](../frontend/src/api/auth.ts), [prijava](../frontend/src/pages/public/LoginPage.tsx) |
| Obrada neuspješne prijave (#48) | Izrada i provjera klijentskog i poslužiteljskog koda | Povratak na stranicu prijave s porukom o grešci nakon prekinute ili neuspješne Google prijave. | Matić je zadao #48 i odobrio plan. Tijek je provjeren lokalno uz Google prijavu, a pokrenuti su testovi, lint i build. | [PR #129](https://github.com/tmpteamname1/ChartIt/pull/129) |
| Kostur aplikacije (#32, #61) | Izrada koda i konfiguracije | Django projekt s aplikacijama, Docker Compose s PostgreSQL-om, React aplikacija s rutama i izgledom stranica prema mapi stranica. | Matić je zadao strukturu i tehnologije (ADR-01) i odobrio plan; rute su uspoređene s poglavljem 4.8. | [PR #62](https://github.com/tmpteamname1/ChartIt/pull/62), [PR #63](https://github.com/tmpteamname1/ChartIt/pull/63) |
| Konvencije REST API-ja i pohrana medija (#14), varijable okruženja i tajne (#17) | Izrada koda i dokumentacije | Zajednički format greške i straničenja, Swagger dokumentacija, posluživanje fotografija, čitanje postavki iz okruženja, poglavlje 4.9 i dijelovi poglavlja 6. | Matić je zadao pravila i odabrao rješenja između predloženih alternativa; pravila su provjerena testovima. | [PR #77](https://github.com/tmpteamname1/ChartIt/pull/77), [PR #78](https://github.com/tmpteamname1/ChartIt/pull/78) |
| Formatiranje, CI i postavljanje na Render (#18, #38) | Izrada konfiguracije i dokumentacije | ruff, Prettier i `.editorconfig`, GitHub Actions workflow, `render.yaml`, health check i opis postavljanja u poglavlju 6. | Matić je odabrao alate i platformu, postavio pravila grane `main` i provjerio postavljanje na javnoj adresi. | [PR #83](https://github.com/tmpteamname1/ChartIt/pull/83), [PR #84](https://github.com/tmpteamname1/ChartIt/pull/84), [PR #81](https://github.com/tmpteamname1/ChartIt/pull/81), [PR #85](https://github.com/tmpteamname1/ChartIt/pull/85) |
| Sigurnosne postavke, dopuštenja i testna prijava (#45, #46, #49) | Izrada i provjera poslužiteljskog koda | Zadane postavke DRF-a i CSRF zaštita, klase dopuštenja prema ulogama, testna prijava za lokalni razvoj uz zastavicu. | Matić je zadao pravila prema poglavlju 4.6; ponašanje je pokriveno testovima s više uloga. | [PR #110](https://github.com/tmpteamname1/ChartIt/pull/110), [PR #111](https://github.com/tmpteamname1/ChartIt/pull/111), [PR #112](https://github.com/tmpteamname1/ChartIt/pull/112) |
| Tipovi i API modul javne pretrage (#94) | Izrada klijentskog koda | TypeScript tipovi i funkcije za pretragu plovila nad lažnim podacima oblika iz zadatka. | Matić je zadao oblik odgovora prema zadatku; tipovi su provjereni buildom. | [PR #109](https://github.com/tmpteamname1/ChartIt/pull/109) |
| Analiza zahtjeva i arhitektura (poglavlja 2 i 4) | Izrada nacrta i preoblikovanje | Nacrti tekstova zahtjeva, ADR-ova, zajedničkih pravila i PlantUML izvora dijagrama. | Matić je zadao sadržaj i odluke, a tekstove i dijagrame uskladio sa zadatkom projekta i timskim dogovorima. | [PR #20](https://github.com/tmpteamname1/ChartIt/pull/20), [PR #22](https://github.com/tmpteamname1/ChartIt/pull/22), [PR #31](https://github.com/tmpteamname1/ChartIt/pull/31) |
| Upute za alat i opisi zadataka (#118) | Izrada nacrta | `CLAUDE.md` s pravilima projekta; nacrti opisa zadataka u GitHub Issues. | Matić je zadao opseg i pregledao svaki zadatak prije objave. | [PR #119](https://github.com/tmpteamname1/ChartIt/pull/119) |
| README i dokumentacija za predaju (#136) | Usporedba s predloškom i izrada nacrta | Usporedba README-a i stranica dokumentacije s predloškom kolegija, nacrt teksta i premještanje uputa za lokalni razvoj u poglavlje 6. | Matić je zadao opseg i odluke (licenca, premještanje sadržaja) te dao podatke koji se ne vide iz repozitorija. | [Zadatak #136](https://github.com/tmpteamname1/ChartIt/issues/136) |

Uz svaku promjenu izrađenu uz pomoć alata autor je prije commita pregledao promjene. Pull request je prije spajanja odobrio drugi član tima, osim pull requestova koje je voditelj spojio zaobilaženjem pravila grane `main` ([Organizacija projekta i razvojni proces](#organizacija-projekta-i-razvojni-proces)).

Tablica opsega navodi pojedinačno samo odabrane artefakte. Članovi navedeni u tablici alata koristili su umjetnu inteligenciju i pri drugim svojim zadacima, u svrhe navedene u stupcu „Glavna svrha”; za te zadatke vrijede iste provjere opisane u nastavku.

### Provjera generiranog sadržaja

| Provjera | Kako je provedena | Dokaz |
| --- | --- | --- |
| Činjenična točnost | Autor promjene uspoređuje generirani kod i tekst s kodom i pokrenutom aplikacijom (lokalno ili na Renderu); pravilo grane `main` traži da drugi član tima odobri pull request prije spajanja, uz iznimke opisane u odjeljku [Organizacija projekta i razvojni proces](#organizacija-projekta-i-razvojni-proces). Kod mora proći CI (lint, build, provjera migracija, backend testovi). | Pull requestovi navedeni u tablici iznad; pravilo grane `main` „Approved before merge” ([poglavlje 6](6-Postavljanje-instalacija-i-konfiguracija.md#kontinuirana-integracija-ci)) |
| Nema tvrdnji o neostvarenim funkcionalnostima | README i pregled projekta odvajaju ostvarene funkcionalnosti od planiranih; opis ekrana i API-ja uspoređen je s rutama i endpointima u kodu. | Zadatak #136; [README – Opis aplikacije](../README.md#opis-aplikacije) |
| Dosljednost s drugim stranicama | Oznake zahtjeva i obrazaca uporabe u poglavljima 3, 4 i 6 usklađene su s poglavljem 2. | Zadatak [#104](https://github.com/tmpteamname1/ChartIt/issues/104) (usklađivanje oznaka zahtjeva) |
| Izvori dijagrama | PlantUML izvori iscrtavaju se u sliku koja se čuva uz izvor; dijagram se ispravlja kada se prikazani dio sustava promijeni. | [`docs/puml/`](puml/) i [`docs/assets/diagrams/`](assets/diagrams/) |
| Povjerljivi sadržaj | Tajne postoje samo u lokalnoj datoteci `.env` (u `.gitignore`) i u postavkama Rendera i ne unose se u upite. Produkcijske tajne ne nalaze se na računalima članova tima. U dokumentaciji se ne navode osobne adrese e-pošte ni osobni podaci korisnika. | [Poglavlje 6 – Varijable okruženja i tajne](6-Postavljanje-instalacija-i-konfiguracija.md#varijable-okruženja-i-tajne) |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| Skice korisničkog dijela (#54): dijalog otkazivanja navodio je „Otkazivanje je bez povrata novca”, iako sustav ne provodi plaćanje (AS-05), i razlikovao se od uzorka D-01; popis rezervacija bio je označen i s F-04, koji se odnosi na sprječavanje preklapanja. | Pregled pull requesta #87: skice su uspoređene s pretpostavkama u poglavlju 2, oznakama zahtjeva i katalogom zajedničkih stanja (#58). | Tekst dijaloga usklađen je s D-01, a oznaka F-04 uklonjena ([pregled](https://github.com/tmpteamname1/ChartIt/pull/87#pullrequestreview-5838541043), commit [cc6e5dc](https://github.com/tmpteamname1/ChartIt/commit/cc6e5dc)). |
