# 1. Opseg projekta

## 1.1 Problem i cilj projekta

Charter tvrtke svakodnevno upravljaju flotom plovila, rezervacijama, klijentima i raspoloživošću plovila. Kada se ti podaci vode odvojeno (na primjer u tablicama, e-porukama i telefonskim dogovorima), teško je imati pouzdan uvid u to koje je plovilo slobodno u kojem terminu, a postoji i rizik da se isto plovilo dvaput rezervira za termine koji se preklapaju. Korisnik s druge strane teško može na jednom mjestu usporediti plovila različitih tvrtki, njihove karakteristike, cijene i slobodne termine te provjeriti kakvo će vrijeme biti na mjestu polaska.

Cilj projekta je razviti web-platformu za najam plovila na kojoj više charter tvrtki nudi svoja plovila. Korisnik na jednom mjestu pretražuje plovila svih tvrtki prema terminu, lokaciji polaska, vrsti plovila, broju osoba i tvrtki, šalje zahtjev za rezervaciju s dodatnim uslugama te pregledava podatke i ukupni iznos svojih rezervacija. Vlasnicima i djelatnicima tvrtke platforma olakšava upravljanje flotom, cijenama, rezervacijama i rasporedom preuzimanja i povrata plovila te vlasniku daje osnovne statističke pokazatelje poslovanja. Svaka tvrtka vidi i mijenja samo svoje podatke, a administrator platforme upravlja tvrtkama i zajedničkim popisima.

Očekivana korist je pregledniji i pouzdaniji rad s rezervacijama: jednoznačna evidencija zauzetosti plovila onemogućuje istodobnu rezervaciju istog plovila za termine koji se preklapaju, a korisnik na jednom mjestu dobiva karakteristike plovila, cijene, slobodne termine, prognozu vremena i položaj luke na karti. Aplikacija ne tvrdi izmjereno smanjenje vremena obrade rezervacija niti povećanje prihoda; to bi zahtijevalo mjerenja koja nisu dio ovog projekta.

## 1.2 Ciljani korisnici i dionici

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| Posjetitelj (neprijavljeni korisnik) | Bez prijave pretraživati plovila svih tvrtki prema terminu, lokaciji polaska, vrsti plovila, broju osoba i tvrtki; vidjeti karakteristike, fotografije, cijene i slobodne termine plovila, osnovne podatke o tvrtki te prognozu vremena i položaj luke na karti. |
| Korisnik (prijavljen) | Uz sve što može posjetitelj, poslati zahtjev za rezervaciju za odabrano razdoblje s dodatnim uslugama, pregledati podatke i ukupni iznos svojih rezervacija, otkazati rezervaciju te e-poštom primiti potvrdu ili obavijest o odbijanju i otkazivanju. |
| Djelatnik charter tvrtke | Pregledati i obraditi zahtjeve za rezervaciju plovila svoje tvrtke (potvrda, odbijanje, otkazivanje), pratiti raspored preuzimanja i povrata te evidentirati preuzimanje, povrat i završetak najma. |
| Vlasnik charter tvrtke | Sve što može djelatnik, uz upravljanje plovilima, cijenama, dodatnim uslugama i razdobljima nedostupnosti plovila, upravljanje djelatnicima i podacima svoje tvrtke te pregled statistike poslovanja (zauzetost, rezervacije, prihod, najtraženije kategorije i usluge) s izvozom u CSV. |
| Administrator platforme | Stvarati, mijenjati i deaktivirati charter tvrtke i dodjeljivati im vlasnike, upravljati korisničkim računima i ulogama te zajedničkim popisima kategorija plovila i luka. |
| Vanjski pružatelji usluga (dionik) | Pružatelj prijave (Google OAuth), meteorološki i kartografski servis te servis za slanje e-pošte ne koriste aplikaciju, ali njihova dostupnost i uvjeti korištenja ograničavaju što sustav može ponuditi. |

## 1.3 Granice projekta

