# Zajednička stanja sučelja

Ovdje su skice zajedničkih stanja za [issue #58](https://github.com/tmpteamname1/ChartIt/issues/58). Ideja je da na različitim ekranima koristimo iste poruke i način prikaza, umjesto da ih svaki put radimo ispočetka. Skice su prijedlog za izradu sučelja, a podaci u njima su samo primjeri.

## Učitavanje

<a id="u-01"></a>
### U-01 — Cijela stranica

Dok se prvi put učitavaju podaci, u glavnom dijelu stranice pokazujemo da je učitavanje u tijeku. Zaglavlje i izbornik za to vrijeme ostaju dostupni.

```text
ChartIt                          [ Izbornik ]
--------------------------------------------
(...) Učitavanje podataka...
```

<a id="u-02"></a>
### U-02 — Dio stranice

Kad učitavamo samo rezultate pretrage, umjesto kartica prikazujemo prazne okvire (skeleton). Korisnik i dalje može mijenjati filtre i koristiti ostatak stranice.

```text
[ Filtri ]
[ Slika ]  [ Slika ]
[ ----- ]  [ ----- ]
Učitavanje rezultata...
```

<a id="u-03"></a>
### U-03 — Gumb pri slanju

Nakon klika na slanje privremeno onemogućimo gumb i uz tekst pokažemo indikator učitavanja kako korisnik ne bi isti zahtjev poslao više puta. Ono što je unio ostaje sačuvano dok čekamo odgovor.

```text
[ (...) Slanje zahtjeva... ]
```

## Prazna stanja

<a id="p-01"></a>
### P-01 — Nema rezultata

Ako je pretraga završila, ali nema rezultata, ponudimo korisniku da promijeni kriterije ili ukloni filtre.

```text
Nema plovila za odabrane kriterije.
Promijenite termin ili filtre.
[ Ukloni filtre ]
```

<a id="p-02"></a>
### P-02 — Nema rezervacija

Ako korisnik još nema rezervacija, ponudimo mu odlazak na pretragu plovila. Ako samo odabrani status nema rezultata, umjesto toga ponudimo prikaz svih statusa.

```text
Još nemate rezervacija.
Pronađite plovilo za najam.
[ Pretraži plovila ]
```

<a id="p-03"></a>
### P-03 — Nema podataka za razdoblje

Ovo koristimo u statistici i rasporedu kad za odabrane datume nema podataka. Korisnik može odabrati drugo razdoblje.

```text
Nema podataka za odabrano razdoblje.
[ Promijeni razdoblje ]
```

## Greške

<a id="g-01"></a>
### G-01 — Greška u polju

Poruka ide odmah ispod polja koje treba ispraviti. Nakon slanja obrazac vraća fokus na prvo takvo polje, a ostali uneseni podaci ostaju sačuvani.

```text
Datum početka: [ Odaberite datum ]
! Odaberite datum početka.
```

<a id="g-02"></a>
### G-02 — Greška poslužitelja

Ako dohvat podataka ne uspije, korisnik može pokušati ponovno. Kod slanja rezervacije treba paziti na slučaj kad ne znamo je li zahtjev spremljen. Tada ga prvo uputimo na provjeru Mojih rezervacija, da ne pošalje isti zahtjev dvaput.

```text
Podatke nije moguće učitati.
Pokušajte ponovno kasnije.
[ Pokušaj ponovno ]
```

<a id="g-03"></a>
### G-03 — 403: Nemate pristup

Ova poruka je za prijavljenog korisnika koji nema pristup tom dijelu aplikacije. Zaštićene podatke ne prikazujemo. Ako korisnik uopće nije prijavljen, šaljemo ga na prijavu.

```text
Nemate pristup.
Ova stranica nije dostupna vašoj ulozi.
[ Na početnu ]
```

<a id="g-04"></a>
### G-04 — 404: Stranica ne postoji

Ovo prikazujemo kad korisnik otvori stranicu koja ne postoji. Ako stranica postoji, ali traženi zapis nije dostupan, poruka je „Traženi podaci nisu dostupni.”

```text
Stranica ne postoji.
Provjerite adresu ili se vratite na početnu.
[ Na početnu ]
```

<a id="g-05"></a>
### G-05 — Sukob 409

Termin se može zauzeti dok korisnik ispunjava obrazac. U tom slučaju tražimo da odabere drugi, ali mu ostavljamo odabrane dodatne usluge. Nakon promjene termina ponovno provjeravamo dostupnost i iznos.

```text
Termin više nije dostupan.
Odabrane dodatne usluge su sačuvane.
[ Odaberi drugi termin ]
```

## Vanjski servisi

<a id="v-01"></a>
### V-01 — Karta nije dostupna

Ako se karta ne može učitati, poruka se pojavljuje na njezinu mjestu. Podaci o luci i ostatak stranice ostaju dostupni pa korisnik može nastaviti s rezervacijom.

```text
Matična luka: Split
[ Karta trenutačno nije dostupna. ]
[ Pokušaj ponovno ]

Cijena i kalendar             [ Pošalji zahtjev ]
```

<a id="v-02"></a>
### V-02 — Prognoza nije dostupna

Isto vrijedi za prognozu: ako servis ne radi, prikažemo poruku samo u tom dijelu. To ne treba spriječiti korisnika da pošalje zahtjev za rezervaciju.

```text
[ Prognoza trenutačno nije dostupna. ]
[ Pokušaj ponovno ]

Cijena i kalendar             [ Pošalji zahtjev ]
```

## Uspjeh i potvrdni dijalozi

<a id="o-01"></a>
### O-01 — Uspjeh

Poruku o uspjehu prikazujemo tek kad poslužitelj potvrdi da je radnja uspjela. Kod rezervacije treba biti jasno da je poslan zahtjev koji tvrtka još mora potvrditi. Za spremanje izmjena koristimo „Promjene su spremljene.”

```text
Zahtjev je poslan.
Čeka potvrdu tvrtke.
[ Moje rezervacije ]
```

<a id="d-01"></a>
### D-01 — Otkazivanje

Prije otkazivanja pitamo korisnika je li siguran i pokažemo mu na koju se rezervaciju radnja odnosi. Gumb za zadržavanje rezervacije prvi dobiva fokus. Otkazivanje nudimo samo kad je dopušteno za trenutačni status.

```text
Otkazati rezervaciju?
Bavaria 37, 12. - 15. 6.
Termin se oslobađa. Radnju nije moguće poništiti.
[ Zadrži rezervaciju ]  [ Da, otkaži ]
```

<a id="d-02"></a>
### D-02 — Deaktivacija

U dijalogu treba pisati što deaktiviramo i što će se time promijeniti. Za tvrtku prikazujemo i broj budućih potvrđenih rezervacija. Na skici je broj 3 samo primjer, a u aplikaciji se taj broj dohvaća iz baze.

```text
Deaktivirati tvrtku Jadran Charter?
Buduće potvrđene rezervacije: 3
Tvrtka nestaje iz javne pretrage.
Postojeće rezervacije i povijest ostaju sačuvani.
[ Odustani ]  [ Deaktiviraj ]
```

## Zajednička pravila

- Za greške API-ja držimo se [formata iz dokumentacije](../4-Arhitektura-i-oblikovanje.md#format-greške). `errors` prikazujemo uz polja, a `non_field_errors` uz obrazac. Za opće poruke gledamo status i `code`, bez prikazivanja tehničkih detalja korisniku.
- Razlikujemo prazan rezultat od greške pri učitavanju. Ako karta ili prognoza ne rade, ostatak stranice treba nastaviti raditi (NF-06).
- U potvrdnom dijalogu fokus prvo ide na odustajanje. Dok šaljemo zahtjev, gumb izgleda kao U-03 i čekamo odgovor prije prikaza rezultata.
- Na mobitelu koristimo iste poruke, samo elemente i gumbe dijaloga slažemo jedan ispod drugog.

<a id="primjena-po-ekranima"></a>
## Primjena po ekranima

U wireframeima ostalih ekrana možemo samo staviti oznaku uzorka i poveznicu na njegovu skicu. U tablici je pregled gdje nam koji uzorak treba, prema [mapi stranica](../4-Arhitektura-i-oblikovanje.md#48-mapa-stranica-i-ruta-klijentske-aplikacije).

| Wireframe / zadatak | Uzorci koje koristi |
| --- | --- |
| [#53 — Javni dio](https://github.com/tmpteamname1/ChartIt/issues/53) | Pretraga: [U-02](#u-02), [P-01](#p-01). Detalji plovila: [V-01](#v-01), [V-02](#v-02). |
| [#54 — Korisnički dio](https://github.com/tmpteamname1/ChartIt/issues/54) | Rezervacija: [U-03](#u-03), [G-01](#g-01), [G-05](#g-05), [O-01](#o-01). Moje rezervacije: [P-02](#p-02), [D-01](#d-01). |
| [#55 — Panel tvrtke](https://github.com/tmpteamname1/ChartIt/issues/55) | Statistika i raspored: [P-03](#p-03). Obrasci: [G-01](#g-01), [G-05](#g-05), [U-03](#u-03). Deaktivacija: [D-02](#d-02). |
| [#56 — Administracija](https://github.com/tmpteamname1/ChartIt/issues/56) | Duplikat OIB-a: [G-01](#g-01), uz polje OIB. Deaktivacija tvrtke: [D-02](#d-02), uz broj budućih potvrđenih rezervacija. |
| [#57 — Mobilni prikaz](https://github.com/tmpteamname1/ChartIt/issues/57) | Isti uzorci i poruke, prilagođeni širini zaslona prema zajedničkom pravilu iznad. [Skice i pravila prilagodbe](57-Wireframe-mobilnog-prikaza.md). |
| Svi ekrani | Dohvat: [U-01](#u-01), [G-02](#g-02). Zaštićene i nepoznate stranice: [G-03](#g-03), [G-04](#g-04). |
