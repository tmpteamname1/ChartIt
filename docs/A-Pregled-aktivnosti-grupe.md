# A. Pregled aktivnosti grupe

**Projekt:** Razvoj web-aplikacije za charter tvrtku

**Trenutačna faza:** Projektni tjedan 7 (Iteracija 1)

## A.1 Evidencija sastanaka

**Kratice članova tima:**

- SM = Sven Matić (voditelj)
- MB = Mihael Bartulović
- BC = Bruno Crnković
- LL = Lucian Lepur
- LN = Luka Nikolić
- BP = Borna Pavičić
- LR = Luka Rušev

Projektna grupa održava dva sastanka tjedno. Jedan sastanak održava se u sklopu laboratorijskih vježbi, dok se drugi i opsežniji održava u dodatnom terminu koji članovi grupe dogovaraju samostalno.

| Datum i sudionici | Glavna tema | Donesena odluka ili zadatak | Poveznica na zadatak ili rezultat |
|---|---|---|---|
| 12.10.2026.; svi članovi | Razjašnjavanje projektnog zadatka i odabir tehnologija | SM je preporučio Django za razvoj poslužiteljskog dijela i React za razvoj klijentskog dijela aplikacije. | / |
| 20.10.2026.; svi članovi | Dogovor o podjeli na pod-timove | BC, LL i BP će raditi na backendu, a LR, LN i MB na frontendu. | / |
| 27.10.2026.; svi članovi | Definiranje zahtjeva i obrazaca uporabe | LL će definirati funkcionalne i nefunkcionalne zahtjeve te obrasce uporabe aplikacije. | [Analiza zahtjeva](2-Analiza-zahtjeva.md) |
| 3.11.2026.; svi članovi | Dogovor o prvoj funkcionalnosti | Donesena je odluka da će prva implementirana funkcionalnost biti pretraživanje plovila za neulogiranog korisnika. | [Epik #93](https://github.com/tmpteamname1/ChartIt/issues/93) |
| 5.11.2026.; svi članovi | Konzultacije s asistentom: postavljanje na Azure ne uspijeva | Aplikacija se postavlja na besplatni plan Rendera uz istu arhitekturu s jednim originom; SM postavlja Render. | [#81](https://github.com/tmpteamname1/ChartIt/pull/81), [poglavlje 2.7](2-Analiza-zahtjeva.md#27-pregled-zahtjeva) |
| 10.11.2026.; svi članovi | Prva cjelina panela tvrtke | Nakon pretrage slijedi stvaranje plovila iz panela tvrtke: backend (BC, BP) i frontend nad lažnim podacima (LN, LR), zatim prelazak na API. | [Epik #103](https://github.com/tmpteamname1/ChartIt/issues/103), [epik #117](https://github.com/tmpteamname1/ChartIt/issues/117) |
| 17.11.2026.; svi članovi | Priprema za Iteraciju 1 | Fotografije se trajno spremaju izvan Rendera (SM, #131); SM usklađuje dokumentaciju s predloškom (#136); SM izvodi sustavska ispitivanja (#137). | [#131](https://github.com/tmpteamname1/ChartIt/issues/131), [#136](https://github.com/tmpteamname1/ChartIt/issues/136), [#137](https://github.com/tmpteamname1/ChartIt/issues/137) |

## A.2 Plan rada

**Trenutačni plan:** [GitHub Projects – Plan rada](https://github.com/orgs/tmpteamname1/projects/3)

**Osoba zadužena za ažuriranje plana:** Sven Matić

| Razdoblje/Tjedan | Glavni planirani rad | Odgovorni članovi | Poveznica na zadatke |
|---|---|---|---|
| Tjedan 1 | Formiranje grupe i upoznavanje s projektnim zadatkom; početak izrade mape korisničkih priča u Figmi. | Svi članovi | [Odjeljak 2.8](2-Analiza-zahtjeva.md#28-početna-mapa-korisničkih-priča) |
| Tjedan 2 | Odabir razvojnih tehnologija; dovršetak mape korisničkih priča. | Tehnologije SM; mapa korisničkih priča svi članovi | [Zadatak #4](https://github.com/orgs/tmpteamname1/projects/3/views/2?pane=issue&itemId=278728960&issue=tmpteamname1%7CChartIt%7C4) |
| Tjedan 3 | Definiranje funkcionalnih i nefunkcionalnih zahtjeva. | LL | [Zadatak #10](https://github.com/orgs/tmpteamname1/projects/3/views/2?pane=issue&itemId=283747405&issue=tmpteamname1%7CChartIt%7C10) |
| Tjedan 4 | Podjela na pod-timove | Svi članovi | / |
| Tjedan 5 | Rad na dokumentaciji i dogovor o prvoj fazi implementacije; kostur aplikacije, konvencije API-ja, postavljanje na Render. | Svi članovi; kostur i postavljanje SM | [Zadatak #23](https://github.com/orgs/tmpteamname1/projects/3/views/2?pane=issue&itemId=288207191&issue=tmpteamname1%7CChartIt%7C23), [epik #32](https://github.com/tmpteamname1/ChartIt/issues/32) |
| Tjedan 6 | Rad na wireframeovima i prvoj funkcionalnosti (javna pretraga) te implementacija OAuth prijave. | Wireframeovi LN, LR; pretraga BC, BP, MB, SM; OAuth LL, SM | [Zadatak #30](https://github.com/orgs/tmpteamname1/projects/3/views/2?pane=issue&itemId=291199853&issue=tmpteamname1%7CChartIt%7C30), [epik #93](https://github.com/tmpteamname1/ChartIt/issues/93), [epik #41](https://github.com/tmpteamname1/ChartIt/issues/41) |
| Tjedan 7 (Iteracija 1) | Stvaranje plovila iz panela tvrtke, prelazak pretrage na API, trajna pohrana fotografija, dokumentacija za predaju i sustavska ispitivanja. | Backend BC, BP; frontend LN, LR, MB; pohrana, dokumentacija i sustavska ispitivanja SM | [Epik #103](https://github.com/tmpteamname1/ChartIt/issues/103), [epik #117](https://github.com/tmpteamname1/ChartIt/issues/117), [#96](https://github.com/tmpteamname1/ChartIt/issues/96), [#131](https://github.com/tmpteamname1/ChartIt/issues/131), [#136](https://github.com/tmpteamname1/ChartIt/issues/136), [#137](https://github.com/tmpteamname1/ChartIt/issues/137) |
| Tjedan 8 i dalje | Rezervacije: model s ograničenjem preklapanja, zahtjev korisnika, obrada u panelu tvrtke (poglavlje 7.3). Zadaci još nisu podijeljeni ni otvoreni. | Svi članovi | / |

Plan rada ažurira se prema napretku projekta i dogovorima grupe. GitHub Projects koristi se kao glavni pregled organizacije i napretka zadataka, dok se GitHub Issues koriste za evidentiranje pojedinačnih zadataka i problema.

## A.3 Aktivnosti i doprinosi članova

Tim nije bilježio sate po zadatku. Sati su zato procjena: procijenjeni prosjek od 1,5 sata po zadatku pomnožen s brojem zadataka u retku, uključujući zadatke u tijeku. Iznimka su odabir tehnologija, mapa korisničkih priča, zahtjevi (#10) i posljednji redak, za koje su sati zabilježeni ili procijenjeni zasebno. Poveznice vode na spojene pull requestove; otvoreni zadaci navedeni su zasebno.

| Aktivnost ili rezultat | Član | Prijavljeni sati | Reprezentativni rezultat ili poveznica |
|---|---|---|---|
| Odabir tehnologija | SM | 1 | Odabir Django i React tehnologija. |
| Početna mapa korisničkih priča u Figmi (tjedni 1 i 2) | Svi članovi | 2,5 sata po članu | [Slika 2.1](2-Analiza-zahtjeva.md#28-početna-mapa-korisničkih-priča) |
| Kostur projekta, Docker, kostur React aplikacije i konvencije REST API-ja | SM | 6 | [#8](https://github.com/tmpteamname1/ChartIt/pull/8), [#62](https://github.com/tmpteamname1/ChartIt/pull/62), [#63](https://github.com/tmpteamname1/ChartIt/pull/63), [#77](https://github.com/tmpteamname1/ChartIt/pull/77) |
| Postavljanje na Render, varijable okruženja, lint i CI | SM | 7,5 | [#78](https://github.com/tmpteamname1/ChartIt/pull/78), [#81](https://github.com/tmpteamname1/ChartIt/pull/81), [#83](https://github.com/tmpteamname1/ChartIt/pull/83), [#84](https://github.com/tmpteamname1/ChartIt/pull/84), [#85](https://github.com/tmpteamname1/ChartIt/pull/85) |
| Klase dopuštenja, CSRF, testna prijava, prijava u klijentu i zaštićene rute | SM | 7,5 | [#110](https://github.com/tmpteamname1/ChartIt/pull/110), [#111](https://github.com/tmpteamname1/ChartIt/pull/111), [#112](https://github.com/tmpteamname1/ChartIt/pull/112), [#128](https://github.com/tmpteamname1/ChartIt/pull/128), [#129](https://github.com/tmpteamname1/ChartIt/pull/129) |
| Trajna pohrana fotografija (Cloudflare R2) i dokumentacija za predaju | SM | 3 | [#139](https://github.com/tmpteamname1/ChartIt/pull/139), [#138](https://github.com/tmpteamname1/ChartIt/pull/138); #136 u tijeku |
| Arhitektura i oblikovanje (poglavlje 4) | SM | 1,5 | [#31](https://github.com/tmpteamname1/ChartIt/pull/31) |
| Funkcionalni i nefunkcionalni zahtjevi, usklađivanje obrazaca uporabe | LL | 3,5 | [Zadatak #10](https://github.com/orgs/tmpteamname1/projects/3/views/2?pane=issue&itemId=283747405&issue=tmpteamname1%7CChartIt%7C10), [#80](https://github.com/tmpteamname1/ChartIt/pull/80) |
| Odabir OAuth rješenja (ADR-06), registracija Google OAuth aplikacije, Google prijava i naredba `promote_admin` | LL | 6 | [#86](https://github.com/tmpteamname1/ChartIt/pull/86), [#106](https://github.com/tmpteamname1/ChartIt/pull/106), [#125](https://github.com/tmpteamname1/ChartIt/pull/125), [#127](https://github.com/tmpteamname1/ChartIt/pull/127) |
| Model charter tvrtke i plovila, javni popis plovila s filtrima i detalji plovila | BC | 7,5 | [#105](https://github.com/tmpteamname1/ChartIt/pull/105), [#124](https://github.com/tmpteamname1/ChartIt/pull/124), [#132](https://github.com/tmpteamname1/ChartIt/pull/132), [#134](https://github.com/tmpteamname1/ChartIt/pull/134); #101 u tijeku (PR #135) |
| Pregled aktivnosti grupe (početna verzija) | BC | 1,5 | [#79](https://github.com/tmpteamname1/ChartIt/pull/79) |
| Obrasci uporabe (poglavlje 3) | BP | 1,5 | [#66](https://github.com/tmpteamname1/ChartIt/pull/66) |
| Šifrarnici, javni API kataloga, fotografije i minijature, naredba `seed_catalog` | BP | 7,5 | [#90](https://github.com/tmpteamname1/ChartIt/pull/90), [#120](https://github.com/tmpteamname1/ChartIt/pull/120), [#130](https://github.com/tmpteamname1/ChartIt/pull/130), [#133](https://github.com/tmpteamname1/ChartIt/pull/133); #102 u tijeku |
| Wireframeovi korisničkog dijela, panela tvrtke i mobilnog prikaza; zajednička stanja sučelja | LN | 6 | [#82](https://github.com/tmpteamname1/ChartIt/pull/82), [#87](https://github.com/tmpteamname1/ChartIt/pull/87), [#89](https://github.com/tmpteamname1/ChartIt/pull/89), [#99](https://github.com/tmpteamname1/ChartIt/pull/99) |
| Početna stranica dokumentacije, pristup djelatnika rezervacijama u zahtjevima | LN | 3 | [#64](https://github.com/tmpteamname1/ChartIt/pull/64), [#107](https://github.com/tmpteamname1/ChartIt/pull/107) |
| API modul flote tvrtke i obrazac novog plovila | LN | 4,5 | [#121](https://github.com/tmpteamname1/ChartIt/pull/121), [#123](https://github.com/tmpteamname1/ChartIt/pull/123); #116 u tijeku |
| Opis projekta (poglavlje 1), wireframeovi javnog dijela i administracije, usklađivanje oznaka zahtjeva | LR | 6 | [#65](https://github.com/tmpteamname1/ChartIt/pull/65), [#88](https://github.com/tmpteamname1/ChartIt/pull/88), [#98](https://github.com/tmpteamname1/ChartIt/pull/98), [#108](https://github.com/tmpteamname1/ChartIt/pull/108) |
| Ekran flote tvrtke | LR | 3 | [#122](https://github.com/tmpteamname1/ChartIt/pull/122); #116 u tijeku |
| Ekran javne pretrage plovila | MB | 3 | [#126](https://github.com/tmpteamname1/ChartIt/pull/126); #96 u tijeku |
| Rad na dokumentaciji (dijagram i opisi obrazaca uporabe) | Svi članovi | 2-3 sata po članu | Poglavlje 3. |

## A.4 Pregled promjena u repozitoriju

**Prikaz aktivnosti repozitorija:** [GitHub – Contributors i graf aktivnosti](https://github.com/tmpteamname1/ChartIt/graphs/contributors)

**Razdoblje:** Od početka projekta (listopad 2026.) do Iteracije 1 (projektni tjedan 7).

Graf prikazuje commitove u grani `main`. Nekoliko članova commitalo je s više Git identiteta (npr. različite adrese e-pošte na različitim računalima), pa se isti član u grafu može pojaviti pod dva imena. Graf ne prikazuje rad koji nije u commitovima: pregled pull requestova, oblikovanje u wireframeovima prije commita, ručno ispitivanje ni postavljanje usluga (Render, Cloudflare R2, Google Cloud Console). Veći broj commitova voditelja dijelom je posljedica infrastrukturnih zadataka (kostur, CI, postavljanje) i dokumentacije, koji se rade u više manjih commitova.

Za organizaciju rada i praćenje napretka koriste se GitHub Issues i GitHub Projects.

## A.5 Ključni inženjerski izazovi i rješenja

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
|---|---|---|
| Postavljanje na Azure nije uspijevalo, a aplikacija mora biti javno dostupna (NF-07). | Nakon konzultacija s asistentom SM je aplikaciju postavio na Render iz `render.yaml`, uz istu arhitekturu s jednim originom. | Aplikacija je javno dostupna; besplatni plan gasi servis bez prometa, a baza istječe nakon 30 dana ([#81](https://github.com/tmpteamname1/ChartIt/pull/81), [#85](https://github.com/tmpteamname1/ChartIt/pull/85)). |
| Render na besplatnom planu nema trajni disk, pa su se učitane fotografije gubile pri svakom postavljanju, a katalog na javnoj instanci ostao je prazan. | SM je usporedio pružatelje pohrane (Cloudflare R2, Backblaze B2, Supabase) i uveo pohranu u R2 preko `django-storages`, bez promjene modela i frontenda. | Fotografije ostaju nakon ponovnog pokretanja; javna instanca ima demo katalog (ST-04) ([#139](https://github.com/tmpteamname1/ChartIt/pull/139)). |
| Pri punjenju produkcijske baze lokalni `.env` s `DJANGO_DEBUG=True` isključio je zaštitnu provjeru naredbe `seed_catalog`, koja sprječava zapise fotografija bez datoteka. | Postupak u poglavlju 6.3 dopunjen je obaveznim `DJANGO_DEBUG=False`. | Provjera radi kada se postupak slijedi; da naredba sama odbije produkcijsku bazu, predloženo je kao budući rad (poglavlje 7.3). |
| Frontend i backend tim rade usporedno, a ekrani ovise o API-ju koji još ne postoji. | Ekrani se izrađuju nad lažnim podacima točnog oblika odgovora iz zadatka (`frontend/src/api/`), a zaseban zadatak ih prebacuje na API. | Pretraga i flota izrađene su prije API-ja; prelazak na API završava se u #96 i #116. |
| Nakon preuređenja zahtjeva u poglavlju 2 ostala poglavlja koristila su stare oznake zahtjeva. | LR je uskladio oznake u cijeloj dokumentaciji. | [#104](https://github.com/tmpteamname1/ChartIt/issues/104), [#108](https://github.com/tmpteamname1/ChartIt/pull/108). |
