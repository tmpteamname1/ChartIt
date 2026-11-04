# 6. Postavljanje, instalacija i konfiguracija

## Medijske datoteke (fotografije plovila)

Fotografije plovila koje učitavaju vlasnici spremaju se u datotečni sustav poslužitelja, u mapu zadanu postavkom `MEDIA_ROOT`, a dostupne su na putanji `/media/` (poglavlje 4.7). Rješenje je odabrano jer ne zahtijeva dodatnu uslugu ni ključeve i dovoljno je za opseg projekta.

| Okruženje | Mapa (`DJANGO_MEDIA_ROOT`) | Napomena |
| --- | --- | --- |
| Lokalno (venv ili Docker) | `backend/media/` (zadano) | Mapa nije u gitu. U Dockeru je `backend/` montiran u kontejner, pa datoteke ostaju na računalu i nakon `docker compose down`. |
| Azure App Service | `/home/media` | `/home` je jedina pohrana koja ostaje nakon ponovnog pokretanja. Mapa je izvan `/home/site/wwwroot`, koju svako postavljanje zamjenjuje novom verzijom koda. |

### Posluživanje

WhiteNoise poslužuje samo datoteke koje postoje pri pokretanju aplikacije (statičke datoteke i izgrađeni React), a ne datoteke učitane kasnije. Zato `/media/` u svim okruženjima poslužuje Django (pogled `media` u `backend/config/views.py`). U razvoju Vite prosljeđuje `/media` na Django, kao i `/api`.

Ovaj način je sporiji od posluživanja preko zasebnog poslužitelja ili pohrane u oblaku, ali je za broj fotografija i korisnika u projektu dovoljan. Razmotrene alternative:

- Azure Blob Storage uz `django-storages`: fotografije ne opterećuju aplikaciju i ne ovise o disku App Servicea, ali zahtijevaju dodatnu uslugu, ključ za pristup i drugačije postavljanje u razvoju. Ostaje mogući sljedeći korak ako fotografija bude puno ili aplikacija dobije više instanci.
- WhiteNoise: nije moguće, jer ne vidi datoteke učitane nakon pokretanja.

### Ograničenja učitavanja

Polja za slike koriste zajedničke validatore `IMAGE_VALIDATORS` iz `backend/config/validators.py`:

- dopuštene vrste: jpg, jpeg, png i webp,
- najveća veličina: 5 MB po datoteci (besplatni plan App Servicea ima ukupno 1 GB prostora),
- Django admin i DRF serijalizatori otvaraju datoteku bibliotekom Pillow i odbijaju sve što nije stvarna slika, bez obzira na nastavak.

Primjer u modelu:

```python
from config.validators import IMAGE_VALIDATORS

image = models.ImageField(upload_to='vessels/', validators=IMAGE_VALIDATORS)
```

Datoteke se poslužuju s istog origina kao aplikacija, pa se ne smiju dopuštati vrste koje preglednik može izvršiti (npr. SVG ili HTML). Zaglavlje `X-Content-Type-Options: nosniff` (Django `SecurityMiddleware`) dodatno sprječava da preglednik datoteku protumači kao drugu vrstu.
