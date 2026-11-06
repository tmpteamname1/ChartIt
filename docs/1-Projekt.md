# 1. Opseg projekta

## 1.1 Problem i cilj projekta

Charter tvrtke svakodnevno upravljaju flotom plovila, rezervacijama, klijentima i raspoloživošću plovila. Kada se ti podaci vode odvojeno (na primjer u tablicama, e-porukama i telefonskim dogovorima), teško je imati pouzdan uvid u to koje je plovilo slobodno u kojem terminu, a postoji i rizik da se isto plovilo dvaput rezervira za termine koji se preklapaju. Korisnik s druge strane teško može na jednom mjestu usporediti karakteristike plovila, cijene i slobodne termine te provjeriti kakvo će vrijeme biti na mjestu polaska.

Cilj projekta je razviti web aplikaciju za podršku charter poslovanju i iznajmljivanju plovila. Aplikacija korisniku omogućuje pretraživanje raspoloživih plovila prema terminu, lokaciji polaska, vrsti plovila i broju osoba, izradu rezervacije s dodatnim uslugama te pregled podataka i ukupnog iznosa rezervacije. Djelatnicima, administratoru i voditelju charter tvrtke aplikacija olakšava upravljanje flotom, rezervacijama i rasporedom preuzimanja i povrata plovila te pruža osnovne statističke pokazatelje poslovanja.

Očekivana korist je pregledniji i pouzdaniji rad s rezervacijama: jednoznačna evidencija zauzetosti plovila onemogućuje istodobnu rezervaciju istog plovila za termine koji se preklapaju, a korisnik na jednom mjestu dobiva karakteristike plovila, cijene, slobodne termine, prognozu vremena i položaj luke na karti. Aplikacija ne tvrdi izmjereno smanjenje vremena obrade rezervacija niti povećanje prihoda; to bi zahtijevalo mjerenja koja nisu dio ovog projekta.

## 1.2 Ciljani korisnici i dionici

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| Posjetitelj (neprijavljeni korisnik) | Bez prijave pregledavati i pretraživati raspoloživa plovila prema terminu, lokaciji polaska, vrsti plovila i broju osoba; vidjeti karakteristike, fotografije, cijene i slobodne termine plovila te prognozu vremena i položaj luke na karti. |
| Registrirani korisnik  | Uz sve što može posjetitelj, izraditi rezervaciju za odabrano razdoblje s dodatnim uslugama; pregledati podatke i ukupan iznos svojih rezervacija te primiti potvrdu rezervacije elektroničkom poštom. |
| Djelatnik charter tvrtke | Pregledati raspored preuzimanja i povrata plovila te osnovne podatke potrebne za realizaciju najma. |
| Administrator sustava | Dodavati i mijenjati plovila i njihovu opremu, definirati cijene i dodatne usluge, upravljati rezervacijama te evidentirati razdoblja u kojima plovilo nije raspoloživo (servis, održavanje i sl.). |
| Voditelj charter tvrtke | Pregledati statističke podatke (zauzetost plovila, broj rezervacija u razdoblju, ostvareni prihod, najtraženije kategorije plovila i dodatne usluge) te ih izvesti u formatu pogodnom za daljnju obradu ili arhiviranje. |
| Vanjski pružatelji usluga (dionik) | Meteorološki i kartografski servis te servis za slanje e-pošte ne koriste aplikaciju, ali njihova dostupnost i uvjeti korištenja ograničavaju što sustav može ponuditi. |

## 1.3 Granice projekta

**Uključeno:**
- Unos i održavanje podataka o plovilima (naziv, tip, proizvođač i model, godina proizvodnje, kapacitet, broj kabina i ležajeva, osnovna oprema, matična luka, fotografije, cijena najma) i njihovo razvrstavanje u kategorije (jedrilice, motorni brodovi, katamarani i druga plovila).
- Pretraživanje i pregled raspoloživih plovila prema terminu, lokaciji polaska, vrsti plovila, broju osoba i drugim osnovnim kriterijima.
- Izrada rezervacije za odabrano razdoblje s odabirom dodatnih usluga (npr. skiper, završno čišćenje, dodatna oprema), uz sprječavanje preklapajućih rezervacija istog plovila i jednoznačnu evidenciju zauzetosti.
- Statusi rezervacije (zahtjev, potvrđena, otkazana, završeni najam), pregled podataka i ukupnog iznosa rezervacije te slanje potvrde elektroničkom poštom.
- Administracija plovila, opreme, cijena, dodatnih usluga, rezervacija i razdoblja nedostupnosti plovila.
- Pregled rasporeda preuzimanja i povrata plovila za djelatnike.
- Statistički pregled za voditelja i izvoz podataka i izvještaja u najmanje jednom standardnom formatu (npr. CSV).
- Prikaz vremenske prognoze za mjesto i termin najma te prikaz matične luke i lokacije preuzimanja plovila na karti.
- Različite vrste korisnika s odgovarajućim ovlastima, istodobni rad više korisnika i responzivno sučelje za računala, tablete i mobilne uređaje.

**Izvan opsega ili odgođeno:**
- Online naplata i integracija s platnim pristupnikom: zadatak traži samo prikaz ukupnog iznosa rezervacije, a plaćanje bi uvelo dodatnu sigurnosnu i pravnu složenost.
- Izrada zasebne nativne mobilne aplikacije: sučelje je responzivno i dostupno kroz preglednik na svim uređajima.
- Integracija s računovodstvenim, ERP ili vanjskim sustavima za rezervacije (agregatori, kalendari): nije traženo zadatkom.
- Napredne mogućnosti poput dinamičkog određivanja cijena, preporuka plovila ili predviđanja potražnje: prelaze opseg prve inačice.
- Upravljanje plovidbenom dokumentacijom, osiguranjem i kadrovskim rasporedom skipera: sustav samo omogućuje odabir skipera kao dodatne usluge.

**Vanjske ovisnosti:**
- Meteorološki servis (API) za podatke o temperaturi, vjetru i vremenskim uvjetima za mjesto i termin najma.
- Kartografski servis za prikaz položaja matične luke i lokacije preuzimanja plovila.
- Servis za slanje elektroničke pošte za dostavu potvrde rezervacije.
- Baza podataka u kojoj aplikacija sama čuva podatke o plovilima, rezervacijama i korisnicima; aplikacija ostaje odgovorna za vlastite podatke, a vanjski servisi služe samo za prikaz dodatnih informacija.

## 1.4 Postojeći pristupi i opravdanost projekta

Manje charter tvrtke rezervacije često vode kombinacijom upita elektroničkom poštom ili telefonom i zajedničkih tablica, a korisnik pritom vremensku prognozu i položaj luke provjerava u zasebnim izvorima. Takav način rada omogućuje osnovnu komunikaciju, ali ne jamči jednoznačnu evidenciju zauzetosti plovila niti daje korisniku cjelovit pregled na jednom mjestu. Predložena aplikacija objedinjuje pretraživanje plovila, rezervaciju s dodatnim uslugama, evidenciju zauzetosti te pregled prognoze i karte, a djelatnicima i voditelju daje pregled rasporeda i osnovne statistike. Aplikacija ne zamjenjuje poslovne procese tvrtke izvan odobrenog opsega, poput naplate ili vođenja plovidbene dokumentacije.
