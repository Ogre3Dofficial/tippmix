# Tippmix webes felület – az eredeti Excelből indul

Ez a változat a meglévő `Tippmix_kezelo_heti_es_havi_elemzessel(1).xlsx` munkafüzetből tölti be a fogadási sorokat. A webalkalmazás a fájlt `tippmix.xlsx` néven keresi az `index.html` mellett.

## GitHub feltöltés
1. Nyisd meg https://github.com/Ogre3Dofficial/tippmix
2. Töltsd fel a csomagból az `index.html` és `tippmix.xlsx` fájlokat a repository gyökerébe (a README opcionális).
3. Engedélyezd a GitHub Pages-t: Settings → Pages → Deploy from a branch → `main` → `/(root)`.
4. Nyisd meg: https://ogre3dofficial.github.io/tippmix/

## Fontos korlátozás
- Az oldal az eredeti Excelből tölti be a meglévő dátumokat, téteket, oddsokat és eredményeket.
- Az Excelben nincs külön meccsnév/tipp oszlop a fogadásnaplóban, ezért ezek a mezők üresek lesznek.
- Az oldal jelenleg a szerkesztéseket a megnyitott böngésző helyi tárolójába menti. Másik eszközön ugyanaz az Excel-alapállapot töltődik be, de a későbbi módosítások nem szinkronizálódnak. Ehhez külön online adatbázis és bejelentkezés szükséges; GitHub Pages önmagában nem tud biztonságosan közös, szerkeszthető fájlt tárolni.
- A munkafüzet fájlt közvetlenül nem írja át, így az eredeti Excel és a képletek/diagramok megmaradnak a repositoryban. Az appon végzett módosítások egyelőre nem kerülnek vissza az Excel-fájlba.
- Az Excel beolvasásához a SheetJS könyvtárat CDN-ről tölti be, ezért első megnyitáskor internetkapcsolat szükséges.
