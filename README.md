# Ogre3D Tippmix webalkalmazás – induló verzió

## Mi van ebben a csomagban?
- `index.html`: mobilbarát webes felület; fogadások hozzáadása/szerkesztése/törlése, profit, nyerési arány, ROI, heti és havi összesítés, CSV import/export.
- `supabase-schema.sql`: közös adatbázis kiinduló sémája.
- `README.md`: közzétételi útmutató.

## Fontos a jelenlegi működésről
Az `index.html` első változata a böngésző helyi tárolójába ment (`localStorage`). Ez önmagában NEM szinkronizál PC, iPhone és más böngészők között. A többeszközös szinkronhoz Supabase beállítás, felhasználói bejelentkezés és a front-end adatbázis-kapcsolat bekötése szükséges. Ne tedd közzé a Supabase `service_role` kulcsát.

## GitHub Pages közzététel
1. Jelentkezz be a GitHubra `Ogre3Dofficial` néven.
2. Nyisd meg vagy hozd létre a nyilvános `tippmix` repositoryt: https://github.com/Ogre3Dofficial/tippmix
3. `Add file` → `Upload files`, majd töltsd fel az `index.html` fájlt és ezt a README-t. Commit changes.
4. Repository → `Settings` → `Pages`.
5. `Build and deployment`: `Deploy from a branch`; Branch: `main`; folder: `/ (root)`; Save.
6. Néhány perc múlva az oldal címe: https://ogre3dofficial.github.io/tippmix/

## Többeszközös adatbázis (Supabase)
1. Hozz létre projektet a https://supabase.com/ oldalon.
2. SQL Editor → New query, másold be és futtasd a `supabase-schema.sql` tartalmát.
3. Authentication → Providers részen engedélyezd az Email szolgáltatót; hozz létre saját felhasználót.
4. A teljes, biztonságos szinkronizáláshoz az oldalt be kell kötni a Supabase Auth és adatbázis API használatára. A séma önmagában még nem kapcsolja át a jelenlegi localStorage-alapú felületet online tárolásra.
5. Ne tedd nyilvánossá a jelszavadat, `service_role` kulcsodat vagy privát hozzáférési adataidat.

## Excel-adatok
Az eredeti munkafüzet külön lapokat tartalmaz: `Tippmix napló`, `Havi elemzés`, `Heti elemzés`, `Statisztika`, `Használat`. A webes felület jelenlegi első verziója egy alap fogadásnaplót valósít meg; a meglévő Excel-adatok importálása/átalakítása külön lépés, mert az Excel-lapok képletei és a webes adatmodell nem azonosak.
