# Ogre3D Tippmix webalkalmazás – biztonságos GitHub Excel-mentéssel

Ez a csomag a meglévő `tippmix.xlsx` munkafüzetet használja adatforrásként, és a mentési kéréseket a Vercel szerveroldali `/api/save` végpontján keresztül küldi a GitHubra. A GitHub-token nem kerül az `index.html` fájlba és nem látható a böngészőben.

## Fontos

- A GitHub Pages önmagában nem tudja futtatni az `/api/save` szerveroldali végpontot. Ezt a csomagot Vercelre kell telepíteni, és a Vercel által adott webcímet kell használni.
- A GitHubon lévő repository nyilvános, ezért a `tippmix.xlsx` fájl tartalmát bárki megtekintheti és letöltheti.
- A token semmiképp ne kerüljön az `index.html` fájlba. Csak Vercel Environment Variable-ként tárold.
- A meglévő GitHub Actions secret nem osztódik meg automatikusan a Vercellel; a tokent külön fel kell venni a Vercel projektben.

## 1. Töltsd fel a fájlokat a GitHubra

A `Ogre3Dofficial/tippmix` repository `main` ágának gyökerébe töltsd fel / cseréld le az alábbiakat:

- `index.html`
- `tippmix.xlsx`
- `package.json`
- `vercel.json`
- `api/save.js` (az `api` mappával együtt)

## 2. Telepítsd Vercelre

1. Nyisd meg https://vercel.com/new és lépj be GitHub-fiókkal.
2. Importáld a `Ogre3Dofficial/tippmix` repositoryt.
3. Framework preset: `Other` (ha kéri).
4. Root Directory: `./`.
5. Deploy előtt vagy utána nyisd meg a projekt `Settings → Environment Variables` részét, és add hozzá:

   - `GITHUB_TOKEN` = a fine-grained GitHub token értéke
   - `SAVE_PASSWORD` = egy saját, erős mentési jelszó (ne a GitHub-token legyen)

   Mindkettőt `Production` környezethez add hozzá (és Preview-hoz is, ha ott is tesztelnél). A token csak a `tippmix` repositoryhoz és `Contents: Read and write` jogosultságra legyen korlátozva.

6. Mentsd a változókat, majd indíts új deploymentet / redeployt, hogy érvénybe lépjenek.

## 3. Használat

- Nyisd meg a Vercel által adott webcímet (ne a GitHub Pages címet), például `https://<projektneved>.vercel.app`.
- Az oldal a GitHub nyilvános `tippmix.xlsx` fájljából tölti be a fogadásokat.
- A „Mentési jelszó” mezőbe írd be a Vercelben beállított `SAVE_PASSWORD` értéket.
- A „Fogadás mentése” gomb a `/api/save` végponton keresztül frissíti a GitHub `main` ágán lévő `tippmix.xlsx` fájlt.

## Működés és korlátok

- A szerveroldali mentés a `Tippmix napló` munkalap C:I és J:K oszlopait írja újra a webes fogadáslistából, és a többi munkalapot megőrzi. Első használat előtt legyen biztonsági másolatod.
- Az Excel mentése GitHub commitot hoz létre. Ne szerkessz egyszerre több eszközön, mert az egymásra mentések ütközhetnek.
- A jelszó minden mentési kérésben elküldésre kerül HTTPS-en a saját Vercel végpontodra; a szerver összehasonlítja a `SAVE_PASSWORD` környezeti változóval. Ne használj olyan jelszót, amit máshol is használsz.
- A webes oldalon látható jelszómező nem helyettesít teljes felhasználói fiókrendszert. Ha a repository és az alkalmazás nyilvános, a mentési végpont URL-je is ismert lesz; a jelszó védi a mentési műveletet.
- A dátumokat ISO `YYYY-MM-DD` formában kezeljük, hogy ne csússzanak el időzóna miatt.


### Friss betöltés
A `api/load.js` végpont minden oldalbetöltéskor közvetlenül a GitHub API-ból olvassa ki a `tippmix.xlsx` aktuális verzióját, `no-store` gyorsítótár-tiltással. A frontend már nem a `raw.githubusercontent.com` CDN-változatát használja betöltéshez. A módosítás életbe lépéséhez ezt a csomagot töltsd fel a GitHub repositoryba, majd várd meg a Vercel új deploymentjét.
