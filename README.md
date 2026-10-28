# Tippmix webes felület – dátum és heti/havi elemzés javítás

## Javítások
- Az Excel dátumait Excel-sorszám alapján olvassa be, helyi időzóna-eltolás nélkül.
- A korábbi `ogre3d-tippmix-v2` helyi tárolóban levő Excel-importált soroknál egyszeri dátumkorrekciót végez a v3 tárolóba másoláskor.
- Heti és havi elemzésben megjelenik a megtett tét és a ROI is. A ROI = profit / lezárt fogadások téte; a megtett tét a csoport összes fogadásának téte.

## Telepítés
A GitHub repository gyökérkönyvtárában cseréld le az `index.html` fájlt erre a verzióra. A `tippmix.xlsx` maradjon ugyanott. Commit changes, majd a weboldalon `Ctrl+F5`.

Megjegyzés: a böngészőben már elmentett sorokat az oldal új v3 tárolóba migrálja. Mielőtt törölnéd a régi tárolót, exportáld az adatokat CSV-be biztonsági mentésként.
