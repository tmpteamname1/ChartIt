import { useState, type FormEvent } from 'react'
import './HomePage.css'

type Boat = {   /*sta sve ima jedan brod*/
  id: number
  name: string
  kind: string
  port: string
  capacity: number
  dailyPrice: number
  description: string
  availableFrom: string
  availableUntil: string
}

const boats: Boat[] = [ /*varijabla boat sadrzi plovila koja imamo (za sada samo 3)  */
  {
    id: 1,
    name: 'Aquila 28',
    kind: 'Jedrilica',
    port: 'Split',
    capacity: 6,
    dailyPrice: 180,
    description: 'Udobna jedrilica za opušteno istraživanje srednjodalmatinskih otoka.',
    availableFrom: '2027-04-01',
    availableUntil: '2027-10-31',
  },
  {
    id: 2,
    name: 'Sea Breeze',
    kind: 'Motorna jahta',
    port: 'Zadar',
    capacity: 8,
    dailyPrice: 320,
    description: 'Prostrana jahta s dovoljno mjesta za obitelj ili grupu prijatelja.',
    availableFrom: '2027-05-15',
    availableUntil: '2027-09-30',
  },
  {
    id: 3,
    name: 'Marlin',
    kind: 'Katamaran',
    port: 'Dubrovnik',
    capacity: 10,
    dailyPrice: 410,
    description: 'Stabilan katamaran za duže izlete i ugodan boravak na moru.',
    availableFrom: '2027-04-15',
    availableUntil: '2027-10-15',
  },
]

