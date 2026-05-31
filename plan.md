## Restart-plan for `prosjekt1000` (forberedelse)

Mål: starte prosjektet på nytt med samme idé (Bli Sikker læringsplattform), men med en ryddig, konsekvent struktur og færre path-feil.

### 1) Hva som er funnet nå
- Repoet har to parallelle varianter av nettsiden:
  - `BliSikker/`
  - `hva kunden ser/`
- Mange sider og assets er duplisert mellom disse.
- Det finnes ingen tydelig build/test-pipeline i repoet (ingen `package.json`, `README`, `Makefile` eller tilsvarende).
- Prosjektet er i praksis en statisk HTML/CSS/JS-side med relative stier.

### 2) Foreslått ny startstruktur
```text
site/
  assets/
    images/
    icons/
  pages/
    hjem/
      index.html
      hjem.css
      hjem.js
    fag/
      index.html
      fag.css
      fag.js
    booking/
      index.html
      booking.css
      booking.js
    om-oss/
      index.html
      om-oss.css
      om-oss.js
    priser/
      index.html
      priser.css
      priser.js
    kontakt-oss/
      index.html
      kontakt-oss.css
      kontakt-oss.js
    registrering/
      index.html
      registrering.js
    logg-inn/
      index.html
```

### 3) Migreringsregler (for når ombygging starter)
1. Velg én kilde av gangen (anbefalt: `BliSikker/`) og flytt side for side.
2. Samle alle bilder i `site/assets/images/`.
3. Standardiser navn:
   - små bokstaver
   - bindestrek i mappenavn
   - `index.html` per side
4. Oppdater alle referanser:
   - HTML: `href`, `src`
   - CSS: `url(...)`
   - JS: `window.location`, dynamiske paths
5. Verifiser sidevis etter flytting (hjem → fag → booking ...), før neste side flyttes.

### 4) Første praktiske restart-rekkefølge
1. Lag ny `site/`-struktur tom.
2. Migrer `hjem` fullt ut, inkludert alle assets-paths.
3. Migrer `fag` og `booking` (viktigste brukerflyt).
4. Migrer resterende sider.
5. Fjern gammel duplisert struktur først når alt er verifisert.

### 5) Avklaringer før selve rebuild
- Skal vi bruke kun norsk navnestandard i filer/mappenavn?
- Skal `hva kunden ser/` slettes helt etter migrering?
- Skal vi beholde dagens designuttrykk, men rydde kode, eller redesigne samtidig?