**Uključeno:**
- Platforma za više charter tvrtki u zajedničkoj bazi podataka, uz strogo odvajanje podataka: vlasnici i djelatnici vide i mijenjaju samo podatke svoje tvrtke.
- Unos i održavanje podataka o plovilima (naziv, tip, proizvođač i model, godina proizvodnje, kapacitet, broj kabina i ležajeva, osnovna oprema, matična luka, fotografije, cijena najma) i njihovo razvrstavanje u kategorije (jedrilice, motorni brodovi, katamarani i druga plovila).
- Pretraživanje i pregled plovila svih tvrtki prema terminu, lokaciji polaska, vrsti plovila, broju osoba, tvrtki i drugim osnovnim kriterijima, bez prijave.
- Zahtjev za rezervaciju za odabrano razdoblje s odabirom dodatnih usluga (npr. skiper, završno čišćenje, dodatna oprema), uz sprječavanje preklapajućih rezervacija istog plovila i jednoznačnu evidenciju zauzetosti.
- Statusi rezervacije (zahtjev, potvrđena, odbijena, otkazana, završeni najam), pregled podataka i ukupnog iznosa rezervacije te obavijesti e-poštom o potvrdi, odbijanju i otkazivanju.
- Upravljanje plovilima, cijenama, dodatnim uslugama, razdobljima nedostupnosti, djelatnicima i podacima tvrtke (vlasnik) te obrada rezervacija i raspored preuzimanja i povrata (vlasnik i djelatnik).
- Statistički pregled za vlasnika i izvoz izvještaja u formatu CSV.
- Prikaz vremenske prognoze za mjesto i termin najma te prikaz matične luke i lokacije preuzimanja plovila na karti.
- Administracija platforme: charter tvrtke i njihovi vlasnici, korisnički računi i uloge, kategorije plovila i luke.
- Prijava i registracija putem vanjskog OAuth pružatelja, četiri uloge (korisnik, djelatnik, vlasnik, administrator) s odgovarajućim ovlastima, istodobni rad više korisnika i responzivno sučelje za računala, tablete i mobilne uređaje.

**Izvan opsega ili odgođeno:**
- Online naplata i integracija s platnim pristupnikom: zadatak traži samo prikaz ukupnog iznosa rezervacije, a plaćanje bi uvelo dodatnu sigurnosnu i pravnu složenost.
- Vlastita registracija i prijava lozinkom: računi se stvaraju isključivo preko vanjskog OAuth pružatelja, pa platforma ne pohranjuje lozinke (ADR-06).
- Izrada zasebne nativne mobilne aplikacije: sučelje je responzivno i dostupno kroz preglednik na svim uređajima.
- Integracija s računovodstvenim, ERP ili vanjskim sustavima za rezervacije (agregatori, kalendari): nije traženo zadatkom.
- Napredne mogućnosti poput dinamičkog određivanja cijena, preporuka plovila ili predviđanja potražnje: prelaze opseg prve inačice.
- Upravljanje plovidbenom dokumentacijom, osiguranjem i kadrovskim rasporedom skipera: sustav samo omogućuje odabir skipera kao dodatne usluge.

**Vanjske ovisnosti:**
- Vanjski OAuth pružatelj (Google) za prijavu i registraciju korisnika; bez njega se korisnici ne mogu prijaviti.
- Meteorološki servis (API) za podatke o temperaturi, vjetru i vremenskim uvjetima za mjesto i termin najma.
- Kartografski servis za prikaz položaja matične luke i lokacije preuzimanja plovila.
- Servis za slanje elektroničke pošte za dostavu obavijesti o rezervaciji.
- Baza podataka (PostgreSQL) u kojoj aplikacija sama čuva podatke o tvrtkama, plovilima, rezervacijama i korisnicima; aplikacija ostaje odgovorna za vlastite podatke, a meteorološki i kartografski servis služe samo za prikaz dodatnih informacija.

## 1.4 Postojeći pristupi i opravdanost projekta

Manje charter tvrtke rezervacije često vode kombinacijom upita elektroničkom poštom ili telefonom i zajedničkih tablica, a korisnik pritom ponude različitih tvrtki uspoređuje na više mjesta, a vremensku prognozu i položaj luke provjerava u zasebnim izvorima. Takav način rada omogućuje osnovnu komunikaciju, ali ne jamči jednoznačnu evidenciju zauzetosti plovila niti daje korisniku cjelovit pregled na jednom mjestu. Predložena platforma objedinjuje ponudu više tvrtki, pretraživanje plovila, rezervaciju s dodatnim uslugama, evidenciju zauzetosti te pregled prognoze i karte, a djelatnicima i vlasniku daje pregled rasporeda i osnovne statistike. Aplikacija ne zamjenjuje poslovne procese tvrtke izvan odobrenog opsega, poput naplate ili vođenja plovidbene dokumentacije.