const euro = new Intl.NumberFormat('hr-HR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

function HomePage() {
  /*vraijble koje u searchu mozemo mijenjati*/
  const [startDate, setStartDate] = useState('')  //datum polaska
  const [endDate, setEndDate] = useState('')  //datum povratka
  const [selectedPort, setSelectedPort] = useState('Sve luke')  //luka iz koje se krece
  const [selectedKind, setSelectedKind] = useState('Sve vrste') //vrsta plovila 
  const [people, setPeople] = useState(1)   //broj ljudi
  const [hasSearched, setHasSearched] = useState(false) //da znamo kada korisnik pretrazi kako bi priakzali nove rezultate
  const [dateError, setDateError] = useState('')    //za pogresan datum
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null)  //pamti plovilo koje korisnik gleda
                                            //ili plovilo tipa  Boat ili null 


  const handleSearch = (event: FormEvent<HTMLFormElement>) => { //poziva se kada korisnik pokrene pretragu plovila
    event.preventDefault()    //event  sadrzi informacije o tome sto se dogada

    if (endDate <= startDate) {   
      setDateError('Datum povratka mora biti nakon datuma polaska.')
      return
    }

    setDateError('')
    setHasSearched(true)
    document.getElementById('plovila')?.scrollIntoView({ behavior: 'smooth' })    //prikazuje rezultate plovila
    //<section className="results-section" id="plovila"> html dio 
    //scrollIntoView-za prikaz novih elemenata

  }
    //npr boats ={Aquile, Marlina.....} odnosno prolazimo po svim boats
  const filteredBoats = boats.filter((boat) => {    //popis plovila koja odgovaraju filterima
    //odgovara ako je korisnik odabrao sve luke ili ako je luka plovila jednaka odabranoj luci 
    const matchesPort = selectedPort === 'Sve luke' || boat.port === selectedPort   // T/F za luku i vrstu
    const matchesKind = selectedKind === 'Sve vrste' || boat.kind === selectedKind
    const matchesPeople = boat.capacity >= people 
    const matchesDates =
      !hasSearched ||     //(!hasSearched je true ako korisnik nije pokrenuo pretragu ) (default hasSearched=false)
      (startDate >= boat.availableFrom && endDate <= boat.availableUntil)

    return matchesPort && matchesKind && matchesPeople && matchesDates    //vraca T/F
  })

  const resetSearch = () => {
    setStartDate('')
    setEndDate('')
    setSelectedPort('Sve luke')
    setSelectedKind('Sve vrste')
    setPeople(1)
    setHasSearched(false)
    setDateError('')
  }

  return (    //prikazujemo
    <div className="boat-search-page">
      <div className="boat-search-content">
        <section className="boat-search-hero" id="kako-radi">
          <p className="eyebrow">More je bliže nego što misliš</p>
          <h1>Pronađi plovilo za svoj sljedeći odmor.</h1>
          <p className="intro-copy">
            Usporedi plovila i pronađi ono koje odgovara tvom planu putovanja.
          </p>
                                      {/*funkcija handleSearch se pokrecen a gumb u klasi search-button*/}
          <form className="search-panel" onSubmit={handleSearch}>
            <label>
              <span>Polazak</span>
              <input
                type="date"
                value={startDate} //prikz pocetnog datuma 
                onChange={(event) => setStartDate(event.target.value)}
                required    //event-dogadaj promjene  
                
              />  
            </label>
      
            <label>
              <span>Povratak</span>   {/* polje za povrtak gore je polazak  */}
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                required
              />
            </label>

            <label>
              <span>Polazna luka</span>
              <select   //select jer daje padaju mogucnost odabira 
                value={selectedPort}  //default luka 
                onChange={(event) => setSelectedPort(event.target.value)}
              >
                <option>Sve luke</option>
                <option>Split</option>
                <option>Zadar</option>
                <option>Dubrovnik</option>
              </select>
            </label>

            <label>
              <span>Vrsta plovila</span>
              <select
                value={selectedKind}  //default vrsta plov
                onChange={(event) => setSelectedKind(event.target.value)}
              >
                <option>Sve vrste</option>
                <option>Jedrilica</option>
                <option>Motorna jahta</option>
                <option>Katamaran</option>
              </select>
            </label>

            <label>
              <span>Broj osoba</span>
              <input
                type="number"
                min="1"
                max="10"
                value={people}
                onChange={(event) => setPeople(Number(event.target.value))}
                required
              />
            </label>

            <button className="search-button" type="submit">
              Traži plovila
            </button>

            {dateError && (
              <p className="form-error" role="alert">{dateError}</p>
            )}
          </form>

          <p className="demo-note">
            Probni podaci!!
          </p>
        </section>

        

        <section className="results-section" id="plovila">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {hasSearched ? 'Prema tvojim kriterijima' : 'Istraži ponudu'}
              </p>
              <h2>{hasSearched ? 'Rezultati pretrage' : 'Izdvojena plovila'}</h2>
            </div>
            <span className="result-count">
              {filteredBoats.length} {filteredBoats.length === 1 ? 'plovilo' : 'plovila'}
            </span>
          </div>

          {filteredBoats.length > 0 ? (
            <div className="boat-grid">
              {filteredBoats.map((boat, index) => (
                <article className="boat-card" key={boat.id}>
                  <div
                    className={'boat-illustration boat-illustration-' + (index + 1)}
                    aria-hidden="true"
                  >
                    <span>{index === 1 ? '🛥️' : index === 2 ? '⛵' : '🚤'}</span>
                    <span className="water-line"></span>
                  </div>

                  <div className="boat-details">
                    <div className="boat-title-row">
                      <div>
                        <p className="boat-kind">{boat.kind}</p>
                        <h3>{boat.name}</h3>
                      </div>
                      <span className="capacity">Do {boat.capacity} osoba</span>
                    </div>

                    <p className="boat-description">{boat.description}</p>

                    <div className="boat-footer">
                      <span>Polazak iz {boat.port}</span>
                      <strong>
                        {euro.format(boat.dailyPrice)}
                        <small> / dan</small>
                      </strong>
                    </div>

                    <button
                      className="details-button"
                      type="button"
                      onClick={() => setSelectedBoat(boat)}
                    >
                      Pogledaj detalje
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <h3>Nema plovila za odabrane kriterije</h3>
              <p>Promijeni datume ili neki od filtera pa pokušaj ponovno.</p>
              <button className="details-button" type="button" onClick={resetSearch}>
                Očisti kriterije
              </button>
            </div>
          )}
        </section>
      </div>

      <footer id="kontakt">
        <span>ChartIt</span>
        <span>Probni prikaz aplikacije za najam plovila</span>
      </footer>

      {selectedBoat && (  
        <div className="dialog-backdrop">
          <section
            className="boat-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="boat-dialog-title"
          >
            <button
              className="dialog-close"
              type="button"
              aria-label="Zatvori detalje"
              onClick={() => setSelectedBoat(null)}
            >
              ×
            </button>
            <p className="eyebrow">{selectedBoat.kind}</p>
            <h2 id="boat-dialog-title">{selectedBoat.name}</h2>
            <p>{selectedBoat.description}</p>
            <div className="dialog-facts">
              <span>Polazna luka<strong>{selectedBoat.port}</strong></span>
              <span>Kapacitet<strong>{selectedBoat.capacity} osoba</strong></span>
              <span>Cijena<strong>{euro.format(selectedBoat.dailyPrice)} / dan</strong></span>
              <span>Demo termin<strong>{selectedBoat.availableFrom} – {selectedBoat.availableUntil}</strong></span>
            </div>
            <p className="dialog-note">
              Ovo su ogledni podaci. Rezervacija i stvarna raspoloživost još nisu povezane.
            </p>
          </section>
        </div>
      )}
    </div>
  )
}

export default HomePage
